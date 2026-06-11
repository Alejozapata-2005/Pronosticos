"use client";

import { motion } from "framer-motion";

interface ChartItem {
  code: string;
  name: string;
  flag: string;
  prob: number;
}

interface ChampionChartProps {
  data: ChartItem[];
}

export function ChampionProbChart({ data }: ChampionChartProps) {
  /* Normalize probabilities to fit scale if needed, but they are already ratios (0-1) */
  const maxProb = Math.max(...data.map(d => d.prob), 0.01);

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const percentage = (item.prob * 100).toFixed(1);
        const relativeWidth = (item.prob / maxProb) * 100;

        return (
          <div key={item.code} className="flex items-center space-x-4">
            <span className="font-terminal text-sm text-slate-500 w-6">
              {(index + 1).toString().padStart(2, "0")}
            </span>
            <span className="text-xl w-8">{item.flag}</span>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1 text-sm font-terminal">
                <span className="font-semibold text-slate-200">{item.name}</span>
                <span className="text-accent-green font-bold">{percentage}%</span>
              </div>
              <div className="h-3 bg-slate-900 rounded-full border border-card-border overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${relativeWidth}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: index * 0.05 }}
                  className="h-full bg-gradient-to-r from-accent-green/60 to-accent-green shadow-[0_0_10px_rgba(0,255,102,0.4)]"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface ExactScoreItem {
  home: number;
  away: number;
  probability: number;
}

interface ExactScoresChartProps {
  scores: ExactScoreItem[];
}

export function ExactScoresChart({ scores }: ExactScoresChartProps) {
  const maxProb = Math.max(...scores.map(s => s.probability), 0.01);

  return (
    <div className="space-y-3 font-terminal">
      {scores.map((score, index) => {
        const percentage = (score.probability * 100).toFixed(1);
        const relativeWidth = (score.probability / maxProb) * 100;

        return (
          <div key={`${score.home}-${score.away}`} className="flex items-center">
            <div className="w-16 text-left font-bold text-slate-300">
              {score.home} - {score.away}
            </div>
            <div className="flex-1 ml-2">
              <div className="h-4 bg-slate-900 rounded border border-card-border overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${relativeWidth}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.05 }}
                  className="h-full bg-accent-blue/80 shadow-[0_0_8px_rgba(41,121,255,0.4)]"
                />
                <span className="absolute right-2 top-0 text-[10px] leading-4 text-slate-400 font-bold">
                  {percentage}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
