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
    const prototype = Object.getPrototypeOf(workout);
    if (prototype !== Object.prototype && prototype !== null) return false;
    if (typeof workout.date !== 'string' || !workout.date.trim()) return false;
    if (!Object.keys(workout).every((key) => ALLOWED_WORKOUT_KEYS.has(key))) return false;

    const optionalStringFields = ['cardio', 'strength', 'feel', 'goal', 'energy', 'recovery', 'notes'];
    return optionalStringFields.every((field) => !Object.prototype.hasOwnProperty.call(workout, field) || typeof workout[field] === 'string')
      && (!Object.prototype.hasOwnProperty.call(workout, 'totalMoved') || Number.isFinite(workout.totalMoved));
  };

  const summarizeStrengthEntries = (machines, getEntry) => {
    const parseMetric = (value) => {
      if (value == null || value === '') return { value: 0, valid: false, empty: true };
      const number = Number(value);
      return Number.isFinite(number)
        ? { value: number, valid: true, empty: false }
        : { value: 0, valid: false, empty: false };
    };

    let totalMoved = 0;
    const strength = machines.map((machine, index) => {
      const entry = getEntry(index) || {};
      const weightMetric = parseMetric(entry.weight);
      const setsMetric = parseMetric(entry.sets);
      const repsMetric = parseMetric(entry.reps);
      const weight = weightMetric.value;
      const sets = setsMetric.value;
      const reps = repsMetric.value;
      const hasValidInput = weightMetric.valid || setsMetric.valid || repsMetric.valid;

      totalMoved += weight * sets * reps;
      return hasValidInput ? `${machine}: ${weight} lb, ${sets}×${reps}` : '';
    }).filter(Boolean).join(', ');

    return { strength, totalMoved };
  };

  const parseImportedWorkouts = (raw) => {
    if (typeof raw !== 'string') throw new Error('invalid-file');

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      throw new Error('invalid-json');
    }

    if (!Array.isArray(parsed) || !parsed.every(isValidWorkout)) {
      throw new Error('invalid-structure');
    }

    return parsed;
  };

  return {
    isValidWorkout,
    summarizeStrengthEntries,
    parseImportedWorkouts
  };
});
