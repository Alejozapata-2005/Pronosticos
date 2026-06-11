/**
 * World Cup 2026 Database Sync Script (TypeScript)
 * Ejecutar en local: node -r ts-node/register lib/db/world_cup_2026_seed.ts
 * O incluir en initDb() en schema.ts
 */

import { db } from "./index";

export function syncWorld Cup2026Data() {
  console.log("[SYNC] Iniciando sincronización de datos del Mundial 2026...");

  try {
    // Step 1: Limpiar tablas (sin perder estructura)
    console.log("[SYNC] Limpiando tablas existentes...");
    db.exec("DELETE FROM predictions");
    db.exec("DELETE FROM fixtures");
    db.exec("DELETE FROM players");
    db.exec("DELETE FROM tournament_sims");
    db.exec("DELETE FROM teams");

    // Step 2: Definir 48 equipos con grupos CORRECTOS
    const teams = [
      // GRUPO A
      { id: "MEX", name: "México", code: "MEX", flag: "🇲🇽", group: "A", fifa: 15, off: 1.4, def: 1.0 },
      { id: "RSA", name: "Sudáfrica", code: "RSA", flag: "🇿🇦", group: "A", fifa: 62, off: 1.1, def: 1.2 },
      { id: "KOR", name: "República de Corea", code: "KOR", flag: "🇰🇷", group: "A", fifa: 22, off: 1.4, def: 1.0 },
      { id: "CZE", name: "Chequia", code: "CZE", flag: "🇨🇿", group: "A", fifa: 44, off: 1.2, def: 1.1 },

      // GRUPO B
      { id: "CAN", name: "Canadá", code: "CAN", flag: "🇨🇦", group: "B", fifa: 40, off: 1.3, def: 1.1 },
      { id: "BIH", name: "Bosnia y Herzegovina", code: "BIH", flag: "🇧🇦", group: "B", fifa: 48, off: 1.1, def: 1.1 },
      { id: "QAT", name: "Catar", code: "QAT", flag: "🇶🇦", group: "B", fifa: 54, off: 1.0, def: 1.2 },
      { id: "SUI", name: "Suiza", code: "SUI", flag: "🇨🇭", group: "B", fifa: 19, off: 1.4, def: 0.8 },

      // GRUPO C
      { id: "BRA", name: "Brasil", code: "BRA", flag: "🇧🇷", group: "C", fifa: 5, off: 2.3, def: 0.6 },
      { id: "MAR", name: "Marruecos", code: "MAR", flag: "🇲🇦", group: "C", fifa: 13, off: 1.5, def: 0.8 },
      { id: "HAI", name: "Haití", code: "HAI", flag: "🇭🇹", group: "C", fifa: 67, off: 0.9, def: 1.3 },
      { id: "SCO", name: "Escocia", code: "SCO", flag: "🇬🇧", group: "C", fifa: 37, off: 1.2, def: 1.0 },

      // GRUPO D
      { id: "USA", name: "Estados Unidos", code: "USA", flag: "🇺🇸", group: "D", fifa: 11, off: 1.6, def: 0.9 },
      { id: "PAR", name: "Paraguay", code: "PAR", flag: "🇵🇾", group: "D", fifa: 39, off: 1.2, def: 1.1 },
      { id: "AUS", name: "Australia", code: "AUS", flag: "🇦🇺", group: "D", fifa: 24, off: 1.2, def: 1.1 },
      { id: "TUR", name: "Turquía", code: "TUR", flag: "🇹🇷", group: "D", fifa: 26, off: 1.5, def: 1.0 },

      // GRUPO E
      { id: "GER", name: "Alemania", code: "GER", flag: "🇩🇪", group: "E", fifa: 16, off: 2.1, def: 0.9 },
      { id: "CUW", name: "Curazao", code: "CUW", flag: "🇨🇼", group: "E", fifa: 80, off: 0.8, def: 1.4 },
      { id: "CIV", name: "Costa de Marfil", code: "CIV", flag: "🇨🇮", group: "E", fifa: 35, off: 1.3, def: 1.0 },
      { id: "ECU", name: "Ecuador", code: "ECU", flag: "🇪🇨", group: "E", fifa: 27, off: 1.4, def: 0.8 },

      // GRUPO F
      { id: "NED", name: "Países Bajos", code: "NED", flag: "🇳🇱", group: "F", fifa: 7, off: 2.0, def: 0.7 },
      { id: "JPN", name: "Japón", code: "JPN", flag: "🇯🇵", group: "F", fifa: 17, off: 1.7, def: 0.8 },
      { id: "SWE", name: "Suecia", code: "SWE", flag: "🇸🇪", group: "F", fifa: 31, off: 1.3, def: 1.0 },
      { id: "TUN", name: "Túnez", code: "TUN", flag: "🇹🇳", group: "F", fifa: 47, off: 1.0, def: 1.1 },

      // GRUPO G
      { id: "BEL", name: "Bélgica", code: "BEL", flag: "🇧🇪", group: "G", fifa: 6, off: 1.9, def: 0.8 },
      { id: "EGY", name: "Egipto", code: "EGY", flag: "🇪🇬", group: "G", fifa: 36, off: 1.2, def: 1.0 },
      { id: "IRN", name: "República Islámica de Irán", code: "IRN", flag: "🇮🇷", group: "G", fifa: 20, off: 1.3, def: 1.0 },
      { id: "NZL", name: "Nueva Zelanda", code: "NZL", flag: "🇳🇿", group: "G", fifa: 74, off: 0.9, def: 1.4 },

      // GRUPO H
      { id: "ESP", name: "España", code: "ESP", flag: "🇪🇸", group: "H", fifa: 3, off: 2.4, def: 0.6 },
      { id: "CPV", name: "Islas de Cabo Verde", code: "CPV", flag: "🇨🇻", group: "H", fifa: 75, off: 0.8, def: 1.4 },
      { id: "KSA", name: "Arabia Saudí", code: "KSA", flag: "🇸🇦", group: "H", fifa: 56, off: 1.0, def: 1.3 },
      { id: "URU", name: "Uruguay", code: "URU", flag: "🇺🇾", group: "H", fifa: 14, off: 1.8, def: 0.8 },

      // GRUPO I
      { id: "FRA", name: "Francia", code: "FRA", flag: "🇫🇷", group: "I", fifa: 2, off: 2.5, def: 0.6 },
      { id: "SEN", name: "Senegal", code: "SEN", flag: "🇸🇳", group: "I", fifa: 18, off: 1.4, def: 0.9 },
      { id: "IRQ", name: "Irak", code: "IRQ", flag: "🇮🇶", group: "I", fifa: 58, off: 1.0, def: 1.3 },
      { id: "NOR", name: "Noruega", code: "NOR", flag: "🇳🇴", group: "I", fifa: 34, off: 1.3, def: 0.9 },

      // GRUPO J
      { id: "ARG", name: "Argentina", code: "ARG", flag: "🇦🇷", group: "J", fifa: 1, off: 2.4, def: 0.5 },
      { id: "ALG", name: "Argelia", code: "ALG", flag: "🇩🇿", group: "J", fifa: 43, off: 1.2, def: 1.1 },
      { id: "AUT", name: "Austria", code: "AUT", flag: "🇦🇹", group: "J", fifa: 23, off: 1.5, def: 0.9 },
      { id: "JOR", name: "Jordania", code: "JOR", flag: "🇯🇴", group: "J", fifa: 64, off: 0.9, def: 1.3 },

      // GRUPO K
      { id: "POR", name: "Portugal", code: "POR", flag: "🇵🇹", group: "K", fifa: 8, off: 2.2, def: 0.7 },
      { id: "COD", name: "República Democrática del Congo", code: "COD", flag: "🇨🇩", group: "K", fifa: 70, off: 0.9, def: 1.3 },
      { id: "UZB", name: "Uzbekistán", code: "UZB", flag: "🇺🇿", group: "K", fifa: 66, off: 1.0, def: 1.2 },
      { id: "COL", name: "Colombia", code: "COL", flag: "🇨🇴", group: "K", fifa: 12, off: 1.7, def: 0.8 },

      // GRUPO L
      { id: "ENG", name: "Inglaterra", code: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "L", fifa: 4, off: 2.3, def: 0.7 },
      { id: "CRO", name: "Croacia", code: "CRO", flag: "🇭🇷", group: "L", fifa: 10, off: 1.7, def: 0.8 },
      { id: "GHA", name: "Ghana", code: "GHA", flag: "🇬🇭", group: "L", fifa: 50, off: 1.2, def: 1.1 },
      { id: "PAN", name: "Panamá", code: "PAN", flag: "🇵🇦", group: "L", fifa: 41, off: 1.1, def: 1.2 },
    ];

    // Insertar equipos
    const insertTeam = db.prepare(`
      INSERT INTO teams (id, name, code, flag, group_letter, fifa_ranking, off_strength, def_strength)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    console.log("[SYNC] Insertando 48 equipos...");
    db.transaction(() => {
      for (const team of teams) {
        insertTeam.run(
          team.id,
          team.name,
          team.code,
          team.flag,
          team.group,
          team.fifa,
          team.off,
          team.def
        );
      }
    })();
    console.log("[SYNC] ✓ 48 equipos insertados");

    // Step 3: Generar y insertar 72 fixtures de fase de grupos (6 por grupo)
    console.log("[SYNC] Generando 72 partidos de fase de grupos...");

    interface Fixture {
      home: string;
      away: string;
      date: string;
      group: string;
    }

    const fixturesGroupStage: Fixture[] = [
      // GRUPO A
      { home: "MEX", away: "RSA", date: "2026-06-09", group: "A" },
      { home: "KOR", away: "CZE", date: "2026-06-10", group: "A" },
      { home: "MEX", away: "KOR", date: "2026-06-13", group: "A" },
      { home: "RSA", away: "CZE", date: "2026-06-14", group: "A" },
      { home: "CZE", away: "MEX", date: "2026-06-18", group: "A" },
      { home: "RSA", away: "KOR", date: "2026-06-19", group: "A" },

      // GRUPO B
      { home: "CAN", away: "BIH", date: "2026-06-10", group: "B" },
      { home: "QAT", away: "SUI", date: "2026-06-11", group: "B" },
      { home: "CAN", away: "QAT", date: "2026-06-14", group: "B" },
      { home: "BIH", away: "SUI", date: "2026-06-15", group: "B" },
      { home: "SUI", away: "CAN", date: "2026-06-19", group: "B" },
      { home: "BIH", away: "QAT", date: "2026-06-20", group: "B" },

      // GRUPO C
      { home: "BRA", away: "MAR", date: "2026-06-09", group: "C" },
      { home: "HAI", away: "SCO", date: "2026-06-10", group: "C" },
      { home: "BRA", away: "HAI", date: "2026-06-14", group: "C" },
      { home: "MAR", away: "SCO", date: "2026-06-14", group: "C" },
      { home: "SCO", away: "BRA", date: "2026-06-18", group: "C" },
      { home: "MAR", away: "HAI", date: "2026-06-19", group: "C" },

      // GRUPO D
      { home: "USA", away: "PAR", date: "2026-06-11", group: "D" },
      { home: "AUS", away: "TUR", date: "2026-06-12", group: "D" },
      { home: "USA", away: "AUS", date: "2026-06-16", group: "D" },
      { home: "PAR", away: "TUR", date: "2026-06-16", group: "D" },
      { home: "TUR", away: "USA", date: "2026-06-20", group: "D" },
      { home: "PAR", away: "AUS", date: "2026-06-20", group: "D" },

      // GRUPO E
      { home: "GER", away: "CUW", date: "2026-06-12", group: "E" },
      { home: "CIV", away: "ECU", date: "2026-06-12", group: "E" },
      { home: "GER", away: "CIV", date: "2026-06-16", group: "E" },
      { home: "CUW", away: "ECU", date: "2026-06-16", group: "E" },
      { home: "ECU", away: "GER", date: "2026-06-20", group: "E" },
      { home: "CUW", away: "CIV", date: "2026-06-20", group: "E" },

      // GRUPO F
      { home: "NED", away: "JPN", date: "2026-06-13", group: "F" },
      { home: "SWE", away: "TUN", date: "2026-06-13", group: "F" },
      { home: "NED", away: "SWE", date: "2026-06-17", group: "F" },
      { home: "JPN", away: "TUN", date: "2026-06-17", group: "F" },
      { home: "TUN", away: "NED", date: "2026-06-21", group: "F" },
      { home: "JPN", away: "SWE", date: "2026-06-21", group: "F" },

      // GRUPO G
      { home: "BEL", away: "EGY", date: "2026-06-13", group: "G" },
      { home: "IRN", away: "NZL", date: "2026-06-13", group: "G" },
      { home: "BEL", away: "IRN", date: "2026-06-17", group: "G" },
      { home: "EGY", away: "NZL", date: "2026-06-17", group: "G" },
      { home: "NZL", away: "BEL", date: "2026-06-21", group: "G" },
      { home: "EGY", away: "IRN", date: "2026-06-21", group: "G" },

      // GRUPO H
      { home: "ESP", away: "CPV", date: "2026-06-13", group: "H" },
      { home: "KSA", away: "URU", date: "2026-06-13", group: "H" },
      { home: "ESP", away: "KSA", date: "2026-06-17", group: "H" },
      { home: "CPV", away: "URU", date: "2026-06-18", group: "H" },
      { home: "URU", away: "ESP", date: "2026-06-22", group: "H" },
      { home: "CPV", away: "KSA", date: "2026-06-22", group: "H" },

      // GRUPO I
      { home: "FRA", away: "SEN", date: "2026-06-09", group: "I" },
      { home: "IRQ", away: "NOR", date: "2026-06-09", group: "I" },
      { home: "FRA", away: "IRQ", date: "2026-06-14", group: "I" },
      { home: "SEN", away: "NOR", date: "2026-06-14", group: "I" },
      { home: "NOR", away: "FRA", date: "2026-06-18", group: "I" },
      { home: "SEN", away: "IRQ", date: "2026-06-18", group: "I" },

      // GRUPO J
      { home: "ARG", away: "ALG", date: "2026-06-09", group: "J" },
      { home: "AUT", away: "JOR", date: "2026-06-10", group: "J" },
      { home: "ARG", away: "AUT", date: "2026-06-15", group: "J" },
      { home: "ALG", away: "JOR", date: "2026-06-15", group: "J" },
      { home: "JOR", away: "ARG", date: "2026-06-19", group: "J" },
      { home: "ALG", away: "AUT", date: "2026-06-19", group: "J" },

      // GRUPO K
      { home: "POR", away: "COD", date: "2026-06-11", group: "K" },
      { home: "UZB", away: "COL", date: "2026-06-12", group: "K" },
      { home: "POR", away: "UZB", date: "2026-06-16", group: "K" },
      { home: "COD", away: "COL", date: "2026-06-16", group: "K" },
      { home: "COL", away: "POR", date: "2026-06-20", group: "K" },
      { home: "COD", away: "UZB", date: "2026-06-20", group: "K" },

      // GRUPO L
      { home: "ENG", away: "CRO", date: "2026-06-08", group: "L" },
      { home: "GHA", away: "PAN", date: "2026-06-08", group: "L" },
      { home: "ENG", away: "GHA", date: "2026-06-13", group: "L" },
      { home: "CRO", away: "PAN", date: "2026-06-13", group: "L" },
      { home: "PAN", away: "ENG", date: "2026-06-17", group: "L" },
      { home: "CRO", away: "GHA", date: "2026-06-17", group: "L" },
    ];

    const insertFixture = db.prepare(`
      INSERT INTO fixtures (home_team_id, away_team_id, date, status, group_letter, round)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    db.transaction(() => {
      for (const fixture of fixturesGroupStage) {
        insertFixture.run(fixture.home, fixture.away, fixture.date, "scheduled", fixture.group, "Group");
      }
    })();
    console.log("[SYNC] ✓ 72 partidos de fase de grupos insertados (IDs 1-72)");

    // Step 4: Insertar 15 partidos de knockouts (Octavos + Cuartos + Semis + Final)
    console.log("[SYNC] Insertando 15 partidos de fase eliminatoria...");

    const fixturesKnockout = [
      // Round of 16 (8 partidos - IDs 73-80)
      { home: "A1", away: "B2", date: "2026-06-23", round: "Round of 16" },
      { home: "A2", away: "B1", date: "2026-06-23", round: "Round of 16" },
      { home: "C1", away: "D2", date: "2026-06-24", round: "Round of 16" },
      { home: "C2", away: "D1", date: "2026-06-24", round: "Round of 16" },
      { home: "E1", away: "F2", date: "2026-06-25", round: "Round of 16" },
      { home: "E2", away: "F1", date: "2026-06-25", round: "Round of 16" },
      { home: "G1", away: "H2", date: "2026-06-26", round: "Round of 16" },
      { home: "G2", away: "H1", date: "2026-06-26", round: "Round of 16" },
      // Quarter-final (4 partidos - IDs 81-84)
      { home: "QF1", away: "QF2", date: "2026-06-29", round: "Quarter-final" },
      { home: "QF3", away: "QF4", date: "2026-06-29", round: "Quarter-final" },
      { home: "QF5", away: "QF6", date: "2026-06-30", round: "Quarter-final" },
      { home: "QF7", away: "QF8", date: "2026-06-30", round: "Quarter-final" },
      // Semi-final (2 partidos - IDs 85-86)
      { home: "SF1", away: "SF2", date: "2026-07-03", round: "Semi-final" },
      { home: "SF3", away: "SF4", date: "2026-07-04", round: "Semi-final" },
      // Final (1 partido - ID 87)
      { home: "F1", away: "F2", date: "2026-07-12", round: "Final" },
    ];

    db.transaction(() => {
      for (const fixture of fixturesKnockout) {
        insertFixture.run(fixture.home, fixture.away, fixture.date, "scheduled", "", fixture.round);
      }
    })();
    console.log("[SYNC] ✓ 15 partidos de fase eliminatoria insertados (IDs 73-87)");

    // Step 5: Insertar jugadores clave
    console.log("[SYNC] Insertando jugadores clave...");

    const players = [
      ("ARG", "Lionel Messi", "FW", 0.012),
      ("ARG", "Lautaro Martínez", "FW", 0.009),
      ("FRA", "Kylian Mbappé", "FW", 0.013),
      ("FRA", "Antoine Griezmann", "MF", 0.006),
      ("BRA", "Vinícius Júnior", "FW", 0.009),
      ("BRA", "Rodrygo", "FW", 0.007),
      ("ENG", "Harry Kane", "FW", 0.012),
      ("ENG", "Bukayo Saka", "FW", 0.008),
      ("POR", "Cristiano Ronaldo", "FW", 0.011),
      ("ESP", "Lamine Yamal", "FW", 0.006),
      ("ESP", "Álvaro Morata", "FW", 0.008),
      ("COL", "Luis Díaz", "FW", 0.007),
      ("USA", "Christian Pulisic", "FW", 0.007),
      ("URU", "Darwin Núñez", "FW", 0.009),
      ("GER", "Jamal Musiala", "MF", 0.007),
      ("GER", "Kai Havertz", "FW", 0.008),
      ("NED", "Memphis Depay", "FW", 0.008),
      ("MEX", "Raúl Jiménez", "FW", 0.007),
      ("AUT", "Christoph Baumgartner", "MF", 0.006),
      ("NOR", "Erling Haaland", "FW", 0.014),
      ("SEN", "Sadio Mané", "FW", 0.009),
    ];

    const insertPlayer = db.prepare(`
      INSERT INTO players (team_id, name, position, goal_ratio)
      VALUES (?, ?, ?, ?)
    `);

    db.transaction(() => {
      for (const [team_id, name, position, goal_ratio] of players) {
        insertPlayer.run(team_id, name, position, goal_ratio);
      }
    })();
    console.log("[SYNC] ✓ Jugadores clave insertados");

    console.log("[SYNC] ✅ SINCRONIZACIÓN COMPLETADA EXITOSAMENTE");
    console.log("[SYNC] • 48 equipos en 12 grupos");
    console.log("[SYNC] • 72 partidos de fase de grupos (IDs 1-72)");
    console.log("[SYNC] • 15 partidos de knockouts (IDs 73-87)");
    console.log("[SYNC] • Jugadores clave para predicción de goleadores");

    return true;
  } catch (error) {
    console.error("[SYNC] ❌ ERROR durante la sincronización:", error);
    throw error;
  }
}

// Exportar para usar en schema.ts o scripts independientes
export { syncWorldCup2026Data as default };
