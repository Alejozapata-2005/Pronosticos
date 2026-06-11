/**
 * IMPROVED VERSION: lib/actions.ts - getFixtureDetail() function
 * 
 * Reemplaza la función actual getFixtureDetail() con esta versión mejorada.
 * Incluye manejo robusto de JSON, validación de fetch y coherencia con IDs de knockout.
 * 
 * INSTRUCCIONES DE INTEGRACIÓN:
 * 1. Copia toda esta función
 * 2. Reemplaza la función getFixtureDetail() existente en lib/actions.ts
 * 3. Mantén los imports: import { db } from "./db/index"; y import { predictGoalscorers } from "./model/scorers";
 */

/**
 * Safely parse JSON string with comprehensive fallback and logging
 * Handles: null, undefined, empty string, literal "undefined", JSON errors
 * @param jsonString Raw JSON string from database
 * @param fieldName Field name for logging context
 * @returns Parsed object or null (never throws)
 */
function safeJsonParse(jsonString: string | null | undefined, fieldName: string): any {
  try {
    // Null or undefined check
    if (!jsonString || typeof jsonString !== "string") {
      console.warn(
        `[getFixtureDetail::safeJsonParse] Field '${fieldName}' is null, undefined, or not a string. Received: ${typeof jsonString}`
      );
      return null;
    }

    // Check for literal "undefined" string
    if (jsonString === "undefined" || jsonString.trim() === "") {
      console.warn(
        `[getFixtureDetail::safeJsonParse] Field '${fieldName}' contains literal "undefined" or empty string`
      );
      return null;
    }

    // Attempt JSON parse
    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (parseError) {
    console.error(
      `[getFixtureDetail::safeJsonParse] JSON.parse failed for field '${fieldName}'`,
      {
        error: parseError instanceof Error ? parseError.message : String(parseError),
        rawValue: jsonString?.substring(0, 100), // Log first 100 chars
      }
    );
    return null;
  }
}

/**
 * Validate if a fixture ID belongs to a valid round (Group or Knockout)
 * Ensures coherence with tournament structure
 * 
 * Fixture ID ranges:
 * - 1-72: Group stage (72 matches)
 * - 73-80: Round of 16 (8 matches)
 * - 81-84: Quarter-finals (4 matches)
 * - 85-86: Semi-finals (2 matches)
 * - 87: Final (1 match)
 */
function isValidFixtureIdRange(id: number): { valid: boolean; round: string } {
  if (id >= 1 && id <= 72) return { valid: true, round: "Group" };
  if (id >= 73 && id <= 80) return { valid: true, round: "Round of 16" };
  if (id >= 81 && id <= 84) return { valid: true, round: "Quarter-final" };
  if (id === 85 || id === 86) return { valid: true, round: "Semi-final" };
  if (id === 87) return { valid: true, round: "Final" };

  return { valid: false, round: "Unknown" };
}

/**
 * MAIN FUNCTION: Fetch fixture details with robust error handling
 * Replaces the existing getFixtureDetail() in lib/actions.ts
 * 
 * Returns:
 * - null on any error (never throws, never crashes server)
 * - Detailed fixture object on success
 * 
 * Features:
 * ✅ Input validation (ID type, range, tournament coherence)
 * ✅ Try/catch at function level
 * ✅ Safe JSON parsing for all JSON fields
 * ✅ Fallback values for missing data
 * ✅ Comprehensive error logging with context
 * ✅ No-store cache directive ready (for Server Actions)
 */
export async function getFixtureDetail(id: number) {
  const FUNC_NAME = "[getFixtureDetail]";

  try {
    // ═══════════════════════════════════════════════════════════════
    // Step 1: INPUT VALIDATION
    // ═══════════════════════════════════════════════════════════════

    // Check if ID is integer and positive
    if (!Number.isInteger(id) || id <= 0) {
      console.warn(`${FUNC_NAME} Invalid fixture ID (not integer or ≤0): ${id}`);
      return null;
    }

    // Check tournament coherence (valid range for World Cup 2026)
    const { valid: isValidRange, round: matchRound } = isValidFixtureIdRange(id);
    if (!isValidRange) {
      console.warn(
        `${FUNC_NAME} Fixture ID ${id} outside valid tournament range (1-87). Skipping database query.`
      );
      return null;
    }

    // ═══════════════════════════════════════════════════════════════
    // Step 2: FETCH FIXTURE WITH TEAM DETAILS
    // ═══════════════════════════════════════════════════════════════

    const fixture = db
      .prepare(
        `
      SELECT f.*, 
             t_home.name as home_name, t_home.flag as home_flag, t_home.code as home_code, 
             t_home.off_strength as home_off, t_home.def_strength as home_def, t_home.fifa_ranking as home_fifa,
             t_away.name as away_name, t_away.flag as away_flag, t_away.code as away_code, 
             t_away.off_strength as away_off, t_away.def_strength as away_def, t_away.fifa_ranking as away_fifa
      FROM fixtures f
      LEFT JOIN teams t_home ON f.home_team_id = t_home.id
      LEFT JOIN teams t_away ON f.away_team_id = t_away.id
      WHERE f.id = ?
    `
      )
      .get(id) as any;

    // Fixture not found
    if (!fixture) {
      console.warn(`${FUNC_NAME} Fixture with ID ${id} not found in database`);
      return null;
    }

    // Verify teams exist for group stage (knockouts use placeholder IDs like "A1", "QF1")
    if (matchRound === "Group") {
      if (!fixture.home_name || !fixture.away_name) {
        console.error(
          `${FUNC_NAME} Group fixture ${id} missing team data: home=${fixture.home_name}, away=${fixture.away_name}`
        );
        return null;
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // Step 3: FETCH PREDICTION DATA
    // ═══════════════════════════════════════════════════════════════

    const prediction = db
      .prepare(`SELECT * FROM predictions WHERE fixture_id = ?`)
      .get(id) as any;

    let parsedPrediction: any = null;

    if (prediction) {
      // Safe JSON parsing for all JSON fields
      const exactScores = safeJsonParse(
        prediction.exact_scores,
        "exact_scores"
      ) || []; // Default: empty array
      const overUnder = safeJsonParse(prediction.over_under, "over_under") || {}; // Default: empty object
      const cardProbs = safeJsonParse(
        prediction.card_probabilities,
        "card_probabilities"
      ) || {}; // Default: empty object
      const cornerProbs = safeJsonParse(
        prediction.corner_probabilities,
        "corner_probabilities"
      ) || {}; // Default: empty object

      parsedPrediction = {
        ...prediction,
        exact_scores: exactScores,
        over_under: overUnder,
        card_probabilities: cardProbs,
        corner_probabilities: cornerProbs,
      };
    }

    // ═══════════════════════════════════════════════════════════════
    // Step 4: FETCH PLAYERS FOR SCORER PREDICTIONS
    // ═══════════════════════════════════════════════════════════════

    let homePlayers: any[] = [];
    let awayPlayers: any[] = [];
    let scorerPredictions: any[] = [];

    // Only fetch players for group stage (home/away teams are real)
    if (matchRound === "Group" && fixture.home_team_id && fixture.away_team_id) {
      try {
        homePlayers = (db
          .prepare(`SELECT * FROM players WHERE team_id = ?`)
          .all(fixture.home_team_id) as any[]) || [];

        awayPlayers = (db
          .prepare(`SELECT * FROM players WHERE team_id = ?`)
          .all(fixture.away_team_id) as any[]) || [];

        // ═══════════════════════════════════════════════════════════════
        // Step 5: CALCULATE DYNAMIC SCORER PREDICTIONS
        // ═══════════════════════════════════════════════════════════════

        if (
          prediction &&
          Array.isArray(prediction.exact_scores) &&
          homePlayers.length > 0 &&
          awayPlayers.length > 0
        ) {
          const exactScores = safeJsonParse(
            prediction.exact_scores,
            "exact_scores"
          ) || [];

          // Extract 0-0 probability from exact scores
          const zeroZero = (exactScores as any[]).find(
            (s: any) => s?.home === 0 && s?.away === 0
          );
          const noGoalProb = zeroZero?.probability ?? 0.08;

          // Calculate Poisson lambdas
          const globalMean = 1.35;
          const fifaDiff = (fixture.away_fifa || 50) - (fixture.home_fifa || 50);
          const rankAdjustment = fifaDiff * 0.002;

          let homeLambda =
            (fixture.home_off || 1.0) *
              (fixture.away_def || 1.0) *
              globalMean +
            rankAdjustment;
          let awayLambda =
            (fixture.away_off || 1.0) *
              (fixture.home_def || 1.0) *
              globalMean -
            rankAdjustment;

          // Safety bounds
          homeLambda = Math.max(0.1, Math.min(5.0, homeLambda));
          awayLambda = Math.max(0.1, Math.min(5.0, awayLambda));

          // Import predictGoalscorers at top of file:
          // import { predictGoalscorers } from "./model/scorers";
          try {
            scorerPredictions = predictGoalscorers(
              homePlayers.map((p) => ({
                name: p.name || "Unknown",
                position: p.position || "FW",
                goal_ratio: p.goal_ratio || 0.005,
              })),
              awayPlayers.map((p) => ({
                name: p.name || "Unknown",
                position: p.position || "FW",
                goal_ratio: p.goal_ratio || 0.005,
              })),
              homeLambda,
              awayLambda,
              noGoalProb
            );
          } catch (scorerError) {
            console.warn(
              `${FUNC_NAME} Failed to calculate scorer predictions for fixture ${id}:`,
              scorerError instanceof Error ? scorerError.message : String(scorerError)
            );
            // Don't return null; scorerPredictions stays empty array
          }
        }
      } catch (playerError) {
        console.error(
          `${FUNC_NAME} Error fetching players for fixture ${id}:`,
          playerError instanceof Error
            ? playerError.message
            : String(playerError)
        );
        // Continue; scorerPredictions will be empty array
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // Step 6: RETURN COMPLETE FIXTURE OBJECT
    // ═══════════════════════════════════════════════════════════════

    return {
      fixture: {
        ...fixture,
        validated_round: matchRound, // Add tournament coherence validation
      },
      prediction: parsedPrediction,
      scorerPredictions: scorerPredictions,
      metadata: {
        fixtureId: id,
        validRange: true,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    // CRITICAL: Catch-all to prevent server crashes
    console.error(
      `${FUNC_NAME} CRITICAL ERROR - Fixture ID ${id}:`,
      error instanceof Error ? error.message : String(error),
      error instanceof Error ? error.stack : ""
    );
    return null;
  }
}

/**
 * EXPORT HELPERS for use in other modules
 */
export function isValidFixtureRange(id: number): boolean {
  const { valid } = isValidFixtureIdRange(id);
  return valid;
}

export function getFixtureRound(id: number): string {
  const { round } = isValidFixtureIdRange(id);
  return round;
}
