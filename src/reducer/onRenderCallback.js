// The onRender callback function
function onRenderCallback(
  id, // The "id" prop of the Profiler
  phase, // Either "mount" (initial render) or "update" (re-render)
  actualDuration, // Time spent rendering the Profiler tree
  baseDuration, // Estimated time to render without memoization
  startTime, // When React began rendering
  endTime, // When React finished rendering
  interactions // Set of interactions for this render
) {
  console.log({
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    endTime,
    interactions,
  });
  // Flag slow renders
  if (actualDuration > 10) {
    console.warn(`⚠️ Slow render detected in ${id}: ${actualDuration}ms`);
  }
}

export default onRenderCallback;
