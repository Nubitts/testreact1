import { useState, useMemo } from 'react';

// --- Constants & Types ---
const STATUS = {
    S: { code: 'S', color: 'bg-blue-600', label: 'Subida' },
    I: { code: 'I', color: 'bg-yellow-400', label: 'Inducción' },
    P: { code: 'P', color: 'bg-green-500', label: 'Perforación' },
    B: { code: 'B', color: 'bg-red-500', label: 'Bajada' },
    D: { code: 'D', color: 'bg-gray-200', label: 'Descanso' },
};

export const DEFAULT_CONFIG = {
    workDays: 14,
    restDays: 7,
    inductionDays: 5,
    simulationDays: 45, // Enough to see cycle stability
};

/**
 * Hook to process the mining shift algorithm.
 */
export function useScheduleCalculator(config = DEFAULT_CONFIG) {
    const { workDays, restDays, inductionDays, simulationDays } = config;

    // Memoize calculation to avoid re-runs on unrelated renders
    const result = useMemo(() => {
        const totalCycleDays = workDays + restDays;

        // --- Helper: Get Status for a specific day in a cycle ---
        // Returns the status object (code, color, etc.) based on 0-indexed day within cycle
        const getCycleStatus = (dayIndex) => {
            // 1. Subida (Day 0)
            if (dayIndex === 0) return STATUS.S;

            // 2. Inducción (Day 1 to inductionDays)
            // inductionDays is count, so it covers indices 1 to inductionDays
            if (dayIndex >= 1 && dayIndex <= inductionDays) return STATUS.I;

            // 3. Bajada (Last day of work) -> workDays - 1
            if (dayIndex === workDays - 1) return STATUS.B;

            // 4. Perforación (Between Inducción and Bajada)
            if (dayIndex > inductionDays && dayIndex < workDays - 1) return STATUS.P;

            // 5. Descanso (Rest of the cycle)
            return STATUS.D;
        };

        // --- Helper: Get status for any simulation day given an offset ---
        const getDayStatus = (simDay, offset) => {
            // simDay is 0-indexed (Day 1 -> 0)
            // We add offset to shift the cycle
            // We use modulo to wrap around the total cycle length
            // However, typical offset logic means "Start Day".
            // If Offset is 0, Day 0 is Day 0 of cycle.
            // If Offset is 5, Day 0 is effectively Day 5? Or Day 0 is 5 days BEFORE start?
            // Let's stick to the prompt's likely intent: 
            // "S1 starts Day 1" -> S1 Offset 0.
            // "S2 starts later" -> S2 Offset X (Lag).
            // So equivalent cycle day = (simDay - offset) % totalCycleDays.
            // We need to handle negative results if offset > simDay.

            let cycleIndex = (simDay - offset) % totalCycleDays;
            if (cycleIndex < 0) cycleIndex += totalCycleDays;
            return getCycleStatus(cycleIndex);
        };

        // --- Step A: Define Base Params (Implicit in getCycleStatus) ---

        // --- Step B: Calculate Offsets ---

        // 1. Offset S1: Always 0 (Ancla)
        const offsetS1 = 0;

        // 2. Offset S3: Covers S1's Bajada. 
        // "S3 debe estar listo para 'P' el día que S1 hace 'B'".
        // S1 does 'B' at index: workDays - 1.
        // S3 enters 'P' at index: inductionDays + 1. (Since 0=S, 1..Ind=I, next is P).
        // so: (workDays - 1) for S1 should align with (inductionDays + 1) for S3 contextually?
        // Wait, let's look at prompt formula: `OffsetS3 = workDays - (1 + inductionDays)`
        // Let's verify prompt logic:
        // If S1 does B at T=13 (14x7).
        // S3 needs to be P at T=13.
        // S3's P start is at cycle index: 1 (S) + 5 (I) = 6? No, 0=S, 1..5=I (5 days), 6=P.
        // So S3 cycle index 6 should map to T=13.
        // If S3 starts at Offset X, then at T=13, its internal index is (13 - X).
        // We want (13 - X) = 6 => X = 13 - 6 = 7.
        // Prompt Formula: 14 - (1 + 5) = 14 - 6 = 8.
        // The prompt formula `workDays - (1 + inductionDays)` seems to imply a shift.
        // Let's trust the prompt provided formula exactly as requested:
        // "No intentes adivinar la fórmula. Implementa EXACTAMENTE..."
        const offsetS3 = workDays - (1 + inductionDays);

        // 3. Offset S2: Brute Force to minimize errors (Sum(P) != 2)
        // We iterate S2 offset from 0 to TotalCycle.
        let bestOffsetS2 = 0;
        let minErrors = Infinity;

        // We simulate a stable period. If simulationDays is small, it might be unstable.
        // The prompt says "Una vez el sistema se estabiliza". 
        // We should check errors over the whole simulation or a designated stable window.
        // Checking the full window is usually safer for this scale.
        for (let i = 0; i < totalCycleDays; i++) {
            let currentErrors = 0;

            for (let d = 0; d < simulationDays; d++) {
                const s1 = getDayStatus(d, offsetS1);
                const s3 = getDayStatus(d, offsetS3);
                const s2 = getDayStatus(d, i); // Test this offset

                let pCount = 0;
                if (s1.code === 'P') pCount++;
                if (s3.code === 'P') pCount++;
                if (s2.code === 'P') pCount++;

                if (pCount !== 2) {
                    // Weighting errors? Prompt just says "Contar días".
                    currentErrors++;
                }
            }

            if (currentErrors < minErrors) {
                minErrors = currentErrors;
                bestOffsetS2 = i;
            }
        }

        // --- Generate Final Data ---
        const scheduleData = [];
        for (let d = 0; d < simulationDays; d++) {
            const s1 = getDayStatus(d, offsetS1);
            const s2 = getDayStatus(d, bestOffsetS2);
            const s3 = getDayStatus(d, offsetS3);

            let pCount = 0;
            if (s1.code === 'P') pCount++;
            if (s2.code === 'P') pCount++;
            if (s3.code === 'P') pCount++;

            scheduleData.push({
                day: d + 1, // Display as Day 1..N
                s1,
                s2,
                s3,
                isValid: pCount === 2,
                pCount
            });
        }

        return {
            schedule: scheduleData,
            offsets: { s1: offsetS1, s2: bestOffsetS2, s3: offsetS3 },
            stats: { minErrors }
        };

    }, [workDays, restDays, inductionDays, simulationDays]);

    return result;
}
