import { getFixtureDetail } from "@/lib/actions";
import { Sparkles, Trophy, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function CapturePage({ params }: PageProps) {
  const { id } = await params;
  const fixtureId = parseInt(id, 10);

  if (isNaN(fixtureId)) {
    return notFound();
  }

  const data = await getFixtureDetail(fixtureId);
  if (!data || !data.prediction) {
    return notFound();
  }

  const { fixture, prediction } = data;

  const homePercent = (prediction.home_win_prob * 100).toFixed(0);
  const drawPercent = (prediction.draw_prob * 100).toFixed(0);
  const awayPercent = (prediction.away_win_prob * 100).toFixed(0);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Back button (hidden in screen grabs, useful for navigation) */}
      <div className="absolute top-4 left-4 z-50 no-print">
        <Link
          href={`/match/${fixture.id}`}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 border border-card-border hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded text-xs font-terminal uppercase transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver</span>
        </Link>
      </div>

      {/* 9:16 Mobile Portrait Recording Box */}
      <div className="w-full max-w-sm aspect-[9/16] bg-slate-950 border-2 border-accent-green rounded-2xl p-6 flex flex-col justify-between shadow-[0_0_30px_rgba(0,255,102,0.15)] relative overflow-hidden">
        {/* Subtle grid background to match terminal style */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-20 pointer-events-none" />

        {/* Top Header info */}
        <div className="relative z-10 flex flex-col items-center text-center mt-2">
          <div className="flex items-center space-x-1 px-2.5 py-1 bg-accent-green/10 text-accent-green border border-accent-green/20 rounded-full text-[9px] font-terminal font-bold uppercase tracking-widest mb-3 animate-pulse">
            <Sparkles className="w-3 h-3 fill-current" />
            <span>Predicción de Inteligencia Artificial</span>
          </div>
          <span className="font-terminal font-black text-xs text-slate-500 uppercase tracking-widest">
            Mundial 2026 • Grupo {fixture.group_letter}
          </span>
        </div>

        {/* Central Matchup Display */}
        <div className="relative z-10 my-4 text-center">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex flex-col items-center">
              <span className="text-5xl mb-2 filter drop-shadow-lg">{fixture.home_flag}</span>
              <span className="font-terminal font-black text-2xl text-slate-100 uppercase tracking-wide">
                {fixture.home_code}
              </span>
              <span className="font-sans text-[10px] text-slate-400 font-bold uppercase mt-0.5 truncate max-w-[100px]">
                {fixture.home_name}
              </span>
            </div>
            
            <div className="font-terminal font-black text-lg text-slate-600 bg-slate-900 border border-card-border px-3 py-1 rounded">
              VS
            </div>

            <div className="flex flex-col items-center">
              <span className="text-5xl mb-2 filter drop-shadow-lg">{fixture.away_flag}</span>
              <span className="font-terminal font-black text-2xl text-slate-100 uppercase tracking-wide">
                {fixture.away_code}
              </span>
              <span className="font-sans text-[10px] text-slate-400 font-bold uppercase mt-0.5 truncate max-w-[100px]">
                {fixture.away_name}
              </span>
            </div>
          </div>
        </div>

        {/* Probabilities display (Large Centered Numbers) */}
        <div className="relative z-10 bg-slate-900/40 border border-card-border/80 rounded-xl p-4 font-terminal text-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-3 font-semibold">
            Probabilidad de Victoria
          </span>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center justify-center p-2 bg-slate-950 rounded border border-card-border">
              <span className="text-[10px] text-slate-400 uppercase font-semibold mb-1">{fixture.home_code}</span>
              <span className="text-3xl font-black text-accent-green leading-none">{homePercent}%</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-slate-950 rounded border border-card-border">
              <span className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Empate</span>
              <span className="text-3xl font-black text-accent-yellow leading-none">{drawPercent}%</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-slate-950 rounded border border-card-border">
              <span className="text-[10px] text-slate-400 uppercase font-semibold mb-1">{fixture.away_code}</span>
              <span className="text-3xl font-black text-accent-blue leading-none">{awayPercent}%</span>
            </div>
          </div>
        </div>

        {/* Top Exact Scores boxes */}
        <div className="relative z-10 font-terminal">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2 font-semibold text-center">
            Top 3 Marcadores Probables
          </span>
          <div className="space-y-2">
            {prediction.exact_scores.slice(0, 3).map((score: any, idx: number) => {
              const borderStyles = [
                "border-accent-green/40 bg-accent-green/5 shadow-[0_0_8px_rgba(0,255,102,0.05)]",
                "border-card-border bg-slate-900/30",
                "border-card-border bg-slate-900/30"
              ];
              const textStyles = [
                "text-accent-green",
                "text-slate-300",
                "text-slate-300"
              ];

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2.5 border rounded-lg transition-all ${borderStyles[idx]}`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-500 font-bold">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="font-sans text-xs text-slate-400">Marcador</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-base font-black tracking-wide ${textStyles[idx]}`}>
                      {score.home} - {score.away}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {(score.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Model Signature Footer */}
        <div className="relative z-10 border-t border-card-border/40 pt-4 flex items-center justify-between font-terminal text-[8px] text-slate-500 uppercase tracking-widest">
          <div className="flex items-center space-x-1">
            <Trophy className="w-3.5 h-3.5 text-accent-green" />
            <span>Mundial 2026 IA Predictor</span>
          </div>
          <span>Alejo Zapata</span>
        </div>
      </div>
    </div>
  );
}
