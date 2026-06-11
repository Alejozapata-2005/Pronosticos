/*
Daily Recalculation Cron Script.
Populates DB tables, runs Poisson projections on all games,
and executes the 10,000-run Monte Carlo tournament simulation.
No double hyphens in comments.
*/

import { db } from "../lib/db/index";
import { initDb, seedDb } from "../lib/db/schema";
import { predictMatch } from "../lib/model/poisson";
import { predictCardsAndCorners } from "../lib/model/cards_corners";
import { runMonteCarlo } from "../lib/model/montecarlo";

async function main() {
  console.log("Starting World Cup 2026 AI Predictor Cron Job...");

  /* 1. Initialize and Seed database */
  initDb();
  seedDb();
  console.log("Database initialized and seeded.");

  /* 2. Run match predictions for all fixtures */
  const fixtures = db.prepare("SELECT * FROM fixtures").all() as any[];
  console.log(`Calculating predictions for ${fixtures.length} matches...`);

  const insertPrediction = db.prepare(`
    INSERT OR REPLACE INTO predictions (
      fixture_id, home_win_prob, draw_prob, away_win_prob,
      over_under_probs, btts_prob, exact_scores,
      corners_line, yellow_cards_line, timestamp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const timestamp = new Date().toISOString();

  db.transaction(() => {
    for (const fix of fixtures) {
      const homeTeam = db.prepare("SELECT * FROM teams WHERE id = ?").get(fix.home_team_id) as any;
      const awayTeam = db.prepare("SELECT * FROM teams WHERE id = ?").get(fix.away_team_id) as any;

      if (!homeTeam || !awayTeam) {
        continue;
      }

      /* Calculate Poisson match stats */
      const fifaDiff = awayTeam.fifa_ranking - homeTeam.fifa_ranking;
      const pred = predictMatch(
        homeTeam.off_strength,
        homeTeam.def_strength,
        awayTeam.off_strength,
        awayTeam.def_strength,
        fifaDiff
      );

      /* Calculate cards and corners */
      const cardsAndCorners = predictCardsAndCorners(
        homeTeam.off_strength,
        homeTeam.def_strength,
        awayTeam.off_strength,
        awayTeam.def_strength
      );

      insertPrediction.run(
        fix.id,
        pred.home_win_prob,
        pred.draw_prob,
        pred.away_win_prob,
        JSON.stringify(pred.over_under),
        pred.btts_prob,
        JSON.stringify(pred.exact_scores),
        cardsAndCorners.corners_line,
        cardsAndCorners.yellow_cards_line,
        timestamp
      );
    }
  })();
  console.log("Match predictions saved.");

  /* 3. Run Monte Carlo Simulation for Tournament outcomes */
  const teams = db.prepare("SELECT * FROM teams").all() as any[];
  console.log(`Running 10,000-run Monte Carlo tournament simulation...`);
  
  const simCount = 10000;
  const simResults = runMonteCarlo(teams, simCount);

  const insertSim = db.prepare(`
    INSERT OR REPLACE INTO tournament_sims (
      team_id, champion_prob, reach_final_prob, reach_semi_prob,
      reach_quarter_prob, reach_r32_prob, timestamp
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  db.transaction(() => {
    for (const teamId of Object.keys(simResults)) {
      const res = simResults[teamId];
      
      insertSim.run(
        teamId,
        res.champion / simCount,
        res.finalist / simCount,
        res.semifinalist / simCount,
        res.quarterfinalist / simCount,
        res.roundOf32 / simCount,
        timestamp
      );
    }
  })();
  
  console.log("Monte Carlo tournament outcomes updated in database.");
  console.log("Cron job completed successfully!");
}

main().catch(err => {
  console.error("Cron job failed:", err);
  process.exit(1);
});
