import fs from "fs";
import path from "path";

/*
  On Vercel the filesystem under process.cwd() is read-only.
  Writes go to /tmp (ephemeral but writable).
  Reads check /tmp first (populated by the cron route), then fall back
  to the committed seed file at the project root.
*/
const IS_VERCEL = process.env.VERCEL === "1";
const writePath = IS_VERCEL
  ? "/tmp/worldcup2026.json"
  : path.resolve(process.cwd(), "worldcup2026.json");
const seedPath = path.resolve(process.cwd(), "worldcup2026.json");

interface DbData {
  teams: any[];
  players: any[];
  fixtures: any[];
  predictions: any[];
  tournament_sims: any[];
}

class JsonDatabase {
  private data: DbData;

  constructor() {
    this.data = {
      teams: [],
      players: [],
      fixtures: [],
      predictions: [],
      tournament_sims: []
    };
    this.load();
  }

  private load() {
    try {
      /* On Vercel: check /tmp first (written by the cron route), then fall back to the committed seed file */
      const readPath = (IS_VERCEL && fs.existsSync(writePath))
        ? writePath
        : seedPath;
      if (fs.existsSync(readPath)) {
        const fileContent = fs.readFileSync(readPath, "utf-8");
        this.data = JSON.parse(fileContent);
      }
    } catch (err) {
      console.error("Failed to load JSON database, initializing empty:", err);
    }
  }

