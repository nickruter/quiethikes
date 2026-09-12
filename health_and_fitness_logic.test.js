const test = require('node:test');
const assert = require('node:assert/strict');

const { isValidWorkout, summarizeStrengthEntries, parseImportedWorkouts } = require('./health_and_fitness_logic');

test('summarizeStrengthEntries computes total moved', () => {
  const machines = ['Leg press', 'Chest press'];
  const { strength, totalMoved } = summarizeStrengthEntries(machines, (index) => [
    { weight: '150', sets: '2', reps: '10' },
    { weight: '90', sets: '3', reps: '8' }
  ][index]);

  assert.equal(totalMoved, 5160);
  assert.equal(strength, 'Leg press: 150 lb, 2×10, Chest press: 90 lb, 3×8');
});

test('summarizeStrengthEntries keeps partially filled rows', () => {
  const machines = ['Leg curl', 'Row'];
  const { strength, totalMoved } = summarizeStrengthEntries(machines, (index) => [
    { weight: '90', sets: '', reps: '12' },
    { weight: '', sets: '', reps: '' }
  ][index]);

  assert.equal(totalMoved, 0);
  assert.equal(strength, 'Leg curl: 90 lb, 0×12');
});

test('summarizeStrengthEntries ignores non-numeric junk-only rows', () => {
  const machines = ['Leg curl'];
  const { strength, totalMoved } = summarizeStrengthEntries(machines, () => ({
    weight: 'abc',
    sets: '',
    reps: ''
  }));

  assert.equal(totalMoved, 0);
  assert.equal(strength, '');
});

test('isValidWorkout rejects unexpected properties', () => {
  assert.equal(isValidWorkout({
    date: '2026-09-12',
    cardio: '20 min',
    unexpected: true
  }), false);
});

test('parseImportedWorkouts rejects invalid JSON', () => {
  assert.throws(
    () => parseImportedWorkouts('{not json'),
    /invalid-json/
  );
});

test('parseImportedWorkouts rejects invalid workout structure', () => {
  assert.throws(
    () => parseImportedWorkouts(JSON.stringify([{ date: '2026-09-12', extra: true }])),
    /invalid-structure/
  );
});

test('parseImportedWorkouts rejects non-string input', () => {
  assert.throws(
    () => parseImportedWorkouts(new Uint8Array([123, 125])),
    /invalid-file/
  );
});
