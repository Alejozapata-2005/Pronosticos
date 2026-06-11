# 🔧 INTEGRATION GUIDE: getFixtureDetail() Refactor + Fixture Mapping

**Date:** January 2025  
**Status:** Production-Ready Code  
**Files Involved:** 3 new files + 2 existing files to update  

---

## 📋 Overview

This refactor provides:
1. **Error-proof `getFixtureDetail()` function** with comprehensive try/catch and JSON safety
2. **Fixture ID coherence validation** ensuring no null responses for valid tournament matches
3. **Type-safe fixture mapping** that validates all 87 World Cup 2026 fixtures
4. **Production-ready logging** with field-specific context for debugging

---

## 📦 NEW FILES CREATED

### 1. `lib/actions.improved.ts` ✅
**What:** Refactored `getFixtureDetail()` function with robust error handling  
**Size:** ~400 lines (documented with inline comments)  
**Key Features:**
- Global try/catch wrapper (prevents server crashes)
- Input validation (ID type, range, tournament coherence)
- Safe JSON parsing for all database fields
- Fallback values for missing predictions/players
- Comprehensive error logging with `[getFixtureDetail]` prefix
- Helper functions: `isValidFixtureIdRange()`, `isValidFixtureRange()`, `getFixtureRound()`

**When to use:** Replace your current `getFixtureDetail()` function in `lib/actions.ts`

---

### 2. `lib/constants/fixture-mapping.ts` ✅
**What:** Fixture ID structure and validation for all 87 World Cup 2026 matches  
**Size:** ~300 lines  
**Key Exports:**
- `FIXTURE_ID_RANGES` – complete mapping (Group 1-72, R16 73-80, QF 81-84, SF 85-86, Final 87)
- `GROUP_STAGE_FIXTURES` – all 12 groups with fixture IDs and matchups
- `KNOCKOUT_FIXTURES` – Round of 16 through Final with placeholder IDs (A1, B2, W73, etc.)
- `validateFixtureId(id)` – returns validation object with round + group metadata
- `getFixtureRound(id)` – quick lookup for round name
- `getGroupFromFixtureId(id)` – quick lookup for group letter
- `TEST_FIXTURE_IDS` – test cases for all round types

**When to use:** Import in any component/action that needs fixture ID validation

---

## 🔄 INTEGRATION STEPS

### Step 1: Back Up Existing Code ⚠️
```bash
# Create backup of current lib/actions.ts
cp lib/actions.ts lib/actions.backup.ts

# Commit backup
git add lib/actions.backup.ts
git commit -m "chore: backup original lib/actions.ts before refactor"
```

---

### Step 2: Replace getFixtureDetail() Function

**Location:** `lib/actions.ts`

**Action:** Copy the **ENTIRE** `getFixtureDetail()` function from `lib/actions.improved.ts` and replace the current version in `lib/actions.ts`.

**What to keep:** Everything EXCEPT the function itself
- Keep all other Server Actions (getTournamentSims, getFixtures, getProjectedStandings, etc.)
- Keep the imports at top of file
- Keep the `safeJsonParse()` utility (or use the improved version from .improved.ts)

**What to replace:** Only this:
```typescript
export async function getFixtureDetail(id: number) {
  try {
    // ... current code ...
  } catch (error) {
    console.error(`[getFixtureDetail] ...`);
    return null;
  }
}
```

**With this:** Copy the entire refactored function from `lib/actions.improved.ts`

---

### Step 3: Add Fixture Validation to Routes

**File:** `app/match/[id]/page.tsx`

**Find this line:**
```typescript
const fixture = await getFixtureDetail(fixtureId);
```

**Replace with:**
```typescript
// Import at top of file:
import { validateFixtureId } from "@/lib/constants/fixture-mapping";

// Then in your component:
const validation = validateFixtureId(fixtureId);
if (!validation.valid) {
  console.warn(`[Match Route] ${validation.message}`);
  notFound();
}

const fixture = await getFixtureDetail(fixtureId);
if (!fixture) {
  console.error(`[Match Route] Failed to fetch fixture ${fixtureId}`);
  notFound();
}
```

---

### Step 4: Update Capture Route (Same Pattern)

**File:** `app/capture/[id]/page.tsx`

Apply the same validation pattern:
```typescript
import { validateFixtureId } from "@/lib/constants/fixture-mapping";

const validation = validateFixtureId(fixtureId);
if (!validation.valid) {
  notFound();
}

const fixture = await getFixtureDetail(fixtureId);
if (!fixture) {
  notFound();
}
```

---

### Step 5: Verify Imports in lib/actions.ts

