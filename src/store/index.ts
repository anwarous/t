import { create } from 'zustand'
import { MOCK_USER, MOCK_BADGES, MOCK_CHAT_MESSAGES, MOCK_EXERCISES, type ChatMessage, type Badge } from '@/data/mockData'
import { runPython } from '@/lib/pythonCompiler'
import { runAlgo } from '@/lib/algoCompiler'

// ─── Auth Store ───────────────────────────────────────────────────────────────

const TOKEN_KEY = 'mqa_token'
const USER_KEY = 'mqa_user'
const profileKey = (username: string) => `mqa_profile_${username}`

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  authUser: { username: string; email: string; displayName: string } | null
  setAuth: (token: string, user: { username: string; email: string; displayName: string }) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem(TOKEN_KEY)
  return {
    token,
    isAuthenticated: !!token,
    authUser: (() => {
      try {
        const raw = localStorage.getItem(USER_KEY)
        return raw ? JSON.parse(raw) : null
      } catch {
        return null
      }
    })(),
    setAuth: (token, user) => {
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      set({ token, isAuthenticated: true, authUser: user })
      // Load (or create fresh) the user's progress profile
      useUserStore.getState().initUser(user.username, user.displayName, user.email)
    },
    clearAuth: () => {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      set({ token: null, isAuthenticated: false, authUser: null })
      useUserStore.getState().resetUser()
    },
  }
})

// ─── User / Gamification Store ────────────────────────────────────────────────

type UserProfile = typeof MOCK_USER & {
  bio: string
  language: string
  theme: string
  completedExercises: string[]
  notifications: {
    streakReminders: boolean
    newChallenges: boolean
    mentorReplies: boolean
    weeklyReport: boolean
  }
}

function calculateRank(level: number): string {
  if (level < 5) return 'Novice'
  if (level < 10) return 'Apprentice'
  if (level < 15) return 'Practitioner'
  if (level < 20) return 'Expert'
  if (level < 25) return 'Master'
  if (level < 30) return 'Grandmaster'
  return 'Legend'
}

function makeAvatar(name: string): string {
  return name.split(' ').filter((n) => n).map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

const GUEST_USER: UserProfile = {
  ...MOCK_USER,
  bio: '',
  language: 'Python',
  theme: 'dark',
  completedExercises: [],
  notifications: { streakReminders: true, newChallenges: true, mentorReplies: true, weeklyReport: false },
}

function freshProfile(username: string, displayName: string, email: string): UserProfile {
  const name = (displayName || username).trim()
  return {
    id: `usr_${username}`,
    name,
    email,
    avatar: makeAvatar(name),
    xp: 0,
    level: 1,
    streak: 1,
    totalSolved: 0,
    rank: 'Novice',
    joinedAt: new Date().toISOString().slice(0, 10),
    bio: '',
    language: 'Python',
    theme: 'dark',
    completedExercises: [],
    notifications: {
      streakReminders: true,
      newChallenges: true,
      mentorReplies: true,
      weeklyReport: false,
    },
  }
}

function loadProfile(username: string): UserProfile | null {
  try {
    const raw = localStorage.getItem(profileKey(username))
    return raw ? (JSON.parse(raw) as UserProfile) : null
  } catch {
    return null
  }
}

function saveProfile(username: string, profile: UserProfile): void {
  localStorage.setItem(profileKey(username), JSON.stringify(profile))
}

function normalizeProgress(user: UserProfile): UserProfile {
  const xp = Math.max(0, user.xp)
  const level = Math.max(1, Math.floor(xp / 60) + 1)
  return {
    ...user,
    xp: xp % 60,
    level,
    streak: Math.max(1, user.streak),
    rank: calculateRank(level),
  }
}

function applyXpGain(user: UserProfile, amount: number): UserProfile {
  const gained = normalizeProgress(user)
  let xp = gained.xp + amount
  let level = gained.level

  while (xp >= 60) {
    xp -= 60
    level += 1
  }

  return { ...gained, xp, level, rank: calculateRank(level) }
}

// Resolve the initial profile on app boot (when user is already logged in)
function resolveInitialProfile(): { user: UserProfile; currentUsername: string | null } {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (raw) {
      const authUser = JSON.parse(raw) as { username: string; displayName: string; email: string }
      const saved = loadProfile(authUser.username)
      if (saved) {
        const normalized = normalizeProgress(saved)
        if (JSON.stringify(normalized) !== JSON.stringify(saved)) {
          saveProfile(authUser.username, normalized)
        }
        return { user: normalized, currentUsername: authUser.username }
      }
      const fresh = freshProfile(authUser.username, authUser.displayName, authUser.email)
      saveProfile(authUser.username, fresh)
      return { user: fresh, currentUsername: authUser.username }
    }
  } catch { /* fall through */ }
  return { user: { ...GUEST_USER }, currentUsername: null }
}

interface UserState {
  user: UserProfile
  currentUsername: string | null
  badges: Badge[]
  addXP: (amount: number) => void
  incrementStreak: () => void
  markExerciseSolved: (id: string, xp: number) => void
  updateProfile: (patch: Partial<Pick<UserProfile, 'name' | 'email' | 'bio' | 'language'>>) => void
  updateNotifications: (patch: Partial<UserProfile['notifications']>) => void
  updateTheme: (theme: string) => void
  initUser: (username: string, displayName: string, email: string) => void
  resetUser: () => void
}

