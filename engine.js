// Dumpling math engine - dumpling batch planning arithmetic.
// Pure functions, no DOM. All borrowed norms are labeled in the UI, not buried here.
'use strict';

function round1(x) { return Math.round(x * 10) / 10; }

// --- Dough yield -------------------------------------------------------------
// Flour plus hydration gives dough weight; labeled norm grams per wrapper
// decides the count. Leftover is what's too small to roll out.
function doughYield(flourG, hydrationPct, wrapperG) {
  if (!(flourG > 0)) return { error: 'flour must be positive' };
  if (!(hydrationPct > 0)) return { error: 'hydration must be positive' };
  if (!(wrapperG > 0)) return { error: 'wrapper weight must be positive' };
  var dough = round1(flourG * (1 + hydrationPct / 100));
  var wrappers = Math.floor(dough / wrapperG);
  var leftover = round1(dough - wrappers * wrapperG);
  return { dough: dough, wrappers: wrappers, leftover: leftover };
}

// --- Filling match -----------------------------------------------------------
// Filling per wrapper is a labeled norm (about 15 g for a classic 9 cm round).
// Given the wrappers and the filling on hand: needed, possible, and the gap.
function fillingMatch(wrappers, perG, fillingG) {
  if (!(wrappers > 0)) return { error: 'wrappers must be positive' };
  if (!(perG > 0)) return { error: 'filling per wrapper must be positive' };
  if (!(fillingG >= 0)) return { error: 'filling must not be negative' };
  var needed = round1(wrappers * perG);
  var possible = Math.floor(fillingG / perG);
  var delta = round1(fillingG - needed);
  var verdict = delta >= 0
    ? 'enough for every wrapper, ' + delta + ' g spare'
    : 'short ' + round1(-delta) + ' g - fills only ' + possible + ' wrappers';
  return { needed: needed, possible: possible, delta: delta, verdict: verdict };
}

// --- Batch cooking -----------------------------------------------------------
// Baskets (or the pot) hold a fixed count per round; minutes per round is a
// labeled heuristic - always check doneness, time is a plan not a verdict.
function batchCook(dumplings, perRound, minutesPerRound) {
  if (!(dumplings > 0)) return { error: 'dumplings must be positive' };
  if (!(perRound > 0)) return { error: 'capacity must be positive' };
  if (!(minutesPerRound > 0)) return { error: 'minutes must be positive' };
  var rounds = Math.ceil(dumplings / perRound);
  var totalMin = round1(rounds * minutesPerRound);
  var lastRound = dumplings - (rounds - 1) * perRound;
  return { rounds: rounds, totalMin: totalMin, lastRound: lastRound };
}

// --- Text rendering (shared by UI and tests) ---------------------------------
function renderDough(r) {
  if (r.error) return r.error;
  return r.dough + ' g of dough makes ' + r.wrappers + ' wrappers with ' + r.leftover + ' g left over.';
}
function renderFilling(r) {
  if (r.error) return r.error;
  return 'You need ' + r.needed + ' g of filling - ' + r.verdict + '.';
}
function renderCook(r) {
  if (r.error) return r.error;
  return r.rounds + ' rounds, ' + r.totalMin + ' minutes total; last round holds ' + r.lastRound + '.';
}

var api = {
  round1: round1,
  doughYield: doughYield,
  fillingMatch: fillingMatch,
  batchCook: batchCook,
  renderDough: renderDough,
  renderFilling: renderFilling,
  renderCook: renderCook
};
if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.DumplingMath = api;
