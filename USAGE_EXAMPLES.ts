/**
 * USAGE EXAMPLES: getFixtureDetail() & Fixture Mapping
 * 
 * Copy-paste ready examples for common use cases in your app.
 */

// ═════════════════════════════════════════════════════════════════════════
// EXAMPLE 1: Server Action with Validation
// ═════════════════════════════════════════════════════════════════════════

import { getFixtureDetail, validateFixtureId } from "@/lib/actions";

/**
 * Safe Server Action: Fetch fixture with pre-validation
 * 
 * Usage:
 *   const result = await fetchFixtureSafe(25);
 *   if (result.success) {
 *     console.log(result.data.fixture.home_name); // "GER"
 *   } else {
 *     console.error(result.error);
 *   }
 */
export async function fetchFixtureSafe(id: number) {
  try {
    // Validate ID first
    const validation = validateFixtureId(id);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.message,
        fixture: null,
      };
    }

    // Fetch with error handling
    const result = await getFixtureDetail(id);
    if (!result) {
      return {
        success: false,
        error: `Failed to fetch fixture ${id}. Check database.`,
        fixture: null,
      };
    }

    return {
      success: true,
      error: null,
      fixture: result.fixture,
      prediction: result.prediction,
      scorers: result.scorerPredictions,
    };
  } catch (error) {
    return {
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      fixture: null,
    };
  }
}

// ═════════════════════════════════════════════════════════════════════════
// EXAMPLE 2: Dynamic Route Handler with Validation
// ═════════════════════════════════════════════════════════════════════════

/**
 * app/match/[id]/page.tsx - COMPLETE EXAMPLE
 */

import { notFound } from "next/navigation";
import {
  getFixtureDetail,
  validateFixtureId,
  getFixtureRound,
} from "@/lib/actions";

