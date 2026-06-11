/*
Monte Carlo Simulator for World Cup 2026.
Runs 10,000 simulations of the tournament.
No double hyphens in comments.
*/

import { predictMatch } from "./poisson";

export interface TeamSimState {
  id: string;
  name: string;
  code: string;
  flag: string;
  group_letter: string;
  off_strength: number;
  def_strength: number;
  fifa_ranking: number;
  
  /* Standing stats in a single simulation */
  points: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface SimulationResult {
  team_id: string;
  champion: number;
  finalist: number;
  semifinalist: number;
  quarterfinalist: number;
  roundOf32: number;
}

/* Sample from a Poisson distribution using Knuth's algorithm */
function samplePoisson(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

export function runMonteCarlo(
  teams: any[],
  simCount: number = 10000
): Record<string, SimulationResult> {
  const stats: Record<string, SimulationResult> = {};
  for (const team of teams) {
    stats[team.id] = {
      team_id: team.id,
      champion: 0,
      finalist: 0,
      semifinalist: 0,
      quarterfinalist: 0,
      roundOf32: 0
    };
  }

  const groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

  for (let sim = 0; sim < simCount; sim++) {
    /* Initialize teams for this simulation */
    const simTeams: Record<string, TeamSimState> = {};
    for (const team of teams) {
      simTeams[team.id] = {
        id: team.id,
        name: team.name,
        code: team.code,
        flag: team.flag,
        group_letter: team.group_letter,
        off_strength: team.off_strength,
        def_strength: team.def_strength,
        fifa_ranking: team.fifa_ranking,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0
      };
    }

    /* Simulate Group Stage Matches */
    /* In group stage, each team plays the other 3 in their group */
    for (const group of groups) {
      const groupTeams = Object.values(simTeams).filter(t => t.group_letter === group);
      
      for (let i = 0; i < groupTeams.length; i++) {
        for (let j = i + 1; j < groupTeams.length; j++) {
          const tA = groupTeams[i];
          const tB = groupTeams[j];

          const fifaDiff = tB.fifa_ranking - tA.fifa_ranking;
          const prediction = predictMatch(tA.off_strength, tA.def_strength, tB.off_strength, tB.def_strength, fifaDiff);

          const goalsA = samplePoisson(prediction.home_lambda);
          const goalsB = samplePoisson(prediction.away_lambda);

          tA.goalsFor += goalsA;
          tA.goalsAgainst += goalsB;
          tB.goalsFor += goalsB;
          tB.goalsAgainst += goalsA;

          if (goalsA > goalsB) {
            tA.points += 3;
          } else if (goalsA === goalsB) {
            tA.points += 1;
            tB.points += 1;
          } else {
            tB.points += 3;
          }
        }
      }
    }

    /* Evaluate Group Standings */
    const r32Teams: TeamSimState[] = [];
    const thirdPlaceTeams: TeamSimState[] = [];

    for (const group of groups) {
      const groupTeams = Object.values(simTeams).filter(t => t.group_letter === group);
      
      /* Sort by points, then goal difference, then goals for, then FIFA ranking (lower number is better rank) */
      groupTeams.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        const gdA = a.goalsFor - a.goalsAgainst;
        const gdB = b.goalsFor - b.goalsAgainst;
        if (gdB !== gdA) return gdB - gdA;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        return a.fifa_ranking - b.fifa_ranking;
      });

      /* Top 2 advance */
      r32Teams.push(groupTeams[0], groupTeams[1]);
      /* Third place team goes to buffer */
      thirdPlaceTeams.push(groupTeams[2]);
    }

    /* Sort third place teams to find the top 8 */
    thirdPlaceTeams.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const gdA = a.goalsFor - a.goalsAgainst;
      const gdB = b.goalsFor - b.goalsAgainst;
      if (gdB !== gdA) return gdB - gdA;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.fifa_ranking - b.fifa_ranking;
    });

    /* Add top 8 third-place teams to Round of 32 */
    for (let i = 0; i < 8; i++) {
      r32Teams.push(thirdPlaceTeams[i]);
    }

    /* Record Round of 32 attendance */
    for (const team of r32Teams) {
      stats[team.id].roundOf32++;
    }

    /* Helper function to simulate a single-elimination knockout match */
    const playKnockout = (tA: TeamSimState, tB: TeamSimState): TeamSimState => {
      const fifaDiff = tB.fifa_ranking - tA.fifa_ranking;
      const prediction = predictMatch(tA.off_strength, tA.def_strength, tB.off_strength, tB.def_strength, fifaDiff);

      let goalsA = samplePoisson(prediction.home_lambda);
      let goalsB = samplePoisson(prediction.away_lambda);

      if (goalsA > goalsB) return tA;
      if (goalsB > goalsA) return tB;

      /* Draw: Simulate extra time / penalty shootout (50/50 chance to keep simple) */
      return Math.random() < 0.5 ? tA : tB;
    };

    /* Pair teams for Round of 32 (16 matches) */
    /* r32Teams contains 24 (1st & 2nd) plus 8 (3rd-place) teams */
    /* To simulate a brackets structure, we split them */
    const r16Teams: TeamSimState[] = [];
    for (let i = 0; i < 16; i++) {
      r16Teams.push(playKnockout(r32Teams[i], r32Teams[31 - i]));
    }

    /* Record Quarterfinalist (winners of R16) */
    const r8Teams: TeamSimState[] = [];
    for (let i = 0; i < 8; i++) {
      const winner = playKnockout(r16Teams[2 * i], r16Teams[2 * i + 1]);
      r8Teams.push(winner);
      stats[winner.id].quarterfinalist++;
    }

    /* Record Semifinalist (winners of QF) */
    const r4Teams: TeamSimState[] = [];
    for (let i = 0; i < 4; i++) {
      const winner = playKnockout(r8Teams[2 * i], r8Teams[2 * i + 1]);
      r4Teams.push(winner);
      stats[winner.id].semifinalist++;
    }

    /* Record Finalist & Champion (winners of SF and Final) */
    const finalist1 = playKnockout(r4Teams[0], r4Teams[1]);
    const finalist2 = playKnockout(r4Teams[2], r4Teams[3]);

    stats[finalist1.id].finalist++;
    stats[finalist2.id].finalist++;

    const champion = playKnockout(finalist1, finalist2);
    stats[champion.id].champion++;
  }

  return stats;
}
