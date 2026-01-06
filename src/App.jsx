import React, { useState } from 'react';
import { HardHat } from 'lucide-react'; // Changed from Helmet to HardHat if available, else standard icon
import { ConfigurationParams } from './components/ConfigurationParams';
import { ScheduleGrid } from './components/ScheduleGrid';
import { useScheduleCalculator, DEFAULT_CONFIG } from './hooks/useScheduleCalculator';

function App() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const { schedule, offsets, stats } = useScheduleCalculator(config);

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <header className="max-w-7xl mx-auto mb-8 flex items-center gap-3">
        <div className="p-3 bg-blue-600 rounded-lg shadow-lg text-white">
          <HardHat className="w-8 h-8" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Cronograma Supervisores Mineros</h1>
          <p className="text-slate-500 text-sm">Validación Algorítmica de Turnos (NxM)</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-6">
        <ConfigurationParams
          config={config}
          onConfigChange={setConfig}
        />

        {stats.minErrors > 0 && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md flex items-center gap-2 mb-4">
            <span className="font-bold">Nota:</span>
            No se encontró un offset perfecto para S2. Errores mínimos encontrados: {stats.minErrors} días.
          </div>
        )}

        <ScheduleGrid
          schedule={schedule}
          offsets={offsets}
        />

        <div className="text-center text-xs text-slate-400 mt-12 pb-6">
          Algoritmo v1.0 • Estrategia: Offset S1(0) + Offset S3(Adaptativo) + S2(Fuerza Bruta)
        </div>
      </main>
    </div>
  );
}

export default App;