Ensure these imports exist at the top:
```typescript
"use server";

import { db } from "./db/index";
import { predictGoalscorers } from "./model/scorers";
```

The refactored function uses both `db` and `predictGoalscorers`, so verify they're available.

---

### Step 6: Test Locally

```bash
# Start dev server
pnpm dev

# Test valid fixtures (should return data):
# - Group stage: http://localhost:3000/match/1 (MEX vs RSA)
# - Group stage: http://localhost:3000/match/72 (last group match)
# - Round of 16: http://localhost:3000/match/73
# - Final: http://localhost:3000/match/87

# Test invalid fixtures (should show 404):
# - http://localhost:3000/match/0
# - http://localhost:3000/match/88
# - http://localhost:3000/match/999
```

---

### Step 7: Build & Deploy

```bash
# Local build
pnpm build

# If successful:
git add .
git commit -m "refactor: add error-proof getFixtureDetail() with fixture ID validation

- Replace getFixtureDetail() with robust error handling
- Add fixture mapping validation (87 total fixtures)
- Implement tournament coherence checks (Group 1-72, R16 73-80, etc.)
- Safe JSON parsing for all database fields
- Comprehensive error logging with context
- Add validateFixtureId() and getFixtureRound() helpers"

git push origin main

# Deploy to Vercel
vercel deploy --prod
```

---

## 📊 FIXTURE ID REFERENCE CHART

| Round | IDs | Count | Examples |
|-------|-----|-------|----------|
| **Group Stage** | 1-72 | 72 | ID=1 (MEX vs RSA), ID=25 (GER vs CUW), ID=72 (final group match) |
| **Round of 16** | 73-80 | 8 | ID=73 (A1 vs B2), ID=77 (E1 vs F2) |
| **Quarter-finals** | 81-84 | 4 | ID=81, ID=82, ID=83, ID=84 |
| **Semi-finals** | 85-86 | 2 | ID=85, ID=86 |
| **Final** | 87 | 1 | ID=87 |

---

## ✅ VALIDATION CHECKLIST

After integration, verify:

- [ ] Build compiles: `pnpm build` shows no errors
- [ ] No TypeScript errors in `/match` and `/capture` routes
- [ ] `localhost:3000/match/1` returns fixture data (not null)
- [ ] `localhost:3000/match/87` returns fixture data (not null)
- [ ] `localhost:3000/match/88` shows 404 (handled gracefully)
- [ ] Browser console shows no errors on /match/[id] pages
- [ ] Vercel logs show `[getFixtureDetail]` entries with field names (not crashes)
- [ ] `pnpm cron:run` completes without errors

---

## 🐛 DEBUGGING

If you see errors:

### Error: "Fixture with ID X not found in database"
**Cause:** Database doesn't have this fixture seeded  
**Fix:** Run `scripts/world_cup_2026_sync.sql` or call `syncWorldCup2026Data()`

### Error: "Failed to parse JSON for field 'exact_scores'"
**Cause:** Corrupted JSON in predictions table (old data)  
**Fix:** Delete predictions table and regenerate: `DELETE FROM predictions;` then `pnpm cron:run`

### Error: "Invalid fixture ID (not integer or ≤0)"
**Cause:** Route param passed as string, not parsed to number  
**Fix:** Verify `lib/constants/fixture-mapping.ts` is imported and `validateFixtureId()` is called

### Vercel crash "SyntaxError: 'undefined' no es JSON válido"
**Cause:** Response is null/undefined from getFixtureDetail()  
**Fix:** Check Vercel logs for `[getFixtureDetail]` error messages; database likely needs sync

---

## 📚 RELATED FILES

- `lib/constants/teams.ts` – 48 teams with metadata (already created)
- `scripts/world_cup_2026_sync.sql` – Database seed script
- `lib/db/world_cup_2026_seed.ts` – TypeScript seeding function
- `DB_SYNC_README.md` – Full setup documentation

---

## 🚀 AFTER INTEGRATION

Once deployed:

1. **Monitor Vercel logs** for 72 hours to ensure no crashes
2. **Check `/match/[id]` pages** load all fixtures smoothly
3. **Verify predictions** recalculate correctly with `pnpm cron:run`
4. **Update CHANGELOG** with refactor details
5. **Document any changes** to error handling in team knowledge base

---

## 📞 SUPPORT

If integration fails:
1. Check `lib/actions.improved.ts` for exact copy-paste requirements
2. Verify all imports are present
3. Run `git diff` to see changes before commit
4. Test with `pnpm dev` before pushing

---

**Status:** ✅ Production-ready  
**Last Updated:** January 2025  
**Version:** 1.0.0
