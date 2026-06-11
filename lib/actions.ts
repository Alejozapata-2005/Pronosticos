"use server";

import { db } from "./db/index";
import { predictGoalscorers } from "./model/scorers";

export async function getTournamentSims() {
  return db.prepare(`
    SELECT ts.*, t.name, t.flag, t.code, t.group_letter
    FROM tournament_sims ts
    JOIN teams t ON ts.team_id = t.id
    ORDER BY ts.champion_prob DESC
  `).all() as any[];
}

export async function getFixtures() {
  return db.prepare(`
    SELECT f.*, 
           t_home.name as home_name, t_home.flag as home_flag, t_home.code as home_code,
           t_away.name as away_name, t_away.flag as away_flag, t_away.code as away_code,
           p.home_win_prob, p.draw_prob, p.away_win_prob
    FROM fixtures f
    JOIN teams t_home ON f.home_team_id = t_home.id
    JOIN teams t_away ON f.away_team_id = t_away.id
    LEFT JOIN predictions p ON f.id = p.fixture_id
    ORDER BY f.date ASC, f.id ASC
  `).all() as any[];
}

/**
 * Safely parse JSON string with fallback
 * Returns null if the JSON is invalid, undefined, or the literal string "undefined"
 */
function safeJsonParse(jsonString: string | null | undefined, fieldName: string): any {
  try {
    if (!jsonString || typeof jsonString !== 'string') {
      console.warn(`[getFixtureDetail] Field '${fieldName}' is null, undefined, or not a string`);
      return null;
    }

    if (jsonString === 'undefined') {
      console.warn(`[getFixtureDetail] Field '${fieldName}' contains literal string "undefined"`);
      return null;
    }

    return JSON.parse(jsonString);
  } catch (parseError) {
    console.error(`[getFixtureDetail] Failed to parse JSON for field '${fieldName}':`, parseError, `Raw value: ${jsonString}`);
    return null;
  }
}

export async function getFixtureDetail(id: number) {
  try {
    /* Validate input */
    if (!Number.isInteger(id) || id <= 0) {
      console.warn(`[getFixtureDetail] Invalid fixture ID: ${id}`);
      return null;
    }

    /* Fetch fixture with team details */
    const fixture = db.prepare(`
      SELECT f.*, 
             t_home.name as home_name, t_home.flag as home_flag, t_home.code as home_code, t_home.off_strength as home_off, t_home.def_strength as home_def, t_home.fifa_ranking as home_fifa,
             t_away.name as away_name, t_away.flag as away_flag, t_away.code as away_code, t_away.off_strength as away_off, t_away.def_strength as away_def, t_away.fifa_ranking as away_fifa
      FROM fixtures f
      JOIN teams t_home ON f.home_team_id = t_home.id
      JOIN teams t_away ON f.away_team_id = t_away.id
      WHERE f.id = ?
    `).get(id) as any;

    if (!fixture) {
      console.warn(`[getFixtureDetail] Fixture with ID ${id} not found in database`);
      return null;
    }

    /* Fetch prediction data with robust JSON parsing */
    const prediction = db.prepare(`
      SELECT * FROM predictions WHERE fixture_id = ?
    `).get(id) as any;

    /* Fetch players for both teams */
    const homePlayers = db.prepare(`
      SELECT * FROM players WHERE team_id = ?
    `).all(fixture.home_team_id) as any[];

    const awayPlayers = db.prepare(`
      SELECT * FROM players WHERE team_id = ?
    `).all(fixture.away_team_id) as any[];

    /* Calculate dynamic scorer predictions if prediction data is present */
    let scorerPredictions: any[] = [];
    let parsedPrediction: any = null;

    if (prediction) {
      /* Safely parse JSON fields with fallbacks */
      const exactScores = safeJsonParse(prediction.exact_scores, 'exact_scores') || [];
      const overUnder = safeJsonParse(prediction.over_under, 'over_under') || {};

      if (exactScores && Array.isArray(exactScores)) {
        const zeroZero = exactScores.find((s: any) => s?.home === 0 && s?.away === 0);
        const noGoalProb = zeroZero?.probability ?? 0.08;

        /* Calculate lambdas for Poisson distribution */
        const globalMean = 1.35;
        const fifaDiff = fixture.away_fifa - fixture.home_fifa;
        const rankAdjustment = fifaDiff * 0.002;
        
        let homeLambda = fixture.home_off * fixture.away_def * globalMean + rankAdjustment;
        let awayLambda = fixture.away_off * fixture.home_def * globalMean - rankAdjustment;
        
        if (homeLambda < 0.1) homeLambda = 0.1;
        if (awayLambda < 0.1) awayLambda = 0.1;

        /* Generate scorer predictions */
        try {
          scorerPredictions = predictGoalscorers(
            homePlayers.map(p => ({ name: p.name, position: p.position, goal_ratio: p.goal_ratio })),
            awayPlayers.map(p => ({ name: p.name, position: p.position, goal_ratio: p.goal_ratio })),
            homeLambda,
            awayLambda,
            noGoalProb
          );
        } catch (scorerError) {
          console.error(`[getFixtureDetail] Error calculating scorer predictions for fixture ${id}:`, scorerError);
          scorerPredictions = [];
        }
      }

      /* Return parsed prediction data with safe JSON values */
      parsedPrediction = {
        ...prediction,
        over_under: overUnder,
        exact_scores: exactScores
      };
    }

    return {
      fixture,
      prediction: parsedPrediction,
      scorerPredictions
    };
  } catch (error) {
    console.error(`[getFixtureDetail] Unexpected error fetching fixture details for ID ${id}:`, error);
    return null;
  }
}

