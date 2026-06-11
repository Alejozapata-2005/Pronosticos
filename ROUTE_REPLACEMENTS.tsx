/**
 * EXACT CODE REPLACEMENTS FOR ROUTES
 * 
 * Copy these exact code blocks into your route files.
 * No modifications needed - just paste.
 */

// ═════════════════════════════════════════════════════════════════════════
// FILE 1: app/match/[id]/page.tsx
// COMPLETE REFACTORED VERSION (copy all of this)
// ═════════════════════════════════════════════════════════════════════════

import { notFound } from "next/navigation";
import { getFixtureDetail } from "@/lib/actions";
import { validateFixtureId } from "@/lib/constants/fixture-mapping";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchPage(props: PageProps) {
  const { id } = await props.params;

  // ─────────────────────────────────────────────────────────
  // Step 1: Parse and validate fixture ID
  // ─────────────────────────────────────────────────────────

  const fixtureId = parseInt(id, 10);

  const validation = validateFixtureId(fixtureId);
  if (!validation.valid) {
    console.warn(`[MatchPage] Invalid fixture ID: ${validation.message}`);
    notFound();
  }

  // ─────────────────────────────────────────────────────────
  // Step 2: Fetch fixture details
  // ─────────────────────────────────────────────────────────

  const fixtureData = await getFixtureDetail(fixtureId);

  if (!fixtureData) {
    console.error(`[MatchPage] Failed to fetch fixture ${fixtureId}`);
    notFound();
  }

  const { fixture, prediction, scorerPredictions } = fixtureData;

  // ─────────────────────────────────────────────────────────
  // Step 3: Render page
  // ─────────────────────────────────────────────────────────

  return (
    <main className="bg-slate-950 text-white min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 border-b border-slate-700 pb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {fixture.home_name} vs {fixture.away_name}
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              {validation.round}
              {validation.group ? ` • Group ${validation.group}` : ""}
            </p>
            <p className="text-slate-500 text-xs md:text-sm mt-2">
              Fixture ID: {fixtureId} • Mapped Round: {fixture.validated_round}
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-slate-400">
              {fixture.date
                ? new Date(fixture.date).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Fecha TBD"}
            </div>
            {fixture.status && (
              <div className="text-xs bg-slate-800 px-3 py-1 rounded mt-2 inline-block">
                {fixture.status}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Teams Info */}
      <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Home Team */}
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-3xl">{fixture.home_flag}</span>
            {fixture.home_name}
          </h2>
          <dl className="space-y-2 text-sm text-slate-400">
            <div>
              <dt className="font-semibold text-slate-300">Código:</dt>
              <dd>{fixture.home_code}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-300">FIFA Ranking:</dt>
              <dd>{fixture.home_fifa}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-300">Fortaleza Ofensiva:</dt>
              <dd>{(fixture.home_off * 100).toFixed(1)}%</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-300">Fortaleza Defensiva:</dt>
              <dd>{(fixture.home_def * 100).toFixed(1)}%</dd>
            </div>
          </dl>
        </div>

        {/* Away Team */}
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-3xl">{fixture.away_flag}</span>
            {fixture.away_name}
          </h2>
          <dl className="space-y-2 text-sm text-slate-400">
            <div>
              <dt className="font-semibold text-slate-300">Código:</dt>
              <dd>{fixture.away_code}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-300">FIFA Ranking:</dt>
              <dd>{fixture.away_fifa}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-300">Fortaleza Ofensiva:</dt>
              <dd>{(fixture.away_off * 100).toFixed(1)}%</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-300">Fortaleza Defensiva:</dt>
              <dd>{(fixture.away_def * 100).toFixed(1)}%</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Match Prediction */}
      {prediction && (
        <section className="mb-8 bg-slate-900 p-6 rounded-lg border border-slate-700">
          <h2 className="text-2xl font-bold mb-6">Predicción del Partido</h2>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center bg-slate-800 p-4 rounded">
              <div className="text-4xl md:text-5xl font-bold text-blue-400">
                {(prediction.home_win_prob * 100).toFixed(1)}%
              </div>
              <p className="text-slate-400 mt-2">Victoria Local</p>
            </div>

            <div className="text-center bg-slate-800 p-4 rounded">
              <div className="text-4xl md:text-5xl font-bold text-yellow-400">
                {(prediction.draw_prob * 100).toFixed(1)}%
              </div>
              <p className="text-slate-400 mt-2">Empate</p>
            </div>

            <div className="text-center bg-slate-800 p-4 rounded">
              <div className="text-4xl md:text-5xl font-bold text-pink-400">
                {(prediction.away_win_prob * 100).toFixed(1)}%
              </div>
              <p className="text-slate-400 mt-2">Victoria Visitante</p>
            </div>
          </div>

          {/* Exact Scores if available */}
          {prediction.exact_scores && Array.isArray(prediction.exact_scores) && (
            <div>
              <h3 className="font-semibold mb-4 text-slate-300">Resultados Exactos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {prediction.exact_scores
                  .sort(
                    (a: any, b: any) => (b?.probability ?? 0) - (a?.probability ?? 0)
                  )
                  .slice(0, 12)
                  .map((score: any, i: number) => (
                    <div
                      key={i}
                      className="bg-slate-800 p-3 rounded text-center text-sm"
                    >
                      <div className="font-bold text-lg">
                        {score.home} - {score.away}
                      </div>
                      <div className="text-slate-400 text-xs">
                        {((score.probability ?? 0) * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Expected Scorers */}
      {scorerPredictions && scorerPredictions.length > 0 && (
        <section className="bg-slate-900 p-6 rounded-lg border border-slate-700">
          <h2 className="text-2xl font-bold mb-6">Goleadores Esperados</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Home Scorers */}
            <div>
              <h3 className="font-bold mb-4 text-lg text-slate-300 flex items-center gap-2">
                <span className="text-2xl">{fixture.home_flag}</span>
                {fixture.home_name}
              </h3>
              <ul className="space-y-3">
                {scorerPredictions
                  .filter(
                    (s: any) =>
                      s.team === fixture.home_team_id ||
                      s.team === fixture.home_code
                  )
                  .sort((a: any, b: any) => (b?.probability ?? 0) - (a?.probability ?? 0))
                  .slice(0, 5)
                  .map((s: any, i: number) => (
                    <li
                      key={i}
                      className="flex justify-between items-center p-3 bg-slate-800 rounded text-sm"
                    >
                      <span className="text-slate-300">{s.player_name || "Unknown"}</span>
                      <span className="bg-blue-900 px-3 py-1 rounded text-blue-300 font-mono">
                        {((s.probability ?? 0) * 100).toFixed(1)}%
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Away Scorers */}
            <div>
              <h3 className="font-bold mb-4 text-lg text-slate-300 flex items-center gap-2">
                <span className="text-2xl">{fixture.away_flag}</span>
                {fixture.away_name}
              </h3>
              <ul className="space-y-3">
                {scorerPredictions
                  .filter(
                    (s: any) =>
                      s.team === fixture.away_team_id ||
                      s.team === fixture.away_code
                  )
                  .sort((a: any, b: any) => (b?.probability ?? 0) - (a?.probability ?? 0))
                  .slice(0, 5)
                  .map((s: any, i: number) => (
                    <li
                      key={i}
                      className="flex justify-between items-center p-3 bg-slate-800 rounded text-sm"
                    >
                      <span className="text-slate-300">{s.player_name || "Unknown"}</span>
                      <span className="bg-pink-900 px-3 py-1 rounded text-pink-300 font-mono">
                        {((s.probability ?? 0) * 100).toFixed(1)}%
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Debug Info (remove in production) */}
      <footer className="mt-12 pt-6 border-t border-slate-700 text-xs text-slate-500">
        <p>Fixture ID: {fixtureId} | Round: {validation.round} | Last updated: {new Date().toISOString()}</p>
      </footer>
    </main>
  );
}

// ─────────────────────────────────────────────────────────
// Static Generation for Performance
// ─────────────────────────────────────────────────────────

export async function generateStaticParams() {
  // Pre-render popular fixtures for faster performance
  const popularFixtures = [
    1, // MEX vs RSA (Apertura)
    6, // Final Group A match
    72, // Final Group L match
    73, // First R16 match
    87, // Final
  ];

  return popularFixtures.map((id) => ({
    id: id.toString(),
  }));
}

export const revalidate = 3600; // Revalidate every hour

// ═════════════════════════════════════════════════════════════════════════
// FILE 2: app/capture/[id]/page.tsx
// COMPLETE REFACTORED VERSION (copy all of this)
// ═════════════════════════════════════════════════════════════════════════

/**
 * This is the same pattern as /match/[id]/page.tsx
 * Just swap the component rendering part
 */

import { notFound } from "next/navigation";
import { getFixtureDetail } from "@/lib/actions";
import { validateFixtureId } from "@/lib/constants/fixture-mapping";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CapturePageAsync(props: PageProps) {
  const { id } = await props.params;

  // ─────────────────────────────────────────────────────────
  // Step 1: Parse and validate fixture ID
  // ─────────────────────────────────────────────────────────

  const fixtureId = parseInt(id, 10);

  const validation = validateFixtureId(fixtureId);
  if (!validation.valid) {
    console.warn(`[CapturePage] Invalid fixture ID: ${validation.message}`);
    notFound();
  }

  // ─────────────────────────────────────────────────────────
  // Step 2: Fetch fixture details
  // ─────────────────────────────────────────────────────────

  const fixtureData = await getFixtureDetail(fixtureId);

  if (!fixtureData) {
    console.error(`[CapturePage] Failed to fetch fixture ${fixtureId}`);
    notFound();
  }

  const { fixture, prediction } = fixtureData;

  // ─────────────────────────────────────────────────────────
  // Step 3: Render capture/screenshot page
  // ─────────────────────────────────────────────────────────

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white flex items-center justify-center p-4">
      {/* 
        CAPTURE LAYOUT: Optimized for screenshot/social media sharing
        Dimensions: 1200x630 (optimal for Instagram, Twitter, etc.)
      */}

      <div className="w-full max-w-4xl bg-slate-900 rounded-2xl border-2 border-slate-700 overflow-hidden shadow-2xl">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-slate-950 to-slate-800 p-6 border-b border-slate-700">
          <div className="text-center">
            <p className="text-slate-400 text-sm uppercase tracking-widest mb-2">
              {validation.round}
              {validation.group ? ` • Group ${validation.group}` : ""}
            </p>
            <h1 className="text-4xl font-black tracking-tight">
              {fixture.home_name} vs {fixture.away_name}
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Match Details Grid */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            {/* Home Team */}
            <div className="text-center">
              <div className="text-6xl mb-3">{fixture.home_flag}</div>
              <h2 className="text-2xl font-bold mb-3">{fixture.home_name}</h2>
              <div className="text-slate-400 text-sm space-y-1">
                <p>FIFA: #{fixture.home_fifa}</p>
                <p>Ataque: {(fixture.home_off * 100).toFixed(0)}%</p>
                <p>Defensa: {(fixture.home_def * 100).toFixed(0)}%</p>
              </div>
            </div>

            {/* VS Badge */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-5xl font-black text-slate-600 mb-2">VS</div>
              <div className="text-sm text-slate-500">
                {fixture.date
                  ? new Date(fixture.date).toLocaleDateString("es-ES")
                  : "TBD"}
              </div>
            </div>

            {/* Away Team */}
            <div className="text-center">
              <div className="text-6xl mb-3">{fixture.away_flag}</div>
              <h2 className="text-2xl font-bold mb-3">{fixture.away_name}</h2>
              <div className="text-slate-400 text-sm space-y-1">
                <p>FIFA: #{fixture.away_fifa}</p>
                <p>Ataque: {(fixture.away_off * 100).toFixed(0)}%</p>
                <p>Defensa: {(fixture.away_def * 100).toFixed(0)}%</p>
              </div>
            </div>
          </div>

          {/* Prediction Odds */}
          {prediction && (
            <div className="grid grid-cols-3 gap-4 bg-slate-800 p-6 rounded-lg">
              <div className="text-center">
                <div className="text-5xl font-black text-blue-400 mb-2">
                  {(prediction.home_win_prob * 100).toFixed(0)}%
                </div>
                <p className="text-slate-300">Victoria Local</p>
              </div>

              <div className="text-center border-l border-r border-slate-700">
                <div className="text-5xl font-black text-yellow-400 mb-2">
                  {(prediction.draw_prob * 100).toFixed(0)}%
                </div>
                <p className="text-slate-300">Empate</p>
              </div>

              <div className="text-center">
                <div className="text-5xl font-black text-pink-400 mb-2">
                  {(prediction.away_win_prob * 100).toFixed(0)}%
                </div>
                <p className="text-slate-300">Victoria Visitante</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-8 py-4 border-t border-slate-700 text-center text-sm text-slate-500">
          <p>
            Predicción de IA • Fixture #{fixtureId} • {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Static Generation for Performance
// ─────────────────────────────────────────────────────────

export async function generateStaticParams() {
  // Pre-render popular fixtures
  const popularFixtures = [1, 6, 72, 73, 87];
  return popularFixtures.map((id) => ({
    id: id.toString(),
  }));
}

export const revalidate = 3600; // Revalidate every hour

// ═════════════════════════════════════════════════════════════════════════
// END OF REPLACEMENTS
// ═════════════════════════════════════════════════════════════════════════