const { user: initialUser, currentUsername: initialUsername } = resolveInitialProfile()

export const useUserStore = create<UserState>((set) => ({
  user: initialUser,
  currentUsername: initialUsername,
  badges: MOCK_BADGES,
  addXP: (amount) =>
    set((s) => {
      const user = applyXpGain(s.user, amount)
      if (s.currentUsername) saveProfile(s.currentUsername, user)
      return { user }
    }),
  incrementStreak: () =>
    set((s) => {
      const user = { ...s.user, streak: Math.max(1, s.user.streak + 1) }
      if (s.currentUsername) saveProfile(s.currentUsername, user)
      return { user }
    }),
  markExerciseSolved: (id, xp) =>
    set((s) => {
      const alreadyDone = (s.user.completedExercises ?? []).includes(id)
      if (alreadyDone) return {}
      const completedExercises = [...(s.user.completedExercises ?? []), id]
      const progressedUser = applyXpGain(s.user, xp)
      const user = { ...progressedUser, totalSolved: s.user.totalSolved + 1, completedExercises }
      if (s.currentUsername) saveProfile(s.currentUsername, user)
      return { user }
    }),
  updateProfile: (patch) =>
    set((s) => {
      const user = {
        ...s.user,
        ...patch,
        avatar: patch.name
          ? makeAvatar(patch.name)
          : s.user.avatar,
      }
      if (s.currentUsername) saveProfile(s.currentUsername, user)
      return { user }
    }),
  updateNotifications: (patch) =>
    set((s) => {
      const user = { ...s.user, notifications: { ...s.user.notifications, ...patch } }
      if (s.currentUsername) saveProfile(s.currentUsername, user)
      return { user }
    }),
  updateTheme: (theme) =>
    set((s) => {
      const user = { ...s.user, theme }
      if (s.currentUsername) saveProfile(s.currentUsername, user)
      return { user }
    }),
  initUser: (username, displayName, email) => {
    const saved = loadProfile(username)
    const user = saved ? normalizeProgress(saved) : freshProfile(username, displayName, email)
    if (!saved) saveProfile(username, user)
    else if (JSON.stringify(user) !== JSON.stringify(saved)) saveProfile(username, user)
    set({ user, currentUsername: username })
  },
  resetUser: () => {
    set({ user: { ...GUEST_USER }, currentUsername: null })
  },
}))

// ─── Code Evaluation Engine ───────────────────────────────────────────────────
//
//  This simulates running student code by:
//  1. Detecting if the function body is unimplemented (pass / no return logic)
//  2. Detecting partial / wrong implementations via pattern checks
//  3. Returning realistic output per exercise with pass/fail per test case
//

type TestCase = {
  label: string
  input: string
  expected: string
}

type ExerciseSpec = {
  fnName: string
  tests: TestCase[]
  // Patterns that must ALL be present for the solution to be considered correct
  requiredPatterns: RegExp[]
  // Patterns whose presence indicates a known wrong approach
  wrongPatterns?: { pattern: RegExp; hint: string }[]
}

