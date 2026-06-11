/*
Goalscorer Projections Model.
Distributes team expected goals among players.
No double hyphens in comments.
*/

export interface PlayerScorerPrediction {
  name: string;
  team_id: string;
  position: string;
  anytime_prob: number;
  first_prob: number;
}

export interface PlayerInput {
  name: string;
  position: string;
  goal_ratio: number;
}

export function predictGoalscorers(
  homePlayers: PlayerInput[],
  awayPlayers: PlayerInput[],
  homeLambda: number,
  awayLambda: number,
  noGoalProb: number
): PlayerScorerPrediction[] {
  const predictions: PlayerScorerPrediction[] = [];

  /* Sum of goal ratios for normalization */
  const homeRatioSum = homePlayers.reduce((sum, p) => sum + p.goal_ratio, 0) || 1;
  const awayRatioSum = awayPlayers.reduce((sum, p) => sum + p.goal_ratio, 0) || 1;

  /* Calculate anytime and individual lambda for each player */
  const playersWithLambda = [
    ...homePlayers.map(p => {
      const share = p.goal_ratio / homeRatioSum;
      const playerLambda = homeLambda * share;
      const anytimeProb = 1 - Math.exp(-playerLambda);
      return {
        name: p.name,
        team_id: "HOME",
        position: p.position,
        anytimeProb,
        playerLambda
      };
    }),
    ...awayPlayers.map(p => {
      const share = p.goal_ratio / awayRatioSum;
      const playerLambda = awayLambda * share;
      const anytimeProb = 1 - Math.exp(-playerLambda);
      return {
        name: p.name,
        team_id: "AWAY",
        position: p.position,
        anytimeProb,
        playerLambda
      };
    })
  ];

  /* First scorer probability is proportional to player lambdas.
     The sum of first scorer probabilities should equal the probability of at least one goal: 1 - noGoalProb */
  const totalPlayerLambda = playersWithLambda.reduce((sum, p) => sum + p.playerLambda, 0) || 1;
  const firstScorerScale = (1 - noGoalProb) / totalPlayerLambda;

  for (const p of playersWithLambda) {
    const firstProb = p.playerLambda * firstScorerScale;
    predictions.push({
      name: p.name,
      team_id: p.team_id,
      position: p.position,
      anytime_prob: Math.min(0.95, Math.max(0.01, p.anytimeProb)),
      /* Ensure first prob is lower than anytime prob and positive */
      first_prob: Math.min(p.anytimeProb, Math.max(0.005, firstProb))
    });
  }

  /* Sort by anytime probability descending */
  return predictions.sort((a, b) => b.anytime_prob - a.anytime_prob);
}
