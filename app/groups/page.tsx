import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProjectedStandings, getTournamentSims } from "@/lib/actions";
import { Award, ShieldCheck } from "lucide-react";

export const revalidate = 0;

export default async function GroupsPage() {
  const groups = await getProjectedStandings();
  const sims = await getTournamentSims();

  const simsMap = new Map(sims.map(s => [s.team_id, s]));
  const groupLetters = Object.keys(groups).sort();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-accent-green font-terminal text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-4 h-4" />
            <span>Predicción de Clasificación</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 uppercase tracking-tight">
            Tabla de Posiciones Proyectadas
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Proyección de la fase de grupos del Mundial 2026. Los primeros 2 de cada grupo y los 8 mejores terceros clasifican a Dieciseisavos (Ronda de 32).
          </p>
        </div>

        {groupLetters.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-card-border rounded-xl bg-slate-900/20 text-slate-400 font-terminal">
            <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="font-bold">No hay datos de grupos calculados.</p>
            <p className="text-xs mt-1 text-slate-500">Corre el script cron para generar y proyectar los datos de grupos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupLetters.map((letter) => {
              const groupTeams = groups[letter];

              return (
                <div
                  key={letter}
                  className="bg-card-bg border border-card-border rounded-xl overflow-hidden shadow-lg flex flex-col hover:border-slate-800 transition-all terminal-glow"
                >
                  {/* Card Header */}
                  <div className="px-4 py-3 bg-slate-900/60 border-b border-card-border flex items-center justify-between">
                    <span className="font-terminal font-black text-sm text-slate-200 tracking-widest uppercase">
                      GRUPO {letter}
                    </span>
                    <span className="text-[10px] font-terminal text-slate-500 uppercase">
                      Puntos Proyectados
                    </span>
                  </div>

                  {/* Card Content Table */}
                  <div className="p-4 flex-1">
                    <table className="w-full text-left font-terminal text-xs">
                      <thead>
                        <tr className="text-slate-500 border-b border-card-border/40 pb-2">
                          <th className="pb-2 font-medium w-6">#</th>
                          <th className="pb-2 font-medium">País</th>
                          <th className="pb-2 font-medium text-center">Pts</th>
                          <th className="pb-2 font-medium text-center">xGD</th>
                          <th className="pb-2 font-medium text-right">Clas %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-card-border/20">
                        {groupTeams.map((team, idx) => {
                          const simInfo = simsMap.get(team.id);
                          const clasProb = simInfo ? (simInfo.reach_r32_prob * 100).toFixed(0) : "0";

                          /* Setup row border indicator to give Opta terminal look */
                          let borderClass = "border-l-2 border-l-transparent";
                          if (idx < 2) {
                            borderClass = "border-l-2 border-l-accent-green";
                          } else if (idx === 2) {
                            borderClass = "border-l-2 border-l-accent-yellow";
                          } else {
                            borderClass = "border-l-2 border-l-accent-red/40";
                          }

                          return (
                            <tr
                              key={team.id}
                              className={`hover:bg-slate-900/40 transition-colors ${borderClass}`}
                            >
                              <td className="py-2.5 pl-2 font-bold text-slate-400">
                                {idx + 1}
                              </td>
                              <td className="py-2.5 font-semibold text-slate-200">
                                <span className="mr-1.5">{team.flag}</span>
                                <span className="hidden sm:inline">{team.name}</span>
                                <span className="sm:hidden">{team.code}</span>
                              </td>
                              <td className="py-2.5 font-bold text-slate-100 text-center">
                                {team.projectedPoints.toFixed(1)}
                              </td>
                              <td className="py-2.5 text-center text-slate-400">
                                {team.projectedGoalDifference > 0 ? "+" : ""}
                                {team.projectedGoalDifference.toFixed(1)}
                              </td>
                              <td className="py-2.5 text-right font-bold text-accent-green">
                                {clasProb}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Card Footer Legend */}
                  <div className="px-4 py-2 bg-slate-950/40 border-t border-card-border/20 flex items-center justify-between text-[9px] font-terminal text-slate-500">
                    <div className="flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-green"></span>
                      <span>Clas. Directa</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-yellow"></span>
                      <span>Posible Mejor 3º</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
