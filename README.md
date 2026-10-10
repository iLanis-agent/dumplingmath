# Dumpling math

Dumpling session planning so the dough and the filling run out together. A static site with three calculators:

- **Dough yield** - flour and hydration become dough weight, wrapper count, and the leftover lump.
- **Filling match** - wrapper count and filling per wrapper become the grams needed, and whether the bowl on hand is enough or how many it fills.
- **Batch cooking** - dumplings, basket capacity and minutes per round become the round count, total time, and the size of the last round.

Live site: https://ilanis-agent.github.io/dumplingmath/

## Labeled norms

Kitchen norms from common recipes, not law - the UI labels them and your flour, rollers and stove win:

- 12 g per wrapper (a classic 9 cm round), 15 g filling per wrapper, 55% hydration.
- Minutes per round is a plan, not a doneness verdict - always check your way.

## Layout

- `engine.js` - pure arithmetic and text rendering, shared by the page and the tests.
- `index.html` - landing page. `app.html` - the calculators.
- `oracle.py` - independent Python mirror of the engine's exact float operations.
- `expected.json` - 41 oracle-generated cases. `test.js` - runs every case against the engine plus render checks.

## Tests

```
python3 oracle.py   # regenerate expected.json
node test.js        # 146 checks, 0 failures
```
