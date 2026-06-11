import { db } from "./index";

export function initDb() {
  /* Create tables using SQL without double hyphens */
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      flag TEXT NOT NULL,
      group_letter TEXT NOT NULL,
      fifa_ranking INTEGER NOT NULL,
      off_strength REAL NOT NULL,
      def_strength REAL NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id TEXT NOT NULL,
      name TEXT NOT NULL,
      position TEXT NOT NULL,
      goal_ratio REAL NOT NULL,
      FOREIGN KEY (team_id) REFERENCES teams (id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS fixtures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      home_team_id TEXT NOT NULL,
      away_team_id TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      home_score INTEGER,
      away_score INTEGER,
      group_letter TEXT NOT NULL,
      round TEXT NOT NULL,
      FOREIGN KEY (home_team_id) REFERENCES teams (id),
      FOREIGN KEY (away_team_id) REFERENCES teams (id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS predictions (
      fixture_id INTEGER PRIMARY KEY,
      home_win_prob REAL NOT NULL,
      draw_prob REAL NOT NULL,
      away_win_prob REAL NOT NULL,
      over_under_probs TEXT NOT NULL,
      btts_prob REAL NOT NULL,
      exact_scores TEXT NOT NULL,
      corners_line REAL NOT NULL,
      yellow_cards_line REAL NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (fixture_id) REFERENCES fixtures (id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS tournament_sims (
      team_id TEXT PRIMARY KEY,
      champion_prob REAL NOT NULL,
      reach_final_prob REAL NOT NULL,
      reach_semi_prob REAL NOT NULL,
      reach_quarter_prob REAL NOT NULL,
      reach_r32_prob REAL NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (team_id) REFERENCES teams (id)
    )
  `);
}

export function seedDb() {
  const teamsCount = db.prepare("SELECT COUNT(*) as count FROM teams").get() as { count: number };
  if (teamsCount.count > 0) {
    /* Database already seeded */
    return;
  }

  /* Define 48 teams, 12 groups (A to L) */
  const teamsList = [
    /* Group A */
    { id: "USA", name: "Estados Unidos", code: "USA", flag: "🇺🇸", group_letter: "A", fifa_ranking: 11, off_strength: 1.6, def_strength: 0.9 },
    { id: "COL", name: "Colombia", code: "COL", flag: "🇨🇴", group_letter: "A", fifa_ranking: 12, off_strength: 1.7, def_strength: 0.8 },
    { id: "SEN", name: "Senegal", code: "SEN", flag: "🇸🇳", group_letter: "A", fifa_ranking: 18, off_strength: 1.4, def_strength: 0.9 },
    { id: "NZL", name: "Nueva Zelanda", code: "NZL", flag: "🇳🇿", group_letter: "A", fifa_ranking: 74, off_strength: 0.9, def_strength: 1.4 },

    /* Group B */
    { id: "MEX", name: "México", code: "MEX", flag: "🇲🇽", group_letter: "B", fifa_ranking: 15, off_strength: 1.4, def_strength: 1.0 },
    { id: "ITA", name: "Italia", code: "ITA", flag: "🇮🇹", group_letter: "B", fifa_ranking: 9, off_strength: 1.8, def_strength: 0.7 },
    { id: "MAR", name: "Marruecos", code: "MAR", flag: "🇲🇦", group_letter: "B", fifa_ranking: 13, off_strength: 1.5, def_strength: 0.8 },
    { id: "UZB", name: "Uzbekistán", code: "UZB", flag: "🇺🇿", group_letter: "B", fifa_ranking: 66, off_strength: 1.0, def_strength: 1.2 },

    /* Group C */
    { id: "CAN", name: "Canadá", code: "CAN", flag: "🇨🇦", group_letter: "C", fifa_ranking: 40, off_strength: 1.3, def_strength: 1.1 },
    { id: "GER", name: "Alemania", code: "GER", flag: "🇩🇪", group_letter: "C", fifa_ranking: 16, off_strength: 2.1, def_strength: 0.9 },
    { id: "EGY", name: "Egipto", code: "EGY", flag: "🇪🇬", group_letter: "C", fifa_ranking: 36, off_strength: 1.2, def_strength: 1.0 },
    { id: "AUS", name: "Australia", code: "AUS", flag: "🇦🇺", group_letter: "C", fifa_ranking: 24, off_strength: 1.2, def_strength: 1.1 },

    /* Group D */
    { id: "ARG", name: "Argentina", code: "ARG", flag: "🇦🇷", group_letter: "D", fifa_ranking: 1, off_strength: 2.4, def_strength: 0.5 },
    { id: "DEN", name: "Dinamarca", code: "DEN", flag: "🇩🇰", group_letter: "D", fifa_ranking: 21, off_strength: 1.5, def_strength: 0.9 },
    { id: "ALG", name: "Argelia", code: "ALG", flag: "🇩🇿", group_letter: "D", fifa_ranking: 43, off_strength: 1.2, def_strength: 1.1 },
    { id: "JAM", name: "Jamaica", code: "JAM", flag: "🇯🇲", group_letter: "D", fifa_ranking: 55, off_strength: 1.1, def_strength: 1.3 },

    /* Group E */
    { id: "BRA", name: "Brasil", code: "BRA", flag: "🇧🇷", group_letter: "E", fifa_ranking: 5, off_strength: 2.3, def_strength: 0.6 },
    { id: "POL", name: "Polonia", code: "POL", flag: "🇵🇱", group_letter: "E", fifa_ranking: 30, off_strength: 1.3, def_strength: 1.1 },
    { id: "JPN", name: "Japón", code: "JPN", flag: "🇯🇵", group_letter: "E", fifa_ranking: 17, off_strength: 1.7, def_strength: 0.8 },
    { id: "HON", name: "Honduras", code: "HON", flag: "🇭🇳", group_letter: "E", fifa_ranking: 78, off_strength: 0.8, def_strength: 1.4 },

    /* Group F */
    { id: "FRA", name: "Francia", code: "FRA", flag: "🇫🇷", group_letter: "F", fifa_ranking: 2, off_strength: 2.5, def_strength: 0.6 },
    { id: "ECU", name: "Ecuador", code: "ECU", flag: "🇪🇨", group_letter: "F", fifa_ranking: 27, off_strength: 1.4, def_strength: 0.8 },
    { id: "KOR", name: "Corea del Sur", code: "KOR", flag: "🇰🇷", group_letter: "F", fifa_ranking: 22, off_strength: 1.4, def_strength: 1.0 },
    { id: "PAN", name: "Panamá", code: "PAN", flag: "🇵🇦", group_letter: "F", fifa_ranking: 41, off_strength: 1.1, def_strength: 1.2 },

    /* Group G */
    { id: "ENG", name: "Inglaterra", code: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group_letter: "G", fifa_ranking: 4, off_strength: 2.3, def_strength: 0.7 },
    { id: "URU", name: "Uruguay", code: "URU", flag: "🇺🇾", group_letter: "G", fifa_ranking: 14, off_strength: 1.8, def_strength: 0.8 },
    { id: "TUN", name: "Túnez", code: "TUN", flag: "🇹🇳", group_letter: "G", fifa_ranking: 47, off_strength: 1.0, def_strength: 1.1 },
    { id: "IRQ", name: "Irak", code: "IRQ", flag: "🇮🇶", group_letter: "G", fifa_ranking: 58, off_strength: 1.0, def_strength: 1.3 },

    /* Group H */
    { id: "ESP", name: "España", code: "ESP", flag: "🇪🇸", group_letter: "H", fifa_ranking: 3, off_strength: 2.4, def_strength: 0.6 },
    { id: "CHI", name: "Chile", code: "CHI", flag: "🇨🇱", group_letter: "H", fifa_ranking: 42, off_strength: 1.2, def_strength: 1.0 },
    { id: "NGA", name: "Nigeria", code: "NGA", flag: "🇳🇬", group_letter: "H", fifa_ranking: 28, off_strength: 1.4, def_strength: 1.0 },
    { id: "KSA", name: "Arabia Saudita", code: "KSA", flag: "🇸🇦", group_letter: "H", fifa_ranking: 56, off_strength: 1.0, def_strength: 1.3 },

    /* Group I */
    { id: "POR", name: "Portugal", code: "POR", flag: "🇵🇹", group_letter: "I", fifa_ranking: 8, off_strength: 2.2, def_strength: 0.7 },
    { id: "SUI", name: "Suiza", code: "SUI", flag: "🇨🇭", group_letter: "I", fifa_ranking: 19, off_strength: 1.4, def_strength: 0.8 },
    { id: "CIV", name: "Costa de Marfil", code: "CIV", flag: "🇨🇮", group_letter: "I", fifa_ranking: 35, off_strength: 1.3, def_strength: 1.0 },
    { id: "CHN", name: "China", code: "CHN", flag: "🇨🇳", group_letter: "I", fifa_ranking: 80, off_strength: 0.8, def_strength: 1.5 },

    /* Group J */
    { id: "NED", name: "Países Bajos", code: "NED", flag: "🇳🇱", group_letter: "J", fifa_ranking: 7, off_strength: 2.0, def_strength: 0.7 },
    { id: "PER", name: "Perú", code: "PER", flag: "🇵🇪", group_letter: "J", fifa_ranking: 38, off_strength: 1.1, def_strength: 0.9 },
    { id: "GHA", name: "Ghana", code: "GHA", flag: "🇬🇭", group_letter: "J", fifa_ranking: 50, off_strength: 1.2, def_strength: 1.1 },
    { id: "IRN", name: "Irán", code: "IRN", flag: "🇮🇷", group_letter: "J", fifa_ranking: 20, off_strength: 1.3, def_strength: 1.0 },

    /* Group K */
    { id: "BEL", name: "Bélgica", code: "BEL", flag: "🇧🇪", group_letter: "K", fifa_ranking: 6, off_strength: 1.9, def_strength: 0.8 },
    { id: "CRO", name: "Croacia", code: "CRO", flag: "🇭🇷", group_letter: "K", fifa_ranking: 10, off_strength: 1.7, def_strength: 0.8 },
    { id: "CMR", name: "Camerún", code: "CMR", flag: "🇨🇲", group_letter: "K", fifa_ranking: 49, off_strength: 1.2, def_strength: 1.1 },
    { id: "CRC", name: "Costa Rica", code: "CRC", flag: "🇨🇷", group_letter: "K", fifa_ranking: 52, off_strength: 1.0, def_strength: 1.2 },

    /* Group L */
    { id: "AUT", name: "Austria", code: "AUT", flag: "🇦🇹", group_letter: "L", fifa_ranking: 23, off_strength: 1.5, def_strength: 0.9 },
    { id: "TUR", name: "Turquía", code: "TUR", flag: "🇹🇷", group_letter: "L", fifa_ranking: 26, off_strength: 1.5, def_strength: 1.0 },
    { id: "SRB", name: "Serbia", code: "SRB", flag: "🇷🇸", group_letter: "L", fifa_ranking: 32, off_strength: 1.4, def_strength: 1.1 },
    { id: "UKR", name: "Ucrania", code: "UKR", flag: "🇺🇦", group_letter: "L", fifa_ranking: 25, off_strength: 1.4, def_strength: 1.0 }
  ];

  /* Insert teams */
  const insertTeam = db.prepare(`
    INSERT INTO teams (id, name, code, flag, group_letter, fifa_ranking, off_strength, def_strength)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  db.transaction(() => {
    for (const team of teamsList) {
      insertTeam.run(team.id, team.name, team.code, team.flag, team.group_letter, team.fifa_ranking, team.off_strength, team.def_strength);
    }
  })();

  /* Insert key players for top teams to project scorers */
  const playersList = [
    { team_id: "ARG", name: "Lionel Messi", position: "FW", goal_ratio: 0.012 },
    { team_id: "ARG", name: "Lautaro Martínez", position: "FW", goal_ratio: 0.009 },
    { team_id: "ARG", name: "Julián Álvarez", position: "FW", goal_ratio: 0.008 },
    { team_id: "FRA", name: "Kylian Mbappé", position: "FW", goal_ratio: 0.013 },
    { team_id: "FRA", name: "Antoine Griezmann", position: "MF", goal_ratio: 0.006 },
    { team_id: "FRA", name: "Olivier Giroud", position: "FW", goal_ratio: 0.008 },
    { team_id: "BRA", name: "Vinícius Júnior", position: "FW", goal_ratio: 0.009 },
    { team_id: "BRA", name: "Rodrygo", position: "FW", goal_ratio: 0.007 },
    { team_id: "BRA", name: "Raphinha", position: "FW", goal_ratio: 0.006 },
    { team_id: "ENG", name: "Harry Kane", position: "FW", goal_ratio: 0.012 },
    { team_id: "ENG", name: "Bukayo Saka", position: "FW", goal_ratio: 0.008 },
    { team_id: "ENG", name: "Jude Bellingham", position: "MF", goal_ratio: 0.007 },
    { team_id: "POR", name: "Cristiano Ronaldo", position: "FW", goal_ratio: 0.011 },
    { team_id: "POR", name: "Bruno Fernandes", position: "MF", goal_ratio: 0.007 },
    { team_id: "ESP", name: "Lamine Yamal", position: "FW", goal_ratio: 0.006 },
    { team_id: "ESP", name: "Álvaro Morata", position: "FW", goal_ratio: 0.008 },
    { team_id: "ESP", name: "Nico Williams", position: "FW", goal_ratio: 0.007 },
    { team_id: "COL", name: "Luis Díaz", position: "FW", goal_ratio: 0.007 },
    { team_id: "COL", name: "James Rodríguez", position: "MF", goal_ratio: 0.005 },
    { team_id: "USA", name: "Christian Pulisic", position: "FW", goal_ratio: 0.007 },
    { team_id: "URU", name: "Darwin Núñez", position: "FW", goal_ratio: 0.009 },
    { team_id: "GER", name: "Jamal Musiala", position: "MF", goal_ratio: 0.007 },
    { team_id: "GER", name: "Kai Havertz", position: "FW", goal_ratio: 0.008 },
    { team_id: "NOR", name: "Erling Haaland", position: "FW", goal_ratio: 0.014 } /* Fallback scorer if needed */
  ];

  /* Add default generic players for other teams so they also have scorers */
  for (const team of teamsList) {
    const hasPlayers = playersList.some(p => p.team_id === team.id);
    if (!hasPlayers) {
      playersList.push(
        { team_id: team.id, name: `Goleador ${team.code} 1`, position: "FW", goal_ratio: 0.006 },
        { team_id: team.id, name: `Goleador ${team.code} 2`, position: "FW", goal_ratio: 0.004 }
      );
    }
  }

  const insertPlayer = db.prepare(`
    INSERT INTO players (team_id, name, position, goal_ratio)
    VALUES (?, ?, ?, ?)
  `);

  db.transaction(() => {
    for (const player of playersList) {
      insertPlayer.run(player.team_id, player.name, player.position, player.goal_ratio);
    }
  })();

  /* Generate the 72 group stage matches */
  /* Every group of 4 teams plays a round robin: 6 games per group (12 groups * 6 games = 72 games) */
  const fixturesList: Array<{ home_team_id: string; away_team_id: string; date: string; group_letter: string; round: string }> = [];
  
  const groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  
  /* Initial fixture dates for World Cup 2026: June 11 to June 27, 2026 */
  let baseDate = new Date("2026-06-11T12:00:00Z");

  for (const group of groups) {
    const groupTeams = teamsList.filter(t => t.group_letter === group);
    if (groupTeams.length === 4) {
      const [t1, t2, t3, t4] = groupTeams;

      /* Matchday 1 */
      fixturesList.push({ home_team_id: t1.id, away_team_id: t2.id, date: formatDateOffset(baseDate, 0), group_letter: group, round: "Group" });
      fixturesList.push({ home_team_id: t3.id, away_team_id: t4.id, date: formatDateOffset(baseDate, 0.2), group_letter: group, round: "Group" });

      /* Matchday 2 */
      fixturesList.push({ home_team_id: t1.id, away_team_id: t3.id, date: formatDateOffset(baseDate, 4.0), group_letter: group, round: "Group" });
      fixturesList.push({ home_team_id: t2.id, away_team_id: t4.id, date: formatDateOffset(baseDate, 4.2), group_letter: group, round: "Group" });

      /* Matchday 3 */
      fixturesList.push({ home_team_id: t4.id, away_team_id: t1.id, date: formatDateOffset(baseDate, 8.0), group_letter: group, round: "Group" });
      fixturesList.push({ home_team_id: t2.id, away_team_id: t3.id, date: formatDateOffset(baseDate, 8.2), group_letter: group, round: "Group" });
    }
    /* Stagger group matchdays */
    baseDate.setTime(baseDate.getTime() + 4 * 60 * 60 * 1000); /* plus 4 hours */
  }

  const insertFixture = db.prepare(`
    INSERT INTO fixtures (home_team_id, away_team_id, date, status, home_score, away_score, group_letter, round)
    VALUES (?, ?, ?, ?, NULL, NULL, ?, ?)
  `);

  db.transaction(() => {
    for (const fix of fixturesList) {
      insertFixture.run(fix.home_team_id, fix.away_team_id, fix.date, "NS", fix.group_letter, fix.round);
    }
  })();
}

function formatDateOffset(d: Date, days: number): string {
  const newDate = new Date(d.getTime() + days * 24 * 60 * 60 * 1000);
  return newDate.toISOString().replace("T", " ").substring(0, 16);
}
