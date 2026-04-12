# Performance Fix Report (No Regressions)

## Step 1 — Audit List

[ISSUE] Admin rows re-render on every parent state change  
[TYPE] Rendering  
[SEVERITY] Critical  
[LOCATION] src/pages/Admin.tsx  
[FIX PLAN] Memoize row components and pass stable callbacks so unchanged rows skip re-rendering.

[ISSUE] Admin handlers and section options recreated every render  
[TYPE] Rendering  
[SEVERITY] High  
[LOCATION] src/pages/Admin.tsx  
[FIX PLAN] Use useCallback for hot handlers and move static section options to module scope.

[ISSUE] Large admin lists are fully painted even when off-screen  
[TYPE] DOM overload  
[SEVERITY] High  
[LOCATION] src/pages/Admin.tsx  
[FIX PLAN] Apply CSS content-visibility containment to list wrappers and row containers.

[ISSUE] Sidebar nav and dropdown item arrays rebuilt each render  
[TYPE] Rendering  
[SEVERITY] Medium  
[LOCATION] src/components/layout/Sidebar.tsx  
[FIX PLAN] Memoize nav and menu item arrays and stabilize navigation handlers.

[ISSUE] Toast timeouts are unmanaged under burst notifications  
[TYPE] Memory  
[SEVERITY] Medium  
[LOCATION] src/components/ui/Toast.tsx  
[FIX PLAN] Track timeout handles in a map and clear/reuse safely.

[ISSUE] API requests are not cancellable on unmount across call sites  
[TYPE] Network  
[SEVERITY] Low  
[LOCATION] src/lib/api.ts  
[FIX PLAN] Flagged only to avoid behavior-contract changes without a broader API update.

---

## Applied Fixes

### --- FIX: Memoized Admin Row Components ---
**BEFORE:**
```tsx
function UserRow(...) { ... }
function CourseRow(...) { ... }
function ExerciseRow(...) { ... }
function BadgeRow(...) { ... }
```

**AFTER:**
```tsx
const UserRow = memo(function UserRow(...) { ... })
const CourseRow = memo(function CourseRow(...) { ... })
const ExerciseRow = memo(function ExerciseRow(...) { ... })
const BadgeRow = memo(function BadgeRow(...) { ... })
```

**WHY:** Prevents full row re-renders when unrelated admin state changes.  
**RISK:** Low (render optimization only, no behavior/UI changes).

### --- FIX: Stable Admin Handlers and Constants ---
**BEFORE:**
```tsx
async function loadAll() { ... }
function saveSettings(e) { ... }
function signOut() { ... }
{ [ { key: 'users', ... }, ... ].map(...) }
```

**AFTER:**
```tsx
const loadAll = useCallback(async () => { ... }, [])
const saveSettings = useCallback((e) => { ... }, [...])
const signOut = useCallback(() => { ... }, [...])
const SECTION_OPTIONS = [ ... ] as const
```

**WHY:** Reduces function/object churn and stabilizes props passed into children.  
**RISK:** Low (same logic, memoized references only).

### --- FIX: DOM Containment for Long Admin Lists ---
**BEFORE:**
```tsx
<div className="space-y-2">
  {rows.map(...)}
</div>
```

**AFTER:**
```tsx
<div className="space-y-2" style={{ contentVisibility: 'auto', containIntrinsicSize: '360px' }}>
  {rows.map(...)}
</div>

<div className="p-3 ..." style={{ contentVisibility: 'auto', containIntrinsicSize: '120px' }}>
  ...
</div>
```

**WHY:** Browser skips off-screen layout/paint work, improving scroll and interaction responsiveness on large datasets.  
**RISK:** Low (no layout/style value changes visible to users).

### --- FIX: Sidebar Memoization of Nav and Dropdown Data ---
**BEFORE:**
```tsx
const NAV_ITEMS = [ ... ]
const go = (path) => { ... }
const handleSignOut = () => { ... }
[ ...dropdownItems... ].map(...)
```

**AFTER:**
```tsx
const NAV_ITEMS = useMemo(() => [ ... ], [isAdmin, t])
const go = useCallback((path) => { ... }, [navigate, onClose])
const handleSignOut = useCallback(() => { ... }, [clearAuth, navigate, onClose])
const menuItems = useMemo(() => [ ... ], [t])
```

**WHY:** Cuts avoidable re-allocation and lowers render pressure in frequently mounted navigation shell.  
**RISK:** Low (same output and behavior).

### --- FIX: Toast Timeout Lifecycle Management ---
**BEFORE:**
```ts
setTimeout(() => {
  toastQueue = toastQueue.filter(...)
  listeners.forEach(...)
}, 3000)
```

**AFTER:**
```ts
const toastTimers = new Map(...)
const existing = toastTimers.get(id)
if (existing) clearTimeout(existing)
const timeoutId = setTimeout(() => {
  toastQueue = toastQueue.filter(...)
  toastTimers.delete(id)
  listeners.forEach(...)
}, 3000)
toastTimers.set(id, timeoutId)
```

**WHY:** Prevents stale timer buildup during rapid toast bursts and keeps memory/timer lifecycle bounded.  
**RISK:** Low (same toast behavior and duration).

---

## Validation Status

- No diagnostics in edited files:
  - src/pages/Admin.tsx
  - src/components/layout/Sidebar.tsx
  - src/components/ui/Toast.tsx

- Build succeeded:
  - npm run build
  - Vite production build completed successfully

---

## Summary Table

| Fix | Type | Expected Gain | Risk |
|---|---|---|---|
| Memoized admin row components | Rendering | High on admin pages with many items | Low |
| Stable admin handlers/constants | Rendering | Medium | Low |
| Content-visibility containment | DOM | High on long lists/scrolling | Low |
| Sidebar memoization | Rendering | Medium in shell navigation | Low |
| Managed toast timers | Memory | Medium during heavy notification bursts | Low |
| AbortController rollout flagged only | Network | Potential medium if implemented later | None (not applied) |
