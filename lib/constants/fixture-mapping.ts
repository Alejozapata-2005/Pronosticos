/**
 * TOURNAMENT FIXTURE ID MAPPING - FIFA World Cup 2026
 * Coherence structure for group stage and knockout rounds
 * 
 * This file documents the fixture ID allocation strategy to ensure
 * all routes (/match/[id], /capture/[id]) receive valid data without nulls.
 */

// ═════════════════════════════════════════════════════════════════════════
// FIXTURE ID RANGES (87 total matches)
// ═════════════════════════════════════════════════════════════════════════

export const FIXTURE_ID_RANGES = {
  groupStage: {
    min: 1,
    max: 72,
    count: 72,
    description: "Group stage (12 groups × 6 matches)",
    structure: "4C2 = 6 combinations per group",
  },
  roundOf16: {
    min: 73,
    max: 80,
    count: 8,
    description: "Round of 16 (Octavos de final)",
    structure: "A1 vs B2, A2 vs B1, C1 vs D2, etc.",
  },
  quarterFinal: {
    min: 81,
    max: 84,
    count: 4,
    description: "Quarter-finals (Cuartos de final)",
    structure: "Winners from Round of 16 (paired)",
  },
  semiFinal: {
    min: 85,
    max: 86,
    count: 2,
    description: "Semi-finals (Semifinales)",
    structure: "Winners from Quarter-finals (paired)",
  },
  final: {
    min: 87,
    max: 87,
    count: 1,
    description: "Final (Championship match)",
    structure: "Winners from Semi-finals",
  },
};

// ═════════════════════════════════════════════════════════════════════════
// GROUP STAGE FIXTURES (IDs 1-72)
// ═════════════════════════════════════════════════════════════════════════

export const GROUP_STAGE_FIXTURES = {
  A: {
    groupLetter: "A",
    teams: ["MEX", "RSA", "KOR", "CZE"],
    fixtureIds: [1, 2, 3, 4, 5, 6],
    matchups: [
      { id: 1, home: "MEX", away: "RSA", matchday: 1 },
      { id: 2, home: "KOR", away: "CZE", matchday: 1 },
      { id: 3, home: "MEX", away: "KOR", matchday: 2 },
      { id: 4, home: "RSA", away: "CZE", matchday: 2 },
      { id: 5, home: "CZE", away: "MEX", matchday: 3 },
      { id: 6, home: "RSA", away: "KOR", matchday: 3 },
    ],
  },
  B: {
    groupLetter: "B",
    teams: ["CAN", "BIH", "QAT", "SUI"],
    fixtureIds: [7, 8, 9, 10, 11, 12],
    matchups: [
      { id: 7, home: "CAN", away: "BIH", matchday: 1 },
      { id: 8, home: "QAT", away: "SUI", matchday: 1 },
      { id: 9, home: "CAN", away: "QAT", matchday: 2 },
      { id: 10, home: "BIH", away: "SUI", matchday: 2 },
      { id: 11, home: "SUI", away: "CAN", matchday: 3 },
      { id: 12, home: "BIH", away: "QAT", matchday: 3 },
    ],
  },
  C: {
    groupLetter: "C",
    teams: ["BRA", "MAR", "HAI", "SCO"],
    fixtureIds: [13, 14, 15, 16, 17, 18],
  },
  D: {
    groupLetter: "D",
    teams: ["USA", "PAR", "AUS", "TUR"],
    fixtureIds: [19, 20, 21, 22, 23, 24],
  },
  E: {
    groupLetter: "E",
    teams: ["GER", "CUW", "CIV", "ECU"],
    fixtureIds: [25, 26, 27, 28, 29, 30],
  },
  F: {
    groupLetter: "F",
    teams: ["NED", "JPN", "SWE", "TUN"],
    fixtureIds: [31, 32, 33, 34, 35, 36],
  },
  G: {
    groupLetter: "G",
    teams: ["BEL", "EGY", "IRN", "NZL"],
    fixtureIds: [37, 38, 39, 40, 41, 42],
  },
  H: {
    groupLetter: "H",
    teams: ["ESP", "CPV", "KSA", "URU"],
    fixtureIds: [43, 44, 45, 46, 47, 48],
  },
  I: {
    groupLetter: "I",
    teams: ["FRA", "SEN", "IRQ", "NOR"],
    fixtureIds: [49, 50, 51, 52, 53, 54],
  },
  J: {
    groupLetter: "J",
    teams: ["ARG", "ALG", "AUT", "JOR"],
    fixtureIds: [55, 56, 57, 58, 59, 60],
  },
  K: {
    groupLetter: "K",
    teams: ["POR", "COD", "UZB", "COL"],
    fixtureIds: [61, 62, 63, 64, 65, 66],
  },
  L: {
    groupLetter: "L",
    teams: ["ENG", "CRO", "GHA", "PAN"],
    fixtureIds: [67, 68, 69, 70, 71, 72],
  },
};

// ═════════════════════════════════════════════════════════════════════════
// KNOCKOUT FIXTURES (IDs 73-87)
// ═════════════════════════════════════════════════════════════════════════