export interface ProjectedStanding {
  id: string;
  name: string;
  code: string;
  flag: string;
  group_letter: string;
  projectedPoints: number;
  projectedGoalsFor: number;
  projectedGoalsAgainst: number;
  projectedGoalDifference: number;
}

export async function getProjectedStandings() {
  const teams = db.prepare("SELECT * FROM teams").all() as any[];
  const fixtures = db.prepare(`
    SELECT f.*, p.home_win_prob, p.draw_prob, p.away_win_prob, t_home.off_strength as h_off, t_home.fifa_ranking as h_fifa, t_away.off_strength as a_off, t_away.fifa_ranking as a_fifa, t_home.def_strength as h_def, t_away.def_strength as a_def
    FROM fixtures f
    JOIN predictions p ON f.id = p.fixture_id
    JOIN teams t_home ON f.home_team_id = t_home.id
    JOIN teams t_away ON f.away_team_id = t_away.id
    WHERE f.round = 'Group'
  `).all() as any[];

  const standingsMap: Record<string, ProjectedStanding> = {};

  for (const team of teams) {
    standingsMap[team.id] = {
      id: team.id,
      name: team.name,
      code: team.code,
      flag: team.flag,
      group_letter: team.group_letter,
      projectedPoints: 0,
      projectedGoalsFor: 0,
      projectedGoalsAgainst: 0,
      projectedGoalDifference: 0
    };
  }

  const globalMean = 1.35;

  for (const fix of fixtures) {
    const home = standingsMap[fix.home_team_id];
    const away = standingsMap[fix.away_team_id];

    if (!home || !away) {
      continue;
    }

    /* Expected points */
    const homeExpPoints = fix.home_win_prob * 3 + fix.draw_prob * 1;
    const awayExpPoints = fix.away_win_prob * 3 + fix.draw_prob * 1;

    /* Expected goals */
    const fifaDiff = fix.a_fifa - fix.h_fifa;
    const rankAdjustment = fifaDiff * 0.002;
    let homeLambda = fix.h_off * fix.a_def * globalMean + rankAdjustment;
    let awayLambda = fix.a_off * fix.h_def * globalMean - rankAdjustment;
    if (homeLambda < 0.1) homeLambda = 0.1;
    if (awayLambda < 0.1) awayLambda = 0.1;

    home.projectedPoints += homeExpPoints;
    home.projectedGoalsFor += homeLambda;
    home.projectedGoalsAgainst += awayLambda;

    away.projectedPoints += awayExpPoints;
    away.projectedGoalsFor += awayLambda;
    away.projectedGoalsAgainst += homeLambda;
  }

  /* Calculate goal differences and group by letter */
  const standings = Object.values(standingsMap).map(s => {
    s.projectedGoalDifference = s.projectedGoalsFor - s.projectedGoalsAgainst;
    return s;
  });

  const groups: Record<string, ProjectedStanding[]> = {};
  for (const std of standings) {
    if (!groups[std.group_letter]) {
      groups[std.group_letter] = [];
    }
    groups[std.group_letter].push(std);
  }

  /* Sort standings within each group */
  for (const letter of Object.keys(groups)) {
    groups[letter].sort((a, b) => {
      if (Math.abs(b.projectedPoints - a.projectedPoints) > 0.01) {
        return b.projectedPoints - a.projectedPoints;
      }
      if (Math.abs(b.projectedGoalDifference - a.projectedGoalDifference) > 0.01) {
        return b.projectedGoalDifference - a.projectedGoalDifference;
      }
      return b.projectedGoalsFor - a.projectedGoalsFor;
    });
  }

  return groups;
}
