import React from 'react';
import { Settings } from 'lucide-react';

export function ConfigurationParams({ config, onConfigChange }) {
    const handleChange = (field, value) => {
        onConfigChange({ ...config, [field]: parseInt(value) || 0 });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-6">
            <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold border-b pb-2">
                <Settings className="w-5 h-5" />
                <h2>Parámetros del Régimen</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Días Trabajo (N)</label>
                    <input
                        type="number"
                        min="1"
                        value={config.workDays}
                        onChange={(e) => handleChange('workDays', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Días Descanso (M)</label>
                    <input
                        type="number"
                        min="1"
                        value={config.restDays}
                        onChange={(e) => handleChange('restDays', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Días Inducción</label>
                    <input
                        type="number"
                        min="0"
                        max={config.workDays - 2} // Must leave room for S/B
                        value={config.inductionDays}
                        onChange={(e) => handleChange('inductionDays', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Días Simulación</label>
                    <input
                        type="number"
                        min="15"
                        max="365"
                        value={config.simulationDays}
                        onChange={(e) => handleChange('simulationDays', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
