/*
Footer Component.
Contains disclaimer about entertainment sports data.
No double hyphens in comments.
*/

export default function Footer() {
  return (
    <footer className="border-t border-card-border bg-slate-950 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <p className="font-terminal text-xs text-slate-400">
              MUNDIAL 2026 IA PREDICTOR
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-lg">
              Advertencia: Análisis estadístico con fines de entretenimiento. No constituye asesoría financiera ni de apuestas deportivas. No se procesan apuestas en este sitio.
            </p>
          </div>
          <div className="text-center md:text-right font-terminal text-xs text-slate-500">
            <span>Desarrollado por Alejo Zapata • Medellín, Colombia 🇨🇴</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