export const KNOCKOUT_FIXTURES = {
  roundOf16: [
    { id: 73, home: "A1", away: "B2", matchup: "Winner A vs Runner-up B" },
    { id: 74, home: "A2", away: "B1", matchup: "Runner-up A vs Winner B" },
    { id: 75, home: "C1", away: "D2", matchup: "Winner C vs Runner-up D" },
    { id: 76, home: "C2", away: "D1", matchup: "Runner-up C vs Winner D" },
    { id: 77, home: "E1", away: "F2", matchup: "Winner E vs Runner-up F" },
    { id: 78, home: "E2", away: "F1", matchup: "Runner-up E vs Winner F" },
    { id: 79, home: "G1", away: "H2", matchup: "Winner G vs Runner-up H" },
    { id: 80, home: "G2", away: "H1", matchup: "Runner-up G vs Winner H" },
  ],
  quarterFinal: [
    { id: 81, home: "W73", away: "W74", matchup: "Winner(73) vs Winner(74)" },
    { id: 82, home: "W75", away: "W76", matchup: "Winner(75) vs Winner(76)" },
    { id: 83, home: "W77", away: "W78", matchup: "Winner(77) vs Winner(78)" },
    { id: 84, home: "W79", away: "W80", matchup: "Winner(79) vs Winner(80)" },
  ],
  semiFinal: [
    { id: 85, home: "W81", away: "W82", matchup: "Winner(81) vs Winner(82)" },
    { id: 86, home: "W83", away: "W84", matchup: "Winner(83) vs Winner(84)" },
  ],
  final: [{ id: 87, home: "W85", away: "W86", matchup: "Winner(85) vs Winner(86)" }],
};

// ═════════════════════════════════════════════════════════════════════════
// VALIDATION FUNCTIONS
// ═════════════════════════════════════════════════════════════════════════

/**
 * Check if a fixture ID is in valid tournament range
 */
export function isValidFixtureId(id: number): boolean {
  return id >= 1 && id <= 87;
}

/**
 * Get tournament round for a fixture ID
 */
export function getFixtureRound(id: number): string {
  if (id >= 1 && id <= 72) return "Group Stage";
  if (id >= 73 && id <= 80) return "Round of 16";
  if (id >= 81 && id <= 84) return "Quarter-final";
  if (id === 85 || id === 86) return "Semi-final";
  if (id === 87) return "Final";
  return "Unknown";
}

/**
 * Get group for a fixture ID (if group stage)
 */
export function getGroupFromFixtureId(id: number): string | null {
  if (id >= 1 && id <= 6) return "A";
  if (id >= 7 && id <= 12) return "B";
  if (id >= 13 && id <= 18) return "C";
  if (id >= 19 && id <= 24) return "D";
  if (id >= 25 && id <= 30) return "E";
  if (id >= 31 && id <= 36) return "F";
  if (id >= 37 && id <= 42) return "G";
  if (id >= 43 && id <= 48) return "H";
  if (id >= 49 && id <= 54) return "I";
  if (id >= 55 && id <= 60) return "J";
  if (id >= 61 && id <= 66) return "K";
  if (id >= 67 && id <= 72) return "L";
  return null;
}

/**
 * Validate fixture ID and return metadata
 */
export interface FixtureValidation {
  valid: boolean;
  round: string;
  group: string | null;
  message: string;
}

export function validateFixtureId(id: number): FixtureValidation {
  if (!Number.isInteger(id) || id <= 0) {
    return {
      valid: false,
      round: "Unknown",
      group: null,
      message: `Invalid fixture ID: ${id}. Must be positive integer.`,
    };
  }

  if (id > 87) {
    return {
      valid: false,
      round: "Unknown",
      group: null,
      message: `Fixture ID ${id} exceeds tournament maximum (87).`,
    };
  }

  const round = getFixtureRound(id);
  const group = getGroupFromFixtureId(id);

  return {
    valid: true,
    round,
    group,
    message: `Valid fixture ID ${id} in ${round}${group ? ` (Group ${group})` : ""}`,
  };
}

// ═════════════════════════════════════════════════════════════════════════
// EXAMPLE USAGE IN SERVER ACTIONS
// ═════════════════════════════════════════════════════════════════════════

/**
 * Example: Validate fixture before query
 * 
 * export async function getFixtureDetail(id: number) {
 *   const validation = validateFixtureId(id);
 *   if (!validation.valid) {
 *     console.warn(validation.message);
 *     return null;
 *   }
 *   
 *   // Proceed with database query
 *   // ...
 * }
 */

// ═════════════════════════════════════════════════════════════════════════
// TEST CASES
// ═════════════════════════════════════════════════════════════════════════

export const TEST_FIXTURE_IDS = {
  groupStage: [1, 6, 12, 25, 50, 72], // Examples from different groups
  roundOf16: [73, 77, 80], // Examples: M73, M77, M80 (user mentioned)
  quarterFinal: [81, 84],
  semiFinal: [85, 86],
  final: [87],
  invalid: [0, -5, 88, 100, 999, NaN, null], // Should all return null
};
