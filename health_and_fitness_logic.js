(function (global, factory) {
  const exports = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
  }
  global.HealthFitnessLogic = exports;
})(typeof window !== 'undefined' ? window : globalThis, () => {
  const ALLOWED_WORKOUT_KEYS = new Set([
    'date',
    'cardio',
    'strength',
    'feel',
    'goal',
    'energy',
    'recovery',
    'notes',
    'totalMoved'
  ]);

  const isValidWorkout = (workout) => {
    if (!workout || typeof workout !== 'object' || Array.isArray(workout)) return false;
    if (typeof workout.date !== 'string' || !workout.date.trim()) return false;
    if (!Object.keys(workout).every((key) => ALLOWED_WORKOUT_KEYS.has(key))) return false;

    const optionalStringFields = ['cardio', 'strength', 'feel', 'goal', 'energy', 'recovery', 'notes'];
    return optionalStringFields.every((field) => workout[field] == null || typeof workout[field] === 'string')
      && (workout.totalMoved == null || Number.isFinite(workout.totalMoved));
  };

  const summarizeStrengthEntries = (machines, getEntry) => {
    let totalMoved = 0;
    const strength = machines.map((machine, index) => {
      const entry = getEntry(index) || {};
      const weight = Number(entry.weight) || 0;
      const sets = Number(entry.sets) || 0;
      const reps = Number(entry.reps) || 0;

      totalMoved += weight * sets * reps;
      return weight || sets || reps ? `${machine}: ${weight} lb, ${sets}×${reps}` : '';
    }).filter(Boolean).join(', ');

    return { strength, totalMoved };
  };

  return {
    isValidWorkout,
    summarizeStrengthEntries
  };
});
