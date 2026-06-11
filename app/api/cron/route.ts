import { NextResponse } from "next/server";
import { initDb, seedDb } from "@/lib/db/schema";
import { predictMatch } from "@/lib/model/poisson";
import { predictCardsAndCorners } from "@/lib/model/cards_corners";
import { runMonteCarlo } from "@/lib/model/montecarlo";
import { db } from "@/lib/db";

/*
Vercel Cron route. Called once per day via vercel.json schedule.
Protected by CRON_SECRET so random callers cannot trigger it.
*/
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  /* If CRON_SECRET is set, validate the bearer token */
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    initDb();
    seedDb();

    const fixtures = db.prepare("SELECT * FROM fixtures").all() as any[];
    const teams = db.prepare("SELECT * FROM teams").all() as any[];
    const timestamp = new Date().toISOString();
    const globalMean = 1.35;

    const insertPrediction = db.prepare(`
      INSERT OR REPLACE INTO predictions (
        fixture_id, home_win_prob, draw_prob, away_win_prob,
        over_under_probs, btts_prob, exact_scores,
        corners_line, yellow_cards_line, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    db.transaction(() => {
      for (const fix of fixtures) {
        const homeTeam = db.prepare("SELECT * FROM teams WHERE id = ?").get(fix.home_team_id) as any;
        const awayTeam = db.prepare("SELECT * FROM teams WHERE id = ?").get(fix.away_team_id) as any;
        if (!homeTeam || !awayTeam) continue;

        const fifaDiff = awayTeam.fifa_ranking - homeTeam.fifa_ranking;
        const pred = predictMatch(homeTeam.off_strength, homeTeam.def_strength, awayTeam.off_strength, awayTeam.def_strength, fifaDiff);
        const cardsAndCorners = predictCardsAndCorners(homeTeam.off_strength, homeTeam.def_strength, awayTeam.off_strength, awayTeam.def_strength);

        insertPrediction.run(
          fix.id, pred.home_win_prob, pred.draw_prob, pred.away_win_prob,
          JSON.stringify(pred.over_under), pred.btts_prob, JSON.stringify(pred.exact_scores),
          cardsAndCorners.corners_line, cardsAndCorners.yellow_cards_line, timestamp
        );
      }
    })();

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
          res.champion / simCount, res.finalist / simCount,
          res.semifinalist / simCount, res.quarterfinalist / simCount,
          res.roundOf32 / simCount, timestamp
        );
      }
    })();

    return NextResponse.json({
      ok: true,
      fixtures: fixtures.length,
      teams: teams.length,
      simulations: simCount,
      timestamp
    });
  } catch (err: any) {
    console.error("Cron route error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
