import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';

export function ValidationRow({ schedule }) {
    return (
        <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-bold text-slate-700">Validación: Total Perforando (Objetivo: 2)</h3>
            </div>

            <div className="flex border-t border-l border-slate-300">
                <div className="w-32 flex-shrink-0 bg-slate-100 p-2 border-b border-r border-slate-300 text-xs font-semibold flex items-center">
                    Regla (P=2)
                </div>

                {schedule.map((dayData) => {
                    const isCorrect = dayData.pCount === 2;

                    return (
                        <div
                            key={dayData.day}
                            className={clsx(
                                "w-12 flex-shrink-0 h-10 border-b border-r border-slate-300 flex items-center justify-center",
                                isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700 font-bold"
                            )}
                            title={`Día ${dayData.day}: ${dayData.pCount} Perforando`}
                        >
                            {isCorrect ? (
                                <CheckCircle className="w-4 h-4 opacity-50" />
                            ) : (
                                <span className="flex items-center gap-1 text-xs">
                                    {dayData.pCount}
                                    <AlertTriangle className="w-3 h-3" />
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