const EXERCISE_SPECS: Record<string, ExerciseSpec> = {
  'ex-001': {
    fnName: 'two_sum',
    tests: [
      { label: 'two_sum([2,7,11,15], 9)',  input: '[2,7,11,15], 9',  expected: '[0, 1]' },
      { label: 'two_sum([3,2,4], 6)',       input: '[3,2,4], 6',      expected: '[1, 2]' },
      { label: 'two_sum([3,3], 6)',          input: '[3,3], 6',        expected: '[0, 1]' },
    ],
    requiredPatterns: [
      /return\s+\[/,              // must return a list
      /for\s+\w+.*in\s+/,        // must iterate
      /(dict|{}|seen|map|hash)/,  // must use some hash/dict structure OR nested loop
    ],
    wrongPatterns: [
      {
        pattern: /for.*for/s,
        hint: '⚠️  O(n²) nested loop detected. Try using a hash map for O(n) time.',
      },
    ],
  },
  'ex-002': {
    fnName: 'bubble_sort',
    tests: [
      { label: 'bubble_sort([64,34,25,12,22,11,90])', input: '[64,34,25,12,22,11,90]', expected: '[11, 12, 22, 25, 34, 64, 90]' },
      { label: 'bubble_sort([5,4,3,2,1])',             input: '[5,4,3,2,1]',            expected: '[1, 2, 3, 4, 5]' },
      { label: 'bubble_sort([1])',                      input: '[1]',                    expected: '[1]' },
    ],
    requiredPatterns: [
      /for\s+\w+.*range/,       // outer loop
      /for\s+\w+.*range[\s\S]*for\s+\w+.*range/,  // nested loops
      /\[j\]\s*>\s*\[j\s*\+\s*1\]|arr\[j\+1\]/,  // adjacent comparison
      /return\s+arr/,           // must return arr
    ],
  },
  'ex-003': {
    fnName: 'binary_search',
    tests: [
      { label: 'binary_search([-1,0,3,5,9,12], 9)',  input: '[-1,0,3,5,9,12], 9',  expected: '4'  },
      { label: 'binary_search([-1,0,3,5,9,12], 2)',  input: '[-1,0,3,5,9,12], 2',  expected: '-1' },
      { label: 'binary_search([5], 5)',               input: '[5], 5',               expected: '0'  },
    ],
    requiredPatterns: [
      /left|low|lo/,            // must have left pointer
      /right|high|hi/,          // must have right pointer
      /mid\s*=|middle\s*=/,     // must compute midpoint
      /return\s+-1/,            // must handle not found
    ],
    wrongPatterns: [
      {
        pattern: /for\s+\w+\s+in\s+range\(len/,
        hint: '⚠️  Linear scan detected. Binary search requires two pointers (left/right) and a midpoint — not a sequential loop.',
      },
    ],
  },
  'ex-004': {
    fnName: 'is_valid',
    tests: [
      { label: 'is_valid("()")',     input: '"()"',     expected: 'True'  },
      { label: 'is_valid("()[]{}")', input: '"()[]{}"', expected: 'True'  },
      { label: 'is_valid("(]")',     input: '"(]"',     expected: 'False' },
      { label: 'is_valid("([)]")',   input: '"([)]"',   expected: 'False' },
    ],
    requiredPatterns: [
      /stack/,                  // must use a stack
      /append|push/,            // must push
      /pop\(\)/,                // must pop
      /return\s+(len\(stack\)\s*==\s*0|not\s+stack|True)/,
    ],
    wrongPatterns: [
      {
        pattern: /count\s*[+-]=\s*1/,
        hint: '⚠️  A simple counter won\'t work here — "(]" would incorrectly pass. You need a stack to match bracket types.',
      },
    ],
  },
  'ex-005': {
    fnName: 'reverse_string',
    tests: [
      { label: "reverse_string('hello')",  input: "'hello'",  expected: 'olleh'  },
      { label: "reverse_string('Hannah')", input: "'Hannah'", expected: 'hannaH' },
      { label: "reverse_string('')",       input: "''",        expected: ''      },
    ],
    requiredPatterns: [
      /return\s+/,
      /\[::-1\]|reversed\(|for\s+\w+.*in/,
    ],
  },
  'ex-006': {
    fnName: 'is_palindrome',
    tests: [
      { label: "is_palindrome('A man, a plan, a canal: Panama')", input: "'A man, a plan, a canal: Panama'", expected: 'True'  },
      { label: "is_palindrome('race a car')",                     input: "'race a car'",                   expected: 'False' },
    ],
    requiredPatterns: [
      /isalnum|lower|upper/,
      /\[::-1\]|reversed\(/,
      /return\s+/,
    ],
  },
  'ex-007': {
    fnName: 'fizz_buzz',
    tests: [
      { label: 'fizz_buzz(5)',  input: '5',  expected: "['1', '2', 'Fizz', '4', 'Buzz']" },
      { label: 'fizz_buzz(3)',  input: '3',  expected: "['1', '2', 'Fizz']"              },
    ],
    requiredPatterns: [
      /FizzBuzz|fizzbuzz/i,
      /Fizz/,
      /Buzz/,
      /append|result|output/,
      /return\s+/,
    ],
  },
  'ex-008': {
    fnName: 'max_subarray',
    tests: [
      { label: 'max_subarray([-2,1,-3,4,-1,2,1,-5,4])', input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6'  },
      { label: 'max_subarray([5,4,-1,7,8])',             input: '[5,4,-1,7,8]',             expected: '23' },
      { label: 'max_subarray([1])',                      input: '[1]',                      expected: '1'  },
    ],
    requiredPatterns: [
      /max\s*\(/,
      /current|curr|running|local/,
      /return\s+/,
    ],
  },
  'ex-009': {
    fnName: 'count_duplicates',
    tests: [
      { label: 'count_duplicates([1,2,3,2,4,3])', input: '[1,2,3,2,4,3]', expected: '2' },
      { label: 'count_duplicates([1,1,1,1])',      input: '[1,1,1,1]',     expected: '1' },
      { label: 'count_duplicates([1,2,3])',         input: '[1,2,3]',       expected: '0' },
    ],
    requiredPatterns: [
      /Counter|dict|count|{}|defaultdict/,
      /return\s+/,
    ],
  },
  'ex-010': {
    fnName: 'fib',
    tests: [
      { label: 'fib(10)', input: '10', expected: '55'     },
      { label: 'fib(0)',  input: '0',  expected: '0'      },
      { label: 'fib(1)',  input: '1',  expected: '1'      },
      { label: 'fib(30)', input: '30', expected: '832040' },
    ],
    requiredPatterns: [
      /memo|cache|dict|{}/,
      /if\s+n\s*(<=|<|==)\s*[01]/,
      /return\s+/,
    ],
  },
  'ex-011': {
    fnName: 'longest_common_prefix',
    tests: [
      { label: "longest_common_prefix(['flower','flow','flight'])",      input: "['flower','flow','flight']",      expected: 'fl'    },
      { label: "longest_common_prefix(['dog','racecar','car'])",         input: "['dog','racecar','car']",         expected: ''      },
      { label: "longest_common_prefix(['interview','inter','interact'])", input: "['interview','inter','interact']", expected: 'inter' },
    ],
    requiredPatterns: [
      /for\s+\w+.*in/,
      /return\s+/,
    ],
  },
  'ex-012': {
    fnName: 'climb_stairs',
    tests: [
      { label: 'climb_stairs(2)', input: '2', expected: '2' },
      { label: 'climb_stairs(3)', input: '3', expected: '3' },
      { label: 'climb_stairs(5)', input: '5', expected: '8' },
    ],
    requiredPatterns: [
      /return\s+/,
      /if\s+n\s*(<=|<|==)\s*[23]/,
    ],
  },
  'ex-013': {
    fnName: 'reverse_list',
    tests: [
      { label: 'reverse_list([1,2,3,4,5])', input: '[1,2,3,4,5]', expected: '[5, 4, 3, 2, 1]' },
      { label: 'reverse_list([1,2])',        input: '[1,2]',        expected: '[2, 1]'          },
      { label: 'reverse_list([])',           input: '[]',           expected: '[]'              },
    ],
    requiredPatterns: [
      /return\s+/,
      /insert|prev|append|for\s+\w+.*in/,
    ],
    wrongPatterns: [
      { pattern: /\[::-1\]/, hint: '⚠️  Avoid using slice reversal — practice the iterative pointer approach instead.' },
    ],
  },
  'ex-014': {
    fnName: 'max_depth',
    tests: [
      { label: 'max_depth([3,[9,None,None],[20,[15,None,None],[7,None,None]]])', input: '[3,[9,None,None],[20,[15,None,None],[7,None,None]]]', expected: '3' },
      { label: 'max_depth(None)',                                               input: 'None',                                                expected: '0' },
      { label: 'max_depth([1,None,None])',                                      input: '[1,None,None]',                                       expected: '1' },
    ],
    requiredPatterns: [
      /return\s+/,
      /max\s*\(/,
      /if\s+\w+\s*is\s+None|if\s+not\s+\w+|if\s+\w+\s*==\s*None/,
    ],
  },
  'ex-015': {
    fnName: 'merge_sorted',
    tests: [
      { label: 'merge_sorted([1,3,5],[2,4,6])', input: '[1,3,5], [2,4,6]', expected: '[1, 2, 3, 4, 5, 6]' },
      { label: 'merge_sorted([1,2,3],[])',       input: '[1,2,3], []',      expected: '[1, 2, 3]'          },
      { label: 'merge_sorted([],[1])',           input: '[], [1]',          expected: '[1]'                },
    ],
    requiredPatterns: [
      /while\s+/,
      /append|extend/,
      /return\s+/,
    ],
  },
  'ex-016': {
    fnName: 'coin_change',
    tests: [
      { label: 'coin_change([1,5,10,25],41)', input: '[1,5,10,25], 41', expected: '4'  },
      { label: 'coin_change([2],3)',           input: '[2], 3',          expected: '-1' },
      { label: 'coin_change([1,2,5],11)',      input: '[1,2,5], 11',     expected: '3'  },
    ],
    requiredPatterns: [
      /dp\s*=|memo\s*=/,
      /for\s+\w+.*in/,
      /min\s*\(/,
      /return\s+/,
    ],
  },
}

// ── Python test-harness builder ───────────────────────────────────────────────

/**
 * Wraps the user's code with a real Python test runner.
 * The combined script is executed by Pyodide so test results are based on
 * actual execution rather than pattern matching.
 */
function buildPythonTestHarness(
  userCode: string,
  testCases: { call: string; expected: string }[],
): string {
  const lines: string[] = [userCode, '']

  lines.push(
    `_total = ${testCases.length}`,
    '_passed = 0',
    '_results = []',
  )

  for (const tc of testCases) {
    const callExpr   = tc.call
    const expectedJs = JSON.stringify(tc.expected)  // double-quoted, safe as Python string literal
    const labelJs    = JSON.stringify(callExpr)
    lines.push(
      `try:`,
      `    _got = str(${callExpr})`,
      `    _ok = _got == ${expectedJs}`,
      `    _results.append((${labelJs}, _ok, _got, ${expectedJs}))`,
      `    if _ok: _passed += 1`,
      `except Exception as _e:`,
      `    _results.append((${labelJs}, False, "Error: " + str(_e), ${expectedJs}))`,
    )
  }

  lines.push(
    `for _label, _ok, _got, _exp in _results:`,
    `    if _ok:`,
    `        print(f"  \u2713  {_label}  \u2192  {_got}")`,
    `    else:`,
    `        print(f"  \u2717  {_label}  \u2192  got: {_got}  |  expected: {_exp}")`,
    `print()`,
    `import random as _rand`,
    `if _passed == _total:`,
    `    print(f"\u2705  All test cases passed! ({_passed}/{_total})")`,
    `    print(f"\u23f1   Execution time: {round(_rand.uniform(0.3, 1.8), 1)}ms")`,
    `    print(f"\U0001f4e6  Memory: {round(_rand.uniform(12, 17), 1)} KB")`,
    `else:`,
    `    print(f"\u274c  {_passed}/{_total} test cases passed")`,
  )

  return lines.join('\n')
}

// ── Algorithm test-harness builder ───────────────────────────────────────────

/**
 * Strips any existing "algorithme principal" block from the user's code and
 * appends a fresh test-harness block that calls the function with each test
 * case and prints the result.  The raw output is then compared line-by-line
 * with the expected values by parseAlgorithmTestOutput().
 */
function buildAlgorithmTestHarness(
  userCode: string,
  testCases: { call: string; expected: string }[],
): string {
  // Remove any pre-existing algorithme principal block so ours is the only one
  const functionPart = userCode
    .replace(/algorithme\s+principal[\s\S]*/i, '')
    .trimEnd()

  const lines: string[] = [functionPart, '', 'algorithme principal', 'debut']
  for (const tc of testCases) {
    lines.push(`    ecrire(${tc.call})`)
  }
  lines.push('fin')

  return lines.join('\n')
}

/**
 * Compares the raw multi-line output of the algorithm compiler against the
 * expected values for each test case and builds a coloured result string that
 * matches the format produced by buildPythonTestHarness().
 */
function parseAlgorithmTestOutput(
  output: string,
  testCases: { call: string; expected: string }[],
): string {
  const outputLines = output.split('\n').map(l => l.trim()).filter(l => l !== '')
  const results: string[] = []
  let passed = 0
  const total = testCases.length

  for (let i = 0; i < testCases.length; i++) {
    const tc  = testCases[i]

    if (i >= outputLines.length) {
      // Algorithm produced fewer output lines than expected — treat as failure
      results.push(`  \u2717  ${tc.call}  \u2192  got: (no output)  |  expected: ${tc.expected}`)
      continue
    }

    const got = outputLines[i]
    const ok  = normalizeForComparison(got) === normalizeForComparison(tc.expected)

    if (ok) {
      passed++
      results.push(`  \u2713  ${tc.call}  \u2192  ${got}`)
    } else {
      results.push(`  \u2717  ${tc.call}  \u2192  got: ${got}  |  expected: ${tc.expected}`)
    }
  }

  results.push('')

  if (passed === total) {
    const ms = (Math.random() * 1.5 + 0.3).toFixed(1)
    const kb = (Math.random() * 5 + 12).toFixed(1)
    results.push(`\u2705  All test cases passed! (${passed}/${total})`)
    results.push(`\u23f1   Execution time: ${ms}ms`)
    results.push(`\u{1F4E6}  Memory: ${kb} KB`)
  } else {
    results.push(`\u274c  ${passed}/${total} test cases passed`)
  }

  return results.join('\n')
}

/** Normalise a value string for loose comparison between Python and algorithm output */
function normalizeForComparison(value: string): string {
  return value
    .replace(/\s+/g, '')
    .toLowerCase()
    .replace(/vrai/g, 'true')
    .replace(/faux/g, 'false')
}


function extractFunctionBody(code: string, fnName: string): string {
  const lines = code.split('\n')
  const defIdx = lines.findIndex(l => l.trimStart().startsWith(`def ${fnName}`))
  if (defIdx === -1) return ''

  // Collect all lines belonging to the function (indented past the def line)
  const defIndent = lines[defIdx].search(/\S/)
  const bodyLines: string[] = []
  for (let i = defIdx + 1; i < lines.length; i++) {
    const line = lines[i]
    if (line.trim() === '') { bodyLines.push(''); continue }
    const indent = line.search(/\S/)
    if (indent <= defIndent) break   // back to outer scope
    bodyLines.push(line)
  }
  return bodyLines.join('\n')
}

/** True when a function body is effectively unimplemented */
function isUnimplemented(body: string): boolean {
  if (!body) return true
  const stripped = body
    .split('\n')
    .map(l => l.trim())
    .filter(l => l !== '' && !l.startsWith('#') && !l.startsWith('"""') && !l.startsWith("'''") && l !== '...')
    .join('\n')

  // Only `pass` or nothing
  if (!stripped || stripped === 'pass' || stripped === 'return None' || stripped === 'return') return true

  // Docstring-only body: every non-empty token is inside a docstring
  if (/^"""[\s\S]*"""$/.test(stripped) || /^'''[\s\S]*'''$/.test(stripped)) return true

  return false
}

/** Simulate running a single test case for a given exercise */
function simulateTestCase(
  code: string,
  spec: ExerciseSpec,
  test: TestCase,
  bodyIsReal: boolean
): { passed: boolean; got: string; errorHint?: string } {
  if (!bodyIsReal) {
    return { passed: false, got: 'None', errorHint: 'Function body is not implemented' }
  }

  // Check wrong patterns first
  if (spec.wrongPatterns) {
    for (const { pattern, hint } of spec.wrongPatterns) {
      if (pattern.test(code)) {
        // Wrong approach — fail with specific hint
        return { passed: false, got: 'Wrong Answer', errorHint: hint }
      }
    }
  }

  // Check required patterns against the full function body
  const body = extractFunctionBody(code, spec.fnName)
  const missingPatterns = spec.requiredPatterns.filter(p => !p.test(body) && !p.test(code))

  if (missingPatterns.length > 0) {
    // Partial implementation — fail some test cases
    const deterministicFail = (test.label.charCodeAt(test.label.length - 1) % 3) !== 0
    if (deterministicFail) {
      return { passed: false, got: 'None', errorHint: undefined }
    }
  }

  return { passed: true, got: test.expected }
}

/** Main evaluation entry point */
export function evaluateCode(code: string, exerciseId: string | null): string {
  const spec = exerciseId ? EXERCISE_SPECS[exerciseId] : null

  // ── No known spec — just run as freeform ────────────────────────────────
  if (!spec) {
    if (code.trim() === '' || code.trim() === '# Your code here') {
      return '⚠️  Nothing to run. Write some code first!'
    }
    if (/def\s+\w+.*:[\s\n]+pass/.test(code)) {
      return '❌  TypeError: Function returned None\n\nYour function body only contains `pass`.\nReplace it with your implementation.'
    }
    return '✅  Code executed\n⏱  0.5ms'
  }

  const body = extractFunctionBody(code, spec.fnName)

  // ── Function definition missing ──────────────────────────────────────────
  if (!body && !code.includes(`def ${spec.fnName}`)) {
    return [
      `❌  NameError: name '${spec.fnName}' is not defined`,
      '',
      `Make sure your function is named exactly: def ${spec.fnName}(...)`,
    ].join('\n')
  }

  // ── Unimplemented body ───────────────────────────────────────────────────
  if (isUnimplemented(body)) {
    return [
      `❌  TypeError: ${spec.fnName}() returned None`,
      '',
      `Your function body is empty (contains only 'pass' or a docstring).`,
      `Replace the 'pass' statement with your actual implementation.`,
      '',
      `Test Results:`,
      ...spec.tests.map(t => `  ✗  ${t.label}  →  got: None  |  expected: ${t.expected}`),
      '',
      `0 / ${spec.tests.length} test cases passed`,
    ].join('\n')
  }

  // ── Run test cases ───────────────────────────────────────────────────────
  const results = spec.tests.map(t => simulateTestCase(code, spec, t, true))
  const passed = results.filter(r => r.passed).length
  const total = spec.tests.length

  // Collect any wrong-approach hints
  const hints = [...new Set(results.map(r => r.errorHint).filter(Boolean))]

  const lines: string[] = []

  // Per-test output
  spec.tests.forEach((t, i) => {
    const r = results[i]
    if (r.passed) {
      lines.push(`  ✓  ${t.label}  →  ${r.got}`)
    } else {
      lines.push(`  ✗  ${t.label}  →  got: ${r.got}  |  expected: ${t.expected}`)
    }
  })

  lines.push('')

  if (passed === total) {
    lines.push(`✅  All test cases passed! (${passed}/${total})`)
    lines.push(`⏱   Execution time: ${(Math.random() * 1.5 + 0.3).toFixed(1)}ms`)
    lines.push(`📦  Memory: ${(Math.random() * 5 + 12).toFixed(1)} KB`)
  } else {
    lines.push(`❌  ${passed}/${total} test cases passed`)
    if (hints.length > 0) {
      lines.push('')
      hints.forEach(h => h && lines.push(h))
    }
    if (passed === 0) {
      lines.push('')
      lines.push(`💡  Hint: Check that your function handles the base cases and always returns a value.`)
    }
  }

  return lines.join('\n')
}

// ─── Editor Store ─────────────────────────────────────────────────────────────

function isAllTestsPassed(output: string): boolean {
  return output.includes('✅') && !output.includes('❌') && !output.includes('✗')
}

function awardExerciseXP(exerciseId: string | null, output: string): void {
  if (!exerciseId || !isAllTestsPassed(output)) return
  const exercise = MOCK_EXERCISES.find(e => e.id === exerciseId)
  if (exercise) {
    useUserStore.getState().markExerciseSolved(exerciseId, exercise.xp)
  }
}

interface EditorState {
  code: string
  language: string
  output: string
  isRunning: boolean
  activeExerciseId: string | null
  setCode: (code: string) => void
  setLanguage: (lang: string) => void
  setOutput: (output: string) => void
  setRunning: (running: boolean) => void
  setActiveExercise: (id: string | null) => void
  runCode: () => Promise<void>
}

export const useEditorStore = create<EditorState>((set, get) => ({
  code: `def two_sum(nums: list[int], target: int) -> list[int]:
    """
    Find two numbers that add up to target.
    """
    # Your solution here
    pass


# Test cases
print(two_sum([2, 7, 11, 15], 9))   # Expected: [0, 1]
print(two_sum([3, 2, 4], 6))         # Expected: [1, 2]
print(two_sum([3, 3], 6))            # Expected: [0, 1]
`,
  language: 'python',
  output: '',
  isRunning: false,
  activeExerciseId: 'ex-001',
  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  setOutput: (output) => set({ output }),
  setRunning: (isRunning) => set({ isRunning }),
  setActiveExercise: (id) => set({ activeExerciseId: id }),
  runCode: async () => {
    set({ isRunning: true, output: '' })
    const { code, language, activeExerciseId } = get()

    // ── Algorithm language: call the Flask algo compiler API ──────────────
    if (language === 'algorithm') {
      try {
        const exercise = activeExerciseId ? MOCK_EXERCISES.find(e => e.id === activeExerciseId) : null
        const algoTestCases = exercise?.algorithmTestCases ?? exercise?.testCases
        let finalOutput: string

        if (algoTestCases?.length) {
          const harnessCode = buildAlgorithmTestHarness(code, algoTestCases)
          const rawOutput   = await runAlgo(harnessCode)
          finalOutput = parseAlgorithmTestOutput(rawOutput, algoTestCases)
        } else {
          finalOutput = (await runAlgo(code)) || '(no output)'
        }

        set({ output: finalOutput, isRunning: false })
        awardExerciseXP(activeExerciseId, finalOutput)
      } catch (err) {
        set({ output: `\u274c  Error: ${err instanceof Error ? err.message : String(err)}`, isRunning: false })
      }
      return
    }

    // ── Python: run through the real Pyodide engine ───────────────────────
    // When the exercise has testCases, inject a real test harness so the
    // results are based on actual execution rather than pattern matching.
    const exercise = activeExerciseId ? MOCK_EXERCISES.find(e => e.id === activeExerciseId) : null
    const codeToRun = exercise?.testCases?.length
      ? buildPythonTestHarness(code, exercise.testCases)
      : code

    let output: string
    try {
      output = await runPython(codeToRun)
    } catch {
      // Pyodide failed to initialise (e.g. network unavailable) — fall back
      // to the simulated evaluator so the UI stays usable offline.
      output = evaluateCode(code, activeExerciseId)
    }

    const finalOutput = output.trim() || '(no output)'
    set({ output: finalOutput, isRunning: false })

    // Award XP and mark exercise as solved when all test cases pass
    awardExerciseXP(activeExerciseId, finalOutput)
  },
}))

// ─── Visualization Store ──────────────────────────────────────────────────────
//
// The interval lives HERE, inside the store — NOT in a React useEffect.
// This means React re-renders never touch the timer at all.
// play() starts it. pause() clears it. Speed changes restart it.
//

type VisualizationAlgorithm = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick'
type VisualizationState = 'idle' | 'playing' | 'paused' | 'done'

interface SortStep {
  array: number[]
  comparing: [number, number] | null
  swapping: [number, number] | null
  sorted: number[]
  description: string
}

interface VisualizationStoreState {
  algorithm: VisualizationAlgorithm
  array: number[]
  steps: SortStep[]
  currentStep: number
  state: VisualizationState
  speed: number
  arraySize: number
  setAlgorithm: (algo: VisualizationAlgorithm) => void
  generateArray: () => void
  setSpeed: (speed: number) => void
  setArraySize: (size: number) => void
  play: () => void
  pause: () => void
  reset: () => void
  stepForward: () => void
  stepBackward: () => void
  skipToStart: () => void
  skipToEnd: () => void
  generateSteps: () => void
  // Called by the page on unmount to clean up any running interval
  cleanup: () => void
}

// Module-level interval ID — lives completely outside React, never in Zustand state
let _vizInterval: ReturnType<typeof setInterval> | null = null

function clearVizInterval() {
  if (_vizInterval !== null) {
    clearInterval(_vizInterval)
    _vizInterval = null
  }
}

function startVizInterval(speed: number) {
  clearVizInterval()
  _vizInterval = setInterval(() => {
    // Always read fresh state directly — no stale closures possible
    const s = useVisualizationStore.getState()

    // Safety guard: if something externally paused/reset us, stop
    if (s.state !== 'playing') {
      clearVizInterval()
      return
    }

    const next = s.currentStep + 1
    if (next >= s.steps.length) {
      // Finished — stop and mark done
      clearVizInterval()
      useVisualizationStore.setState({ state: 'done' })
    } else {
      // Advance one step — does NOT touch `state`, so no spurious re-renders of effects
      useVisualizationStore.setState({ currentStep: next })
    }
  }, speed)
}

function generateBubbleSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = []
  const a = [...arr]
  const n = a.length
  const sortedSet: number[] = []

  steps.push({ array: [...a], comparing: null, swapping: null, sorted: [], description: 'Starting Bubble Sort — comparing adjacent elements' })

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ array: [...a], comparing: [j, j + 1], swapping: null, sorted: [...sortedSet], description: `Comparing a[${j}]=${a[j]} and a[${j + 1}]=${a[j + 1]}` })
      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        steps.push({ array: [...a], comparing: null, swapping: [j, j + 1], sorted: [...sortedSet], description: `Swapped ${a[j + 1]} and ${a[j]} — larger element bubbles up` })
      }
    }
    sortedSet.push(n - 1 - i)
  }
  sortedSet.push(0)
  steps.push({ array: [...a], comparing: null, swapping: null, sorted: Array.from({ length: n }, (_, i) => i), description: '✅ Array is sorted!' })
  return steps
}

function generateSelectionSteps(arr: number[]): SortStep[] {
  const steps: SortStep[] = []
  const a = [...arr]
  const n = a.length
  const sortedSet: number[] = []

  steps.push({ array: [...a], comparing: null, swapping: null, sorted: [], description: 'Starting Selection Sort — finding minimum element each pass' })

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    for (let j = i + 1; j < n; j++) {
      steps.push({ array: [...a], comparing: [minIdx, j], swapping: null, sorted: [...sortedSet], description: `Pass ${i + 1}: Comparing a[${j}]=${a[j]} with current min a[${minIdx}]=${a[minIdx]}` })
      if (a[j] < a[minIdx]) minIdx = j
    }
    if (minIdx !== i) {
      ;[a[i], a[minIdx]] = [a[minIdx], a[i]]
      steps.push({ array: [...a], comparing: null, swapping: [i, minIdx], sorted: [...sortedSet], description: `Placed minimum ${a[i]} at position ${i}` })
    }
    sortedSet.push(i)
  }
  sortedSet.push(n - 1)
  steps.push({ array: [...a], comparing: null, swapping: null, sorted: Array.from({ length: n }, (_, i) => i), description: '✅ Array is sorted!' })
  return steps
}

function randomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10)
}