export default async function MatchPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  // Parse ID (convert string to number)
  const fixtureId = parseInt(id, 10);

  // Validate before database query
  const validation = validateFixtureId(fixtureId);
  if (!validation.valid) {
    console.warn(`[MatchPage] Invalid fixture: ${validation.message}`);
    notFound();
  }

  // Fetch fixture details
  const fixtureData = await getFixtureDetail(fixtureId);
  if (!fixtureData) {
    console.error(
      `[MatchPage] Failed to fetch fixture ${fixtureId} (valid ID but DB query failed)`
    );
    notFound();
  }

  const { fixture, prediction, scorerPredictions } = fixtureData;

  return (
    <main className="p-8 bg-slate-950 text-white min-h-screen">
      <header className="mb-8 border-b border-slate-700 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {fixture.home_name} vs {fixture.away_name}
            </h1>
            <p className="text-slate-400">
              {validation.round}
              {validation.group ? ` • Group ${validation.group}` : ""}
            </p>
            <p className="text-slate-500 text-sm">
              Fixture ID: {fixtureId} • Round: {fixture.validated_round}
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-slate-400">
              {fixture.date ? new Date(fixture.date).toLocaleDateString() : "TBD"}
            </div>
            {fixture.status && (
              <div className="text-xs bg-slate-800 px-3 py-1 rounded mt-2 inline-block">
                {fixture.status}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Match Odds */}
      {prediction && (
        <section className="mb-8 bg-slate-900 p-6 rounded border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Match Prediction</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {(prediction.home_win_prob * 100).toFixed(1)}%
              </div>
              <p className="text-slate-400">Home Win</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">
                {(prediction.draw_prob * 100).toFixed(1)}%
              </div>
              <p className="text-slate-400">Draw</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400">
                {(prediction.away_win_prob * 100).toFixed(1)}%
              </div>
              <p className="text-slate-400">Away Win</p>
            </div>
          </div>
        </section>
      )}

      {/* Expected Scorers */}
      {scorerPredictions && scorerPredictions.length > 0 && (
        <section className="bg-slate-900 p-6 rounded border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Expected Scorers</h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-3 text-slate-300">
                {fixture.home_name}
              </h3>
              <ul className="space-y-2">
                {scorerPredictions
                  .filter(
                    (s: any) =>
                      s.team === fixture.home_team_id ||
                      s.team === fixture.home_code
                  )
                  .slice(0, 5)
                  .map((s: any, i: number) => (
                    <li key={i} className="text-sm text-slate-300">
                      {s.player_name || "Unknown"}{" "}
                      <span className="text-blue-400">
                        ({(s.probability * 100).toFixed(1)}%)
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-3 text-slate-300">
                {fixture.away_name}
              </h3>
              <ul className="space-y-2">
                {scorerPredictions
                  .filter(
                    (s: any) =>
                      s.team === fixture.away_team_id ||
                      s.team === fixture.away_code
                  )
                  .slice(0, 5)
                  .map((s: any, i: number) => (
                    <li key={i} className="text-sm text-slate-300">
                      {s.player_name || "Unknown"}{" "}
                      <span className="text-pink-400">
                        ({(s.probability * 100).toFixed(1)}%)
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export async function generateStaticParams() {
  // Pre-render common fixtures to improve performance
  const commonFixtures = [1, 6, 72, 73, 87]; // MEX vs RSA, last group, R16, Final
  return commonFixtures.map((id) => ({
    id: id.toString(),
  }));
}

// ═════════════════════════════════════════════════════════════════════════
// EXAMPLE 3: Bulk Fixture Fetch with Validation
// ═════════════════════════════════════════════════════════════════════════

/**
 * Fetch multiple fixtures in parallel with error handling
 * 
 * Usage:
 *   const fixtures = await fetchMultipleFixtures([1, 2, 3, 87]);
 */
import { Promise as PromiseType } from "util";

export async function fetchMultipleFixtures(
  ids: number[]
): Promise<Array<{ id: number; success: boolean; data?: any; error?: string }>> {
  return Promise.all(
    ids.map(async (id) => {
      const validation = validateFixtureId(id);
      if (!validation.valid) {
        return {
          id,
          success: false,
          error: validation.message,
        };
      }

      const result = await getFixtureDetail(id);
      if (!result) {
        return {
          id,
          success: false,
          error: `Database query failed for valid fixture ID`,
        };
      }

      return {
        id,
        success: true,
        data: result,
      };
    })
  );
}

// ═════════════════════════════════════════════════════════════════════════
// EXAMPLE 4: Test Suite for Validation
// ═════════════════════════════════════════════════════════════════════════

/**
 * Run these tests in your CI/CD or locally with:
 *   pnpm test lib/actions.test.ts
 */

import { describe, it, expect } from "vitest";
import {
  validateFixtureId,
  getFixtureRound,
  getGroupFromFixtureId,
  isValidFixtureId,
} from "@/lib/constants/fixture-mapping";

describe("Fixture ID Validation", () => {
  // Valid IDs
  it("should validate group stage fixture IDs", () => {
    expect(validateFixtureId(1).valid).toBe(true);
    expect(validateFixtureId(1).round).toBe("Group Stage");
    expect(validateFixtureId(1).group).toBe("A");
  });

  it("should validate Round of 16 fixture IDs", () => {
    expect(validateFixtureId(73).valid).toBe(true);
    expect(validateFixtureId(73).round).toBe("Round of 16");
  });

  it("should validate Quarter-final fixture IDs", () => {
    expect(validateFixtureId(81).valid).toBe(true);
    expect(validateFixtureId(81).round).toBe("Quarter-final");
  });

  it("should validate Semi-final fixture IDs", () => {
    expect(validateFixtureId(85).valid).toBe(true);
    expect(validateFixtureId(85).round).toBe("Semi-final");
  });

  it("should validate Final fixture ID", () => {
    expect(validateFixtureId(87).valid).toBe(true);
    expect(validateFixtureId(87).round).toBe("Final");
  });

  // Invalid IDs
  it("should reject invalid fixture IDs", () => {
    expect(validateFixtureId(0).valid).toBe(false);
    expect(validateFixtureId(-5).valid).toBe(false);
    expect(validateFixtureId(88).valid).toBe(false);
    expect(validateFixtureId(999).valid).toBe(false);
  });

  it("should reject non-integer IDs", () => {
    expect(validateFixtureId(1.5).valid).toBe(false);
    expect(validateFixtureId(NaN).valid).toBe(false);
  });

  // Group detection
  it("should correctly identify groups from fixture IDs", () => {
    expect(getGroupFromFixtureId(1)).toBe("A");
    expect(getGroupFromFixtureId(12)).toBe("B");
    expect(getGroupFromFixtureId(25)).toBe("E");
    expect(getGroupFromFixtureId(72)).toBe("L");
    expect(getGroupFromFixtureId(73)).toBeNull(); // Knockout
  });

  // Round detection
  it("should correctly identify round from fixture ID", () => {
    expect(getFixtureRound(1)).toBe("Group Stage");
    expect(getFixtureRound(72)).toBe("Group Stage");
    expect(getFixtureRound(73)).toBe("Round of 16");
    expect(getFixtureRound(80)).toBe("Round of 16");
    expect(getFixtureRound(81)).toBe("Quarter-final");
    expect(getFixtureRound(84)).toBe("Quarter-final");
    expect(getFixtureRound(85)).toBe("Semi-final");
    expect(getFixtureRound(86)).toBe("Semi-final");
    expect(getFixtureRound(87)).toBe("Final");
  });

  // isValidFixtureId shorthand
  it("should provide quick validation", () => {
    expect(isValidFixtureId(1)).toBe(true);
    expect(isValidFixtureId(87)).toBe(true);
    expect(isValidFixtureId(88)).toBe(false);
    expect(isValidFixtureId(0)).toBe(false);
  });
});

// ═════════════════════════════════════════════════════════════════════════
// EXAMPLE 5: CLI Test Script
// ═════════════════════════════════════════════════════════════════════════

/**
 * Run this from terminal:
 *   node scripts/test-fixture-mapping.js
 * 
 * Save as: scripts/test-fixture-mapping.js
 */

// console.log("🧪 Testing Fixture ID Mapping...\n");

// const testIds = [1, 6, 25, 72, 73, 81, 85, 87, 0, 88];

// testIds.forEach((id) => {
//   const validation = validateFixtureId(id);
//   const status = validation.valid ? "✅" : "❌";
//   console.log(
//     `${status} ID ${id}: ${validation.round}${validation.group ? ` (Group ${validation.group})` : ""}`
//   );
// });

// console.log("\n✅ All tests passed!");
