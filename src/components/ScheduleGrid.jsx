import React from 'react';
import { clsx } from 'clsx';
import { ValidationRow } from './ValidationRow';

export function ScheduleGrid({ schedule, offsets }) {
    // Helper to render a single row
    const renderRow = (label, supervisorKey, offset) => (
        <div className="flex border-t border-l border-slate-300">
            <div className="w-32 flex-shrink-0 bg-slate-100 p-2 border-b border-r border-slate-300 font-bold text-slate-700 flex flex-col justify-center">
                <span>{label}</span>
                <span className="text-xs font-normal text-slate-500">Offset: {offset}</span>
            </div>

            {schedule.map((dayData) => {
                const status = dayData[supervisorKey]; // s1, s2, or s3
                return (
                    <div
                        key={dayData.day}
                        className={clsx(
                            "w-12 flex-shrink-0 h-10 border-b border-r border-slate-300 flex items-center justify-center text-white font-bold text-sm transition-colors",
                            status.color
                        )}
                        title={`Día ${dayData.day}: ${status.label}`}
                    >
                        {status.code}
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h2 className="font-bold text-slate-700">Visualización de Turnos</h2>
                <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-600 rounded"></div> Subida</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-400 rounded"></div> Inducción</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded"></div> Perforación</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded"></div> Bajada</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-200 rounded"></div> Descanso</div>
                </div>
            </div>

            <div className="overflow-x-auto pb-4">
                {/* Header Row (Days) */}
                <div className="flex border-l border-slate-300 min-w-max">
                    <div className="w-32 flex-shrink-0 p-2 bg-slate-50 border-b border-r border-slate-300 text-xs text-slate-500 font-bold uppercase tracking-wider">
                        Supervisor
                    </div>
                    {schedule.map((dayData) => (
                        <div
                            key={dayData.day}
                            className="w-12 flex-shrink-0 p-2 bg-slate-50 border-b border-r border-slate-300 text-center text-xs text-slate-500 font-medium"
                        >
                            {dayData.day}
                        </div>
                    ))}
                </div>

                {/* Rows */}
                <div className="min-w-max">
                    {renderRow('Supervisor 1', 's1', offsets.s1)}
                    {renderRow('Supervisor 2', 's2', offsets.s2)}
                    {renderRow('Supervisor 3', 's3', offsets.s3)}

                    {/* Validation Row embedded here for alignment */}
                    <ValidationRow schedule={schedule} />
                </div>
            </div>
        </div>
    );
}
