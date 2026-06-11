/*
Poisson model for World Cup match predictions.
Calculates probability distribution for scores and match outcomes.
*/

export function factorial(n: number): number {
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

export function poissonProbability(k: number, lambda: number): number {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

export interface MatchPrediction {
  home_win_prob: number;
  draw_prob: number;
  away_win_prob: number;
  over_under: {
    "1.5": { over: number; under: number };
    "2.5": { over: number; under: number };
    "3.5": { over: number; under: number };
  };
  btts_prob: number;
  exact_scores: Array<{ home: number; away: number; probability: number }>;
  home_lambda: number;
  away_lambda: number;
}

export function predictMatch(
  homeOff: number,
  homeDef: number,
  awayOff: number,
  awayDef: number,
  fifaDiff: number = 0
): MatchPrediction {
  /* Global average goals per team per match */
  const globalMean = 1.35;

  /* Adjust lambdas based on offensive/defensive strengths and a slight FIFA ranking adjustment */
  const rankAdjustment = fifaDiff * 0.002; /* slight bonus for higher ranked team */
  let homeLambda = homeOff * awayDef * globalMean + rankAdjustment;
  let awayLambda = awayOff * homeDef * globalMean - rankAdjustment;

  /* Ensure lambdas are positive and reasonable */
  if (homeLambda < 0.1) homeLambda = 0.1;
  if (awayLambda < 0.1) awayLambda = 0.1;

  /* Build probability matrix up to 10x10 goals */
  const maxGoals = 10;
  const homeProbs: number[] = [];
  const awayProbs: number[] = [];

  for (let i = 0; i < maxGoals; i++) {
    homeProbs.push(poissonProbability(i, homeLambda));
    awayProbs.push(poissonProbability(i, awayLambda));
  }

  let homeWinProb = 0;
  let drawProb = 0;
  let awayWinProb = 0;

  const scoreMap: Array<{ home: number; away: number; probability: number }> = [];

  for (let h = 0; h < maxGoals; h++) {
    for (let a = 0; a < maxGoals; a++) {
      const prob = homeProbs[h] * awayProbs[a];
      scoreMap.push({ home: h, away: a, probability: prob });

      if (h > a) {
        homeWinProb += prob;
      } else if (h === a) {
        drawProb += prob;
      } else {
        awayWinProb += prob;
      }
    }
  }

  /* Normalize probabilities to sum to 1 */
  const totalProb = homeWinProb + drawProb + awayWinProb;
  homeWinProb /= totalProb;
  drawProb /= totalProb;
  awayWinProb /= totalProb;

  /* Over/Under calculations */
  const getOverUnderProb = (line: number) => {
    let under = 0;
    for (const cell of scoreMap) {
      if (cell.home + cell.away < line) {
        under += cell.probability;
      }
    }
    /* Normalize */
    under /= totalProb;
    if (under > 0.999) under = 0.999;
    if (under < 0.001) under = 0.001;
    return {
      under,
      over: 1 - under
    };
  };

  const ou15 = getOverUnderProb(1.5);
  const ou25 = getOverUnderProb(2.5);
  const ou35 = getOverUnderProb(3.5);

  /* BTTS: Both Teams To Score (both score >= 1) */
  const homeZero = homeProbs[0];
  const awayZero = awayProbs[0];
  const bttsProb = (1 - homeZero) * (1 - awayZero) / totalProb;

  /* Get top 5 exact scores */
  const exactScores = scoreMap
    .map(cell => ({
      home: cell.home,
      away: cell.away,
      probability: cell.probability / totalProb
    }))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 5);

  return {
    home_win_prob: homeWinProb,
    draw_prob: drawProb,
    away_win_prob: awayWinProb,
    over_under: {
      "1.5": ou15,
      "2.5": ou25,
      "3.5": ou35
    },
    btts_prob: bttsProb,
    exact_scores: exactScores,
    home_lambda: homeLambda,
    away_lambda: awayLambda
  };
}
