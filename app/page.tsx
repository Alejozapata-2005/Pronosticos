import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getTournamentSims, getFixtures } from "@/lib/actions";
import { ChampionProbChart } from "@/components/Charts";
import FixturesGrid from "@/components/FixturesGrid";
import { Trophy, Target, Sparkles, BarChart2 } from "lucide-react";
import { db } from "@/lib/db";

export const revalidate = 0; /* Always fetch fresh data */

export default async function Home() {
  /* Query Sims and Fixtures */
  const sims = await getTournamentSims();
  const fixtures = await getFixtures();

  /* If db is empty, prompt user to run the cron */
  const dbHasData = sims.length > 0 && fixtures.length > 0;

  /* Calculate Golden Boot / Bota de Oro projections */
  let topScorers: any[] = [];
  if (dbHasData) {
    const players = db.prepare("SELECT * FROM players").all() as any[];
    topScorers = players
      .map(player => {
        const teamSim = sims.find(s => s.team_id === player.team_id);
        if (!teamSim) {
          return null;
        }

        /* Expected minutes = 90 mins * (3 group games + expected knockout games) */
        const expectedKnockoutGames =
          teamSim.reach_r32_prob +
          teamSim.reach_final_prob + /* finalist counts for both finalist games */
          teamSim.reach_semi_prob +
          teamSim.reach_quarter_prob;
        
        /* The Monte Carlo structure stores cumulative probabilities, e.g., reaching final is also reaching semi.
           So sum of probabilities of rounds gives expected knockout games. */
        const expectedGames = 3 + expectedKnockoutGames;
        const expectedMinutes = expectedGames * 90;
        const projectedGoals = player.goal_ratio * expectedMinutes;

        return {
          name: player.name,
          teamCode: teamSim.code,
          teamFlag: teamSim.flag,
          teamName: teamSim.name,
          projectedGoals
        };
      })
      .filter((p): p is any => p !== null)
      .sort((a, b) => b.projectedGoals - a.projectedGoals)
      .slice(0, 8);
  }

  /* Form Top 8 teams data for Champion probability chart */
  const championChartData = sims.slice(0, 8).map(s => ({
    code: s.code,
    name: s.name,
    flag: s.flag,
    prob: s.champion_prob
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner principal - Look Broadcast */}
        <div className="relative overflow-hidden bg-slate-900 border border-card-border rounded-xl p-6 sm:p-8 mb-8 shadow-2xl terminal-glow">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-accent-green/5 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2 text-accent-green font-terminal text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Simulación de IA Predictiva</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 uppercase tracking-tight leading-none">
                Así Predice la IA el Mundial <span className="text-accent-green">2026</span>
              </h1>
              <p className="text-sm text-slate-400 mt-2 max-w-2xl">
                Proyecciones estadísticas avanzadas basadas en distribución de Poisson y simulación Monte Carlo de 10,000 iteraciones del torneo completo.
              </p>
            </div>
            {!dbHasData && (
              <div className="bg-accent-yellow/10 border border-accent-yellow/20 rounded p-4 text-xs font-terminal text-accent-yellow max-w-md">
                <p className="font-bold">⚠️ BASE DE DATOS SIN DATA</p>
                <p className="mt-1">
                  Por favor, ejecuta el recálculo diario para generar las predicciones de los 72 partidos y simulaciones de campeón.
                </p>
                <code className="block mt-2 bg-slate-950 p-2 rounded text-slate-200">
                  pnpm cron:run
                </code>
              </div>
            )}
          </div>
        </div>

        {dbHasData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Dashboard Principal (2/3) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Sección Proyección Campeón */}
              <div className="bg-card-bg border border-card-border rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <Trophy className="w-6 h-6 text-accent-green" />
                  <h2 className="text-lg font-bold uppercase text-slate-200 tracking-wider">
                    Favoritos al Título (Monte Carlo)
                  </h2>
                </div>
                <ChampionProbChart data={championChartData} />
              </div>

              {/* Sección Lista de Partidos */}
              <div className="bg-card-bg border border-card-border rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <BarChart2 className="w-6 h-6 text-accent-blue" />
                  <h2 className="text-lg font-bold uppercase text-slate-200 tracking-wider">
                    Predicciones del Grupo Stage
                  </h2>
                </div>
                <FixturesGrid fixtures={fixtures} />
              </div>
            </div>

            {/* Sidebar Detalle (1/3) */}
            <div className="space-y-8">
              {/* Proyección Bota de Oro */}
              <div className="bg-card-bg border border-card-border rounded-xl p-6 shadow-lg flex flex-col">
                <div className="flex items-center space-x-3 mb-6">
                  <Target className="w-6 h-6 text-accent-yellow" />
                  <h2 className="text-lg font-bold uppercase text-slate-200 tracking-wider">
                    Proyección Bota de Oro
                  </h2>
                </div>
                <div className="space-y-4 flex-1">
                  {topScorers.map((scorer, idx) => (
                    <div
                      key={scorer.name}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/40 border border-card-border/60 hover:border-slate-800 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-terminal text-slate-500 font-bold text-xs">
                          {(idx + 1).toString().padStart(2, "0")}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-200 text-sm">{scorer.name}</div>
                          <div className="text-xs text-slate-500 font-terminal">
                            {scorer.teamFlag} {scorer.teamName}
                          </div>
                        </div>
                      </div>
                      <div className="text-right font-terminal">
                        <div className="text-accent-yellow font-bold text-base">
                          {scorer.projectedGoals.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase">Goles Proy.</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explicación Técnica */}
              <div className="bg-slate-900/40 border border-card-border rounded-xl p-6 text-xs text-slate-400 space-y-3 font-terminal">
                <h3 className="font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Metodología de Predicción
                </h3>
                <p>
                  <strong className="text-accent-green">1. Goles Esperados (xG):</strong> Calculamos el Lambda para cada partido en base a la fuerza de ataque ofensiva y defensa defensiva de cada selección, ajustado por diferencia en el Ranking FIFA.
                </p>
                <p>
                  <strong className="text-accent-blue">2. Poisson Distribution:</strong> Construimos una matriz de probabilidad 10x10 para obtener las probabilidades exactas del resultado, over/under, y BTTS.
                </p>
                <p>
                  <strong className="text-accent-yellow">3. Monte Carlo:</strong> Simulamos el torneo completo 10,000 veces desde fase de grupos hasta la final para proyectar el campeón y la progresión por rondas de cada país.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-card-border rounded-xl bg-slate-900/20 text-slate-400 font-terminal">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="font-bold text-base">No hay predicciones disponibles en la base de datos.</p>
            <p className="text-xs mt-1 text-slate-500">Ejecuta el script de cron para generar el seed de los partidos y modelar los pronósticos.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
