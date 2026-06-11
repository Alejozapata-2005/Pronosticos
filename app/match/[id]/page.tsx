import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getFixtureDetail } from "@/lib/actions";
import { ExactScoresChart } from "@/components/Charts";
import { ArrowLeft, Target, AlertCircle, Sparkles, CornerDownRight, Instagram } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function MatchPage({ params }: PageProps) {
  const { id } = await params;
  const fixtureId = parseInt(id, 10);
  
  if (isNaN(fixtureId)) {
    return notFound();
  }

  // Control de seguridad para evitar crashes en el servidor de Vercel
  let data = null;
  try {
    data = await getFixtureDetail(fixtureId);
  } catch (error) {
    console.error("Error al obtener los detalles del partido en el servidor:", error);
    return notFound();
  }

  if (!data) {
    return notFound();
  }

  const { fixture, prediction, scorerPredictions } = data;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-slate-400 hover:text-slate-100 text-sm font-terminal"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a las Proyecciones</span>
          </Link>
        </div>

        {/* Scoreboard Broadcast Layout */}
        <div className="bg-slate-900 border border-card-border rounded-xl p-6 sm:p-8 mb-8 text-center shadow-2xl relative overflow-hidden terminal-glow">
          <div className="absolute top-2 left-4 font-terminal text-xs text-slate-500 uppercase tracking-widest">
            Mundial 2026 • Grupo {fixture.group_letter}
          </div>
          
          <div className="absolute top-2 right-4 flex items-center">
            <Link
              href={`/capture/${fixture.id}`}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-accent-green/10 text-accent-green hover:bg-accent-green hover:text-slate-950 border border-accent-green/20 rounded font-terminal text-[10px] font-bold uppercase transition-all"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Modo Captura</span>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 py-4 mt-2">
            {/* Home Team */}
            <div className="flex-1 text-center sm:text-right">
              <span className="text-4xl block sm:inline-block mr-0 sm:mr-3 mb-2 sm:mb-0">
                {fixture.home_flag}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-wide inline-block">
                {fixture.home_name}
              </h1>
              <span className="block text-xs font-terminal text-slate-500 uppercase mt-1">
                FIFA #{fixture.home_fifa} • xG {fixture.home_off.toFixed(1)} / {fixture.home_def.toFixed(1)}
              </span>
            </div>

            {/* VS Divider */}
            <div className="font-terminal font-black text-xl text-slate-500 bg-slate-950 px-4 py-2 rounded-lg border border-card-border">
              VS
            </div>

            {/* Away Team */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-wide inline-block mr-0 sm:mr-3">
                {fixture.away_name}
              </h1>
              <span className="text-4xl block sm:inline-block mb-2 sm:mb-0">
                {fixture.away_flag}
              </span>
              <span className="block text-xs font-terminal text-slate-500 uppercase mt-1">
                FIFA #{fixture.away_fifa} • xG {fixture.away_off.toFixed(1)} / {fixture.away_def.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="text-xs font-terminal text-slate-400 border-t border-card-border/40 pt-4 mt-4">
            Fecha de Juego: {fixture.date}
          </div>
        </div>

        {prediction ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left/Middle Column (2/3 width) */}
            <div className="md:col-span-2 space-y-8">
              {/* 1X2 Probabilities */}
              <div className="bg-card-bg border border-card-border rounded-xl p-6">
                <h2 className="text-sm font-terminal font-black uppercase tracking-wider text-slate-400 mb-6">
                  Probabilidades del Partido (Mercado 1X2)
                </h2>
                
                <div className="grid grid-cols-3 gap-4 text-center font-terminal mb-6">
                  <div className="bg-slate-900 border border-card-border p-4 rounded-lg">
                    <span className="text-xs text-slate-500 uppercase block mb-1">Local</span>
                    <span className="text-3xl font-black text-accent-green">
                      {(prediction.home_win_prob * 100).toFixed(0)}%
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">{fixture.home_code}</span>
                  </div>
                  <div className="bg-slate-900 border border-card-border p-4 rounded-lg">
                    <span className="text-xs text-slate-500 uppercase block mb-1">Empate</span>
                    <span className="text-3xl font-black text-accent-yellow">
                      {(prediction.draw_prob * 100).toFixed(0)}%
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">X</span>
                  </div>
                  <div className="bg-slate-900 border border-card-border p-4 rounded-lg">
                    <span className="text-xs text-slate-500 uppercase block mb-1">Visita</span>
                    <span className="text-3xl font-black text-accent-blue">
                      {(prediction.away_win_prob * 100).toFixed(0)}%
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">{fixture.away_code}</span>
                  </div>
                </div>

                {/* Double Chance Grid */}
                <div className="border-t border-card-border/40 pt-4 font-terminal">
                  <div className="flex justify-between items-center text-xs text-slate-500 uppercase mb-3">
                    <span>Doble Oportunidad</span>
                    <span>Probabilidad Proyectada</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center justify-between p-2.5 bg-slate-900/40 rounded border border-card-border/60">
                      <span className="text-xs text-slate-300">1X (Local/Emp)</span>
                      <span className="font-bold text-slate-100 text-xs">
                        {((prediction.home_win_prob + prediction.draw_prob) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-slate-900/40 rounded border border-card-border/60">
                      <span className="text-xs text-slate-300">12 (Local/Vis)</span>
                      <span className="font-bold text-slate-100 text-xs">
                        {((prediction.home_win_prob + prediction.away_win_prob) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-slate-900/40 rounded border border-card-border/60">
                      <span className="text-xs text-slate-300">X2 (Emp/Vis)</span>
                      <span className="font-bold text-slate-100 text-xs">
                        {((prediction.draw_prob + prediction.away_win_prob) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exact Score & Goals */}
              <div className="bg-card-bg border border-card-border rounded-xl p-6">
                <h2 className="text-sm font-terminal font-black uppercase tracking-wider text-slate-400 mb-6">
                  Marcador Exacto (Top 5 Probabilidades)
                </h2>
                <ExactScoresChart scores={prediction.exact_scores} />
              </div>

              {/* Over/Under & BTTS Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Over/Under Card */}
                <div className="bg-card-bg border border-card-border rounded-xl p-6 font-terminal">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
                    Over / Under Goles
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(prediction.over_under).map(([line, val]: any) => (
                      <div key={line} className="flex flex-col space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-300 font-bold">Línea {line}</span>
                          <span className="text-slate-500">Over / Under</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-center text-xs">
                          <div className="py-1 bg-slate-900 border border-card-border text-slate-200">
                            Mas: <span className="font-bold text-accent-green">{(val.over * 100).toFixed(0)}%</span>
                          </div>
                          <div className="py-1 bg-slate-900 border border-card-border text-slate-200">
                            Menos: <span className="font-bold text-slate-400">{(val.under * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BTTS Card */}
                <div className="bg-card-bg border border-card-border rounded-xl p-6 flex flex-col justify-between font-terminal">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
                      Ambos Equipos Anotan (BTTS)
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Probabilidad de que ambas selecciones marquen al menos un gol.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-slate-900 border border-card-border p-3 rounded-lg">
                      <span className="text-[10px] text-slate-500 uppercase block mb-1">Sí</span>
                      <span className="text-xl font-bold text-accent-green">
                        {(prediction.btts_prob * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="bg-slate-900 border border-card-border p-3 rounded-lg">
                      <span className="text-[10px] text-slate-500 uppercase block mb-1">No</span>
                      <span className="text-xl font-bold text-slate-400">
                        {((1 - prediction.btts_prob) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar (1/3 width) */}
            <div className="space-y-8">
              {/* Cards & Corners Card */}
              <div className="bg-card-bg border border-card-border rounded-xl p-6 font-terminal">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
                  Corners & Tarjetas Proyectadas
                </h3>
                <div className="space-y-4">
                  {/* Corners */}
                  <div className="p-3 bg-slate-900/60 rounded border border-card-border">
                    <span className="text-[10px] text-slate-500 uppercase">Línea de Tiros de Esquina</span>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-xl font-bold text-accent-blue">{prediction.corners_line}</span>
                      <span className="text-xs font-bold text-slate-300">Over: 52%</span>
                    </div>
                  </div>

                  {/* Yellow Cards */}
                  <div className="p-3 bg-slate-900/60 rounded border border-card-border">
                    <span className="text-[10px] text-slate-500 uppercase">Línea de Tarjetas Amarillas</span>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-xl font-bold text-accent-yellow">{prediction.yellow_cards_line}</span>
                      <span className="text-xs font-bold text-slate-300">Over: 48%</span>
                    </div>
                  </div>

                  {/* Red Card */}
                  <div className="p-3 bg-slate-900/60 rounded border border-card-border">
                    <span className="text-[10px] text-slate-500 uppercase">Probabilidad de Expulsión (Roja)</span>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-xl font-bold text-accent-red">12%</span>
                      <span className="text-xs text-slate-500">Baja Confianza</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scorer predictions */}
              <div className="bg-card-bg border border-card-border rounded-xl p-6 flex flex-col">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="w-5 h-5 text-accent-yellow" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Proyección de Goleadores
                  </h3>
                </div>
                
                {scorerPredictions.length === 0 ? (
                  <p className="text-xs text-slate-500 font-terminal py-6 text-center">
                    Goleadores no proyectados.
                  </p>
                ) : (
                  <div className="space-y-3 font-terminal">
                    <div className="grid grid-cols-3 text-[10px] text-slate-500 uppercase tracking-wider border-b border-card-border/40 pb-1.5 mb-2">
                      <span className="col-span-2">Jugador</span>
                      <span className="text-right">Cualq. %</span>
                    </div>
                    {scorerPredictions.slice(0, 6).map((player: any) => (
                      <div
                        key={player.name}
                        className="grid grid-cols-3 items-center text-xs py-1 hover:bg-slate-900/40 rounded transition-colors"
                      >
                        <div className="col-span-2">
                          <div className="font-semibold text-slate-200 truncate">{player.name}</div>
                          <div className="text-[9px] text-slate-500 uppercase">
                            {player.team_id === "HOME" ? fixture.home_code : fixture.away_code} • {player.position}
                          </div>
                        </div>
                        <div className="text-right font-bold text-accent-green">
                          {(player.anytime_prob * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-card-border bg-slate-900/20 rounded-xl font-terminal">
            <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No hay datos de predicción para este partido.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}