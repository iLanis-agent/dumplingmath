# Dumpling math oracle - mirrors engine.js float ops exactly (math.floor(x+0.5) == JS Math.round for positive magnitudes).
import json, math

def round1(x):
    return math.floor(x * 10 + 0.5) / 10

def dough_yield(flourG, hydrationPct, wrapperG):
    if not (flourG > 0): return {"error": "flour must be positive"}
    if not (hydrationPct > 0): return {"error": "hydration must be positive"}
    if not (wrapperG > 0): return {"error": "wrapper weight must be positive"}
    dough = round1(flourG * (1 + hydrationPct / 100))
    wrappers = math.floor(dough / wrapperG)
    leftover = round1(dough - wrappers * wrapperG)
    return {"dough": dough, "wrappers": wrappers, "leftover": leftover}

def filling_match(wrappers, perG, fillingG):
    if not (wrappers > 0): return {"error": "wrappers must be positive"}
    if not (perG > 0): return {"error": "filling per wrapper must be positive"}
    if not (fillingG >= 0): return {"error": "filling must not be negative"}
    needed = round1(wrappers * perG)
    possible = math.floor(fillingG / perG)
    delta = round1(fillingG - needed)
    verdict = ("enough for every wrapper, %g g spare" % delta) if delta >= 0 else ("short %g g - fills only %d wrappers" % (-delta if delta else delta, possible))
    if delta < 0: verdict = "short %g g - fills only %d wrappers" % (round1(-delta), possible)
    return {"needed": needed, "possible": possible, "delta": delta, "verdict": verdict}

def batch_cook(dumplings, perRound, minutesPerRound):
    if not (dumplings > 0): return {"error": "dumplings must be positive"}
    if not (perRound > 0): return {"error": "capacity must be positive"}
    if not (minutesPerRound > 0): return {"error": "minutes must be positive"}
    rounds = math.ceil(dumplings / perRound)
    totalMin = round1(rounds * minutesPerRound)
    lastRound = dumplings - (rounds - 1) * perRound
    return {"rounds": rounds, "totalMin": totalMin, "lastRound": lastRound}

cases = []
def dy(*a): cases.append({"tool": "dough", "args": list(a), "expect": dough_yield(*a)})
def fm(*a): cases.append({"tool": "filling", "args": list(a), "expect": filling_match(*a)})
def bc(*a): cases.append({"tool": "cook", "args": list(a), "expect": batch_cook(*a)})

# dough: happy
dy(500, 55, 12)         # defaults -> 775 g, 64, 7
dy(250, 60, 12)
dy(1000, 50, 15)        # big batch, bigger wrappers
dy(300, 45, 10)
dy(120, 55, 12)         # small batch: 186/12 = 15.5 -> 15, 6
dy(500, 55, 8)          # mini wrappers
dy(750.5, 52.5, 12.5)   # decimals
dy(200, 100, 20)        # 100% hydration
dy(96, 50, 12)          # 144/12 = exactly 12, leftover 0
# dough: errors
dy(0, 55, 12)
dy(-500, 55, 12)
dy(500, 0, 12)
dy(500, 55, 0)
dy(500, -5, 12)

# filling: happy
fm(64, 15, 1000)        # enough, 40 spare
fm(64, 15, 900)         # short 60, fills 60
fm(64, 15, 960)         # exactly enough, delta 0
fm(50, 20, 800)         # short
fm(30, 12, 500)         # enough
fm(100, 18, 1500)       # short 300, fills 83
fm(40, 15, 0)           # no filling at all
fm(25, 14.5, 400)       # decimals
fm(80, 16, 1280)        # exact
# filling: errors
fm(0, 15, 1000)
fm(-5, 15, 1000)
fm(64, 0, 1000)
fm(64, -2, 1000)
fm(64, 15, -100)

# cook: happy
bc(64, 12, 8)           # defaults: 6 rounds, 48 min, last 4
bc(60, 12, 8)           # exact 5 rounds, last 12
bc(1, 12, 8)            # single dumpling
bc(12, 12, 10)          # one round
bc(100, 8, 12)          # 13 rounds
bc(30, 7, 6.5)          # decimals minutes
bc(45, 15, 9)
bc(200, 25, 11)
# cook: errors
bc(0, 12, 8)
bc(-10, 12, 8)
bc(64, 0, 8)
bc(64, 12, 0)
bc(64, -3, 8)

with open("expected.json", "w") as f:
    json.dump(cases, f, indent=1)
print(len(cases), "cases written")