  private save() {
    try {
      fs.writeFileSync(writePath, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to save JSON database:", err);
    }
  }

  /* Mock pragma and exec */
  pragma(sql: string) {
    return this;
  }

  exec(sql: string) {
    /* No-op, schemas are handled automatically */
    return this;
  }

  transaction(fn: (...args: any[]) => any) {
    return (...args: any[]) => {
      const result = fn(...args);
      this.save();
      return result;
    };
  }

  prepare(sql: string) {
    const cleanSql = sql.trim().replace(/\s+/g, " ");
    const self = this;

    return {
      run(...params: any[]) {
        if (cleanSql.includes("INSERT INTO teams")) {
          const [id, name, code, flag, group_letter, fifa_ranking, off_strength, def_strength] = params;
          self.data.teams = self.data.teams.filter(t => t.id !== id);
          self.data.teams.push({ id, name, code, flag, group_letter, fifa_ranking, off_strength, def_strength });
        }
        else if (cleanSql.includes("INSERT INTO players")) {
          const [team_id, name, position, goal_ratio] = params;
          const nextId = self.data.players.length + 1;
          self.data.players.push({ id: nextId, team_id, name, position, goal_ratio });
        }
        else if (cleanSql.includes("INSERT INTO fixtures")) {
          const [home_team_id, away_team_id, date, status, group_letter, round] = params;
          const nextId = self.data.fixtures.length + 1;
          self.data.fixtures.push({
            id: nextId,
            home_team_id,
            away_team_id,
            date,
            status,
            home_score: null,
            away_score: null,
            group_letter,
            round
          });
        }
        else if (cleanSql.includes("INSERT OR REPLACE INTO predictions")) {
          const [
            fixture_id, home_win_prob, draw_prob, away_win_prob,
            over_under_probs, btts_prob, exact_scores,
            corners_line, yellow_cards_line, timestamp
          ] = params;

          self.data.predictions = self.data.predictions.filter(p => p.fixture_id !== fixture_id);
          self.data.predictions.push({
            fixture_id, home_win_prob, draw_prob, away_win_prob,
            over_under_probs, btts_prob, exact_scores,
            corners_line, yellow_cards_line, timestamp
          });
        }
        else if (cleanSql.includes("INSERT OR REPLACE INTO tournament_sims")) {
          const [team_id, champion_prob, reach_final_prob, reach_semi_prob, reach_quarter_prob, reach_r32_prob, timestamp] = params;
          self.data.tournament_sims = self.data.tournament_sims.filter(ts => ts.team_id !== team_id);
          self.data.tournament_sims.push({
            team_id, champion_prob, reach_final_prob, reach_semi_prob, reach_quarter_prob, reach_r32_prob, timestamp
          });
        }
        self.save();
        return { changes: 1 };
      },

      get(...params: any[]) {
        if (cleanSql.includes("SELECT COUNT(*) as count FROM teams")) {
          return { count: self.data.teams.length };
        }
        else if (cleanSql.includes("SELECT * FROM teams WHERE id = ?")) {
          const [id] = params;
          return self.data.teams.find(t => t.id === id) || null;
        }
        else if (cleanSql.includes("SELECT * FROM predictions WHERE fixture_id = ?")) {
          const [fixture_id] = params;
          return self.data.predictions.find(p => p.fixture_id === fixture_id) || null;
        }
        else if (cleanSql.includes("SELECT f.*, t_home.name as home_name") && cleanSql.includes("WHERE f.id = ?")) {
          const [id] = params;
          const fix = self.data.fixtures.find(f => f.id === id);
          if (!fix) return null;

          const t_home = self.data.teams.find(t => t.id === fix.home_team_id);
          const t_away = self.data.teams.find(t => t.id === fix.away_team_id);

          return {
            ...fix,
            home_name: t_home?.name, home_flag: t_home?.flag, home_code: t_home?.code, home_off: t_home?.off_strength, home_def: t_home?.def_strength, home_fifa: t_home?.fifa_ranking,
            away_name: t_away?.name, away_flag: t_away?.flag, away_code: t_away?.code, away_off: t_away?.off_strength, away_def: t_away?.def_strength, away_fifa: t_away?.fifa_ranking
          };
        }
        return null;
      },

      all(...params: any[]) {
        if (cleanSql.includes("SELECT * FROM teams")) {
          return self.data.teams;
        }
        else if (cleanSql.includes("SELECT * FROM fixtures")) {
          return self.data.fixtures;
        }
        else if (cleanSql.includes("SELECT * FROM players WHERE team_id = ?")) {
          const [team_id] = params;
          return self.data.players.filter(p => p.team_id === team_id);
        }
        else if (cleanSql.includes("SELECT * FROM players")) {
          return self.data.players;
        }
        else if (cleanSql.includes("SELECT ts.*, t.name")) {
          /* Join tournament_sims and teams */
          return self.data.tournament_sims.map(ts => {
            const t = self.data.teams.find(team => team.id === ts.team_id);
            return {
              ...ts,
              name: t?.name || "",
              flag: t?.flag || "",
              code: t?.code || "",
              group_letter: t?.group_letter || ""
            };
          }).sort((a, b) => b.champion_prob - a.champion_prob);
        }
        else if (cleanSql.includes("SELECT f.*, t_home.name as home_name") && cleanSql.includes("LEFT JOIN predictions")) {
          /* Join fixtures, teams, and predictions */
          return self.data.fixtures.map(f => {
            const t_home = self.data.teams.find(t => t.id === f.home_team_id);
            const t_away = self.data.teams.find(t => t.id === f.away_team_id);
            const p = self.data.predictions.find(pred => pred.fixture_id === f.id);

            return {
              ...f,
              home_name: t_home?.name || "",
              home_flag: t_home?.flag || "",
              home_code: t_home?.code || "",
              away_name: t_away?.name || "",
              away_flag: t_away?.flag || "",
              away_code: t_away?.code || "",
              home_win_prob: p ? p.home_win_prob : null,
              draw_prob: p ? p.draw_prob : null,
              away_win_prob: p ? p.away_win_prob : null
            };
          }).sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.id - b.id;
          });
        }
        else if (cleanSql.includes("SELECT f.*, p.home_win_prob") && cleanSql.includes("WHERE f.round = 'Group'")) {
          /* Join group stage fixtures, predictions, and teams */
          const groupFixtures = self.data.fixtures.filter(f => f.round === "Group");
          return groupFixtures.map(f => {
            const p = self.data.predictions.find(pred => pred.fixture_id === f.id);
            const t_home = self.data.teams.find(t => t.id === f.home_team_id);
            const t_away = self.data.teams.find(t => t.id === f.away_team_id);

            return {
              ...f,
              home_win_prob: p ? p.home_win_prob : 0.33,
              draw_prob: p ? p.draw_prob : 0.34,
              away_win_prob: p ? p.away_win_prob : 0.33,
              h_off: t_home?.off_strength || 1.0,
              h_fifa: t_home?.fifa_ranking || 50,
              a_off: t_away?.off_strength || 1.0,
              a_fifa: t_away?.fifa_ranking || 50,
              h_def: t_home?.def_strength || 1.0,
              a_def: t_away?.def_strength || 1.0
            };
          });
        }
        return [];
      }
    };
  }
}

export const db = new JsonDatabase();

export interface TeamRow {
  id: string;
  name: string;
  code: string;
  flag: string;
  group_letter: string;
  fifa_ranking: number;
  off_strength: number;
  def_strength: number;
}

export interface PlayerRow {
  id: number;
  team_id: string;
  name: string;
  position: string;
  goal_ratio: number;
}

export interface FixtureRow {
  id: number;
  home_team_id: string;
  away_team_id: string;
  date: string;
  status: string;
  home_score: number | null;
  away_score: number | null;
  group_letter: string;
  round: string;
}

export interface PredictionRow {
  fixture_id: number;
  home_win_prob: number;
  draw_prob: number;
  away_win_prob: number;
  over_under_probs: string;
  btts_prob: number;
  exact_scores: string;
  corners_line: number;
  yellow_cards_line: number;
  timestamp: string;
}

export interface TournamentSimRow {
  team_id: string;
  champion_prob: number;
  reach_final_prob: number;
  reach_semi_prob: number;
  reach_quarter_prob: number;
  reach_r32_prob: number;
  timestamp: string;
}
