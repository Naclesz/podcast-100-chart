import type { ProfilerOnRenderCallback } from "react";

export const createProfilerCallback = (): ProfilerOnRenderCallback => {
  return (
    profilerId,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    if (import.meta.env.DEV) {
      console.log(`🔍 [Profiler: ${profilerId}]`, {
        phase,
        actualDuration: `${actualDuration.toFixed(2)}ms`,
        baseDuration: `${baseDuration.toFixed(2)}ms`,
        startTime: `${startTime.toFixed(2)}ms`,
        commitTime: `${commitTime.toFixed(2)}ms`,
        timestamp: new Date().toISOString(),
      });
    }
  };
};
