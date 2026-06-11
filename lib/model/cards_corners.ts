/*
Cards and Corners Projection Model.
Calculates dynamic lines and over/under probabilities.
No double hyphens in comments.
*/

export interface CardsCornersPrediction {
  corners_line: number;
  corners_over_prob: number;
  yellow_cards_line: number;
  yellow_cards_over_prob: number;
  red_card_prob: number;
}

export function predictCardsAndCorners(
  homeOff: number,
  homeDef: number,
  awayOff: number,
  awayDef: number
): CardsCornersPrediction {
  /* Dynamic corner line based on total offensive presence */
  const totalOff = homeOff + awayOff;
  const baseCorners = 6.5 + totalOff * 1.1;
  
  /* Round to nearest .5 line */
  const cornersLine = Math.round(baseCorners * 2) / 2;

  /* Corner over probability is typically close to 50% for its specific line,
     but we can adjust based on mismatch or high offensive totals. */
  let cornersOverProb = 0.50 + (totalOff - 3.0) * 0.03;
  if (cornersOverProb > 0.65) cornersOverProb = 0.65;
  if (cornersOverProb < 0.35) cornersOverProb = 0.35;

  /* Card count usually correlates with defense pressure and intensity (lower defensive strength might mean more fouls) */
  const totalDef = homeDef + awayDef;
  const baseCards = 2.5 + totalDef * 0.8; /* weaker defense means more cards */
  
  /* Round to nearest .5 line */
  let yellowCardsLine = Math.round(baseCards * 2) / 2;
  if (yellowCardsLine < 3.5) yellowCardsLine = 3.5;
  if (yellowCardsLine > 5.5) yellowCardsLine = 5.5;

  /* Yellow card over probability */
  let yellowCardsOverProb = 0.48 + (totalDef - 1.8) * 0.05;
  if (yellowCardsOverProb > 0.60) yellowCardsOverProb = 0.60;
  if (yellowCardsOverProb < 0.40) yellowCardsOverProb = 0.40;

  /* Red card probability */
  let redCardProb = 0.12 + (totalDef - 1.8) * 0.02;
  if (redCardProb > 0.25) redCardProb = 0.25;
  if (redCardProb < 0.05) redCardProb = 0.05;

  return {
    corners_line: cornersLine,
    corners_over_prob: cornersOverProb,
    yellow_cards_line: yellowCardsLine,
    yellow_cards_over_prob: yellowCardsOverProb,
    red_card_prob: redCardProb
  };
}
