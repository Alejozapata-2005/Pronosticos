"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Calendar, Play } from "lucide-react";

interface FixtureItem {
  id: number;
  home_team_id: string;
  away_team_id: string;
  date: string;
  status: string;
  home_score: number | null;
  away_score: number | null;
  group_letter: string;
  round: string;
  home_name: string;
  home_flag: string;
  home_code: string;
  away_name: string;
  away_flag: string;
  away_code: string;
  home_win_prob: number | null;
  draw_prob: number | null;
  away_win_prob: number | null;
}

interface FixturesGridProps {
  fixtures: FixtureItem[];
}

export default function FixturesGrid({ fixtures }: FixturesGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("TODOS");

  const groups = ["TODOS", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

  const filteredFixtures = fixtures.filter(f => {
    const matchesSearch =
      f.home_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.away_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.home_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.away_code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGroup = selectedGroup === "TODOS" || f.group_letter === selectedGroup;

    return matchesSearch && matchesGroup;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por país o código (ej. ARG)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-card-border rounded-md text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-accent-green font-terminal"
          />
        </div>

        {/* Group Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {groups.map((group) => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`px-3 py-1.5 rounded-md font-terminal text-xs font-semibold uppercase whitespace-nowrap transition-colors ${
                selectedGroup === group
                  ? "bg-accent-green text-slate-950 font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              }`}
            >
              {group === "TODOS" ? "Todos" : `Gdo ${group}`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredFixtures.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-card-border rounded-lg text-slate-500 font-terminal">
          No se encontraron partidos para la búsqueda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFixtures.map((fixture) => {
            const hasPreds = fixture.home_win_prob !== null;
            const homePercent = hasPreds ? (fixture.home_win_prob! * 100).toFixed(0) : "0";
            const drawPercent = hasPreds ? (fixture.draw_prob! * 100).toFixed(0) : "0";
            const awayPercent = hasPreds ? (fixture.away_win_prob! * 100).toFixed(0) : "0";

            return (
              <div
                key={fixture.id}
                className="bg-card-bg border border-card-border rounded-lg overflow-hidden flex flex-col hover:border-slate-700 transition-all terminal-glow group"
              >
                {/* Header Card */}
                <div className="px-4 py-2.5 bg-slate-900/60 border-b border-card-border flex items-center justify-between font-terminal text-xs text-slate-400">
                  <span>Grupo {fixture.group_letter}</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-accent-blue" />
                    <span>{fixture.date}</span>
                  </div>
                </div>

                {/* Body Teams */}
                <div className="p-4 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{fixture.home_flag}</span>
                      <span className="font-semibold text-slate-200 group-hover:text-accent-green transition-colors">
                        {fixture.home_name}
                      </span>
                    </div>
                    <span className="font-terminal font-bold text-slate-400">{fixture.home_code}</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{fixture.away_flag}</span>
                      <span className="font-semibold text-slate-200 group-hover:text-accent-green transition-colors">
                        {fixture.away_name}
                      </span>
                    </div>
                    <span className="font-terminal font-bold text-slate-400">{fixture.away_code}</span>
                  </div>
                </div>

                {/* Footer Predictions */}
                {hasPreds ? (
                  <div className="px-4 py-3 bg-slate-950/80 border-t border-card-border flex flex-col space-y-2">
                    <div className="flex justify-between text-[11px] font-terminal text-slate-500 uppercase tracking-wider">
                      <span>Local %</span>
                      <span>Empate %</span>
                      <span>Visita %</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-center font-terminal">
                      <div className="py-1 bg-slate-900 rounded border border-card-border text-slate-200 text-xs">
                        <span className="font-bold text-accent-green">{homePercent}%</span>
                      </div>
                      <div className="py-1 bg-slate-900 rounded border border-card-border text-slate-200 text-xs">
                        <span className="font-bold text-accent-yellow">{drawPercent}%</span>
                      </div>
                      <div className="py-1 bg-slate-900 rounded border border-card-border text-slate-200 text-xs">
                        <span className="font-bold text-accent-blue">{awayPercent}%</span>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <Link
                        href={`/match/${fixture.id}`}
                        className="w-full flex items-center justify-center space-x-1.5 py-1.5 bg-slate-900 hover:bg-accent-green hover:text-slate-950 rounded border border-card-border text-xs font-semibold transition-all uppercase tracking-wide text-slate-300 font-terminal"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Ver Análisis Completo</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-slate-950/80 border-t border-card-border text-center text-xs text-slate-500 font-terminal py-6">
                    Predicciones no calculadas. Ejecuta el cron.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
