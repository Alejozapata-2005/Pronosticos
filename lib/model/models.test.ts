/*
Unit tests for the statistical model functions.
Using Vitest. No double hyphens in comments.
*/

import { describe, it, expect } from "vitest";
import { factorial, poissonProbability, predictMatch } from "./poisson";
import { predictCardsAndCorners } from "./cards_corners";
import { predictGoalscorers } from "./scorers";

describe("Poisson Math Models", () => {
  it("should calculate correct factorials", () => {
    expect(factorial(0)).toBe(1);
    expect(factorial(1)).toBe(1);
    expect(factorial(2)).toBe(2);
    expect(factorial(3)).toBe(6);
    expect(factorial(5)).toBe(120);
  });

  it("should calculate poisson probability correctly", () => {
    /* For lambda = 1.0, P(0) = e^-1 ~= 0.3678 */
    expect(poissonProbability(0, 1.0)).toBeCloseTo(0.3678, 3);
    /* For lambda = 2.0, P(2) = 2^2 * e^-2 / 2 = 2 * 0.1353 ~= 0.2706 */
    expect(poissonProbability(2, 2.0)).toBeCloseTo(0.2706, 3);
  });

  it("should run match prediction and sum probabilities to 1.0", () => {
    const prediction = predictMatch(1.8, 0.7, 1.2, 1.0);
    
    expect(prediction.home_win_prob).toBeGreaterThan(0);
    expect(prediction.draw_prob).toBeGreaterThan(0);
    expect(prediction.away_win_prob).toBeGreaterThan(0);

    const sum = prediction.home_win_prob + prediction.draw_prob + prediction.away_win_prob;
    expect(sum).toBeCloseTo(1.0, 4);

    /* Check over under structures */
    expect(prediction.over_under["2.5"].over + prediction.over_under["2.5"].under).toBeCloseTo(1.0, 4);
    expect(prediction.btts_prob).toBeGreaterThan(0);
    expect(prediction.btts_prob).toBeLessThan(1);

    /* Exact scores count should be 5 */
    expect(prediction.exact_scores.length).toBe(5);
  });
});

describe("Cards and Corners Models", () => {
  it("should project reasonable lines and probabilities", () => {
    const projection = predictCardsAndCorners(1.8, 0.7, 1.2, 1.0);
    
    expect(projection.corners_line).toBeGreaterThan(5);
    expect(projection.corners_over_prob).toBeGreaterThan(0.2);
    expect(projection.corners_over_prob).toBeLessThan(0.8);

    expect(projection.yellow_cards_line).toBeGreaterThan(2);
    expect(projection.yellow_cards_over_prob).toBeGreaterThan(0.3);
  });
});

describe("Goalscorer Models", () => {
  it("should project scorers correctly and scale first scorer probabilities", () => {
    const homePlayers = [
      { name: "Lionel Messi", position: "FW", goal_ratio: 0.012 },
      { name: "Lautaro Martínez", position: "FW", goal_ratio: 0.009 }
    ];
    const awayPlayers = [
      { name: "Kylian Mbappé", position: "FW", goal_ratio: 0.013 }
    ];

    const result = predictGoalscorers(homePlayers, awayPlayers, 1.5, 1.0, 0.20);
    
    expect(result.length).toBe(3);
    expect(result[0].anytime_prob).toBeGreaterThan(0);
    expect(result[0].first_prob).toBeGreaterThan(0);
    expect(result[0].first_prob).toBeLessThan(result[0].anytime_prob);

    /* Check sort order (highest probability first) */
    expect(result[0].anytime_prob).toBeGreaterThanOrEqual(result[1].anytime_prob);
  });
});