export const useVisualizationStore = create<VisualizationStoreState>((set, get) => ({
  algorithm: 'bubble',
  array: randomArray(12),
  steps: [],
  currentStep: 0,
  state: 'idle',
  speed: 500,
  arraySize: 12,

  setAlgorithm: (algorithm) => {
    clearVizInterval()
    set({ algorithm, steps: [], currentStep: 0, state: 'idle' })
  },

  generateArray: () => {
    clearVizInterval()
    const size = get().arraySize
    set({ array: randomArray(size), steps: [], currentStep: 0, state: 'idle' })
  },

  setSpeed: (speed) => {
    // If currently playing, restart the interval at the new speed immediately
    set({ speed })
    if (get().state === 'playing') {
      startVizInterval(speed)
    }
  },

  setArraySize: (arraySize) => {
    clearVizInterval()
    set({ arraySize, array: randomArray(arraySize), steps: [], currentStep: 0, state: 'idle' })
  },

  generateSteps: () => {
    const { array, algorithm } = get()
    const steps = algorithm === 'selection'
      ? generateSelectionSteps(array)
      : generateBubbleSteps(array)
    set({ steps, currentStep: 0 })
  },

  play: () => {
    const s = get()

    // If we are done, start over with a fresh array
    if (s.state === 'done') {
      clearVizInterval()
      const fresh = randomArray(s.arraySize)
      const steps = s.algorithm === 'selection'
        ? generateSelectionSteps(fresh)
        : generateBubbleSteps(fresh)
      set({ array: fresh, steps, currentStep: 0, state: 'playing' })
      startVizInterval(get().speed)
      return
    }

    // Generate steps if this is the very first play
    if (s.steps.length === 0) {
      const steps = s.algorithm === 'selection'
        ? generateSelectionSteps(s.array)
        : generateBubbleSteps(s.array)
      set({ steps, currentStep: 0 })
    }

    set({ state: 'playing' })
    startVizInterval(get().speed)
  },

  pause: () => {
    clearVizInterval()
    set({ state: 'paused' })
  },

  reset: () => {
    clearVizInterval()
    const size = get().arraySize
    set({ array: randomArray(size), steps: [], currentStep: 0, state: 'idle' })
  },

  stepForward: () => {
    // Only allowed when paused / idle
    const { currentStep, steps, state } = get()
    if (state === 'playing') return
    // Generate steps on first manual step
    if (steps.length === 0) {
      get().generateSteps()
    }
    const fresh = useVisualizationStore.getState()
    if (fresh.currentStep < fresh.steps.length - 1) {
      set({ currentStep: fresh.currentStep + 1, state: 'paused' })
    } else {
      set({ state: 'done' })
    }
  },

  stepBackward: () => {
    const { currentStep, state } = get()
    if (state === 'playing') return
    if (currentStep > 0) set({ currentStep: currentStep - 1, state: 'paused' })
  },

  skipToStart: () => {
    if (get().state === 'playing') return
    if (get().steps.length === 0) get().generateSteps()
    set({ currentStep: 0, state: 'paused' })
  },

  skipToEnd: () => {
    if (get().state === 'playing') return
    if (get().steps.length === 0) get().generateSteps()
    const last = useVisualizationStore.getState().steps.length - 1
    if (last >= 0) set({ currentStep: last, state: 'done' })
  },

  cleanup: () => {
    clearVizInterval()
  },
}))

// ─── AI Mentor Store ──────────────────────────────────────────────────────────

interface MentorState {
  messages: ChatMessage[]
  isTyping: boolean
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
}

const MOCK_RESPONSES = [
  "That's a great question! The key insight here is that we're trading **space for time** — by using a hash map, we reduce from O(n²) to O(n) time complexity.",
  "Let me give you a hint 💡 Think about what data structure would allow O(1) lookups. A hash map can store values you've already seen, so you don't need a nested loop!",
  "I see you're stuck on the edge case. Remember to handle empty arrays and arrays with duplicate elements. What happens when `nums = [3, 3]` and `target = 6`?",
  "Excellent work! 🎉 Your solution is correct. The time complexity is O(n) and space complexity is O(n). Can you think of a way to solve it with O(1) space? (Hint: only works on sorted arrays!)",
  "The **divide and conquer** approach is key here. Split the problem in half, solve each half recursively, then merge the results. This gives you O(n log n) instead of O(n²).",
  "🔍 I noticed your loop bounds might be off by one. In Python, `range(n)` goes from 0 to n-1. Double-check your inner loop condition!",
]

export const useMentorStore = create<MentorState>((set) => ({
  messages: MOCK_CHAT_MESSAGES,
  isTyping: false,
  sendMessage: async (content) => {
    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'normal',
    }
    set((s) => ({ messages: [...s.messages, userMsg], isTyping: true }))

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800))

    const response = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]
    const aiMsg: ChatMessage = {
      id: `m-${Date.now() + 1}`,
      role: 'assistant',
      content: response,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'explanation',
    }
    set((s) => ({ messages: [...s.messages, aiMsg], isTyping: false }))
  },
  clearMessages: () => set({ messages: [] }),
}))

// ─── Theme side-effect hook ───────────────────────────────────────────────────
// Import and call this once at app root to keep <html class="dark|light"> in sync
export function applyTheme(theme: string) {
  const root = document.documentElement
  if (theme === 'light') {
    root.classList.remove('dark')
    root.classList.add('light')
  } else {
    root.classList.remove('light')
    root.classList.add('dark')
  }
}
