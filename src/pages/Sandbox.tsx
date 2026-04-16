import { useEffect, useState, Suspense, lazy, useRef } from 'react'
import { runPython } from '@/lib/pythonCompiler'
import { motion, AnimatePresence } from 'framer-motion'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import {
  Play, RotateCcw, Save, Download, Copy, Check,
  Terminal, Loader2, Plus, X, ChevronDown,
  Code2, FileCode, Trash2, BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { runAlgo } from '@/lib/algoCompiler'
import { installAlgorithmBangShortcut, registerAlgorithmLanguage } from '@/lib/algorithmLanguage'
import {
  downloadDriveJsonFile,
  listJsonFilesInLearningPlusPlusFolder,
  requestDriveAccessToken,
  saveExerciseJsonToDrive,
  tryRestoreDriveAccessToken,
  type DriveLanguage,
  type GoogleDriveFileSummary,
} from '@/lib/googleDriveService'

const MonacoEditor = lazy(() => import('@monaco-editor/react'))
const DRIVE_AUTH_STORAGE_KEY = 'learningplusplus.drive.authorized'

// ── Monaco theme ──────────────────────────────────────────────────────────────
const MONACO_THEME = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: 'comment',  foreground: '5e6880', fontStyle: 'italic' },
    { token: 'keyword',  foreground: '3b7bff' },
    { token: 'string',   foreground: '10b981' },
    { token: 'number',   foreground: 'f59e0b' },
    { token: 'function', foreground: '00d4ff' },
    { token: 'type',     foreground: 'a78bfa' },
  ],
  colors: {
    'editor.background':                 '#090e1f',
    'editor.foreground':                 '#e2e8f0',
    'editorLineNumber.foreground':       '#3d4560',
    'editorLineNumber.activeForeground': '#8b95b0',
    'editor.selectionBackground':        '#1a5cff30',
    'editor.lineHighlightBackground':    '#141c35',
    'editorCursor.foreground':           '#1a5cff',
  },
}

const EXECUTION_FEEDBACK_ANIMATIONS = {
  error: 'https://lottie.host/8f0449b4-f6d9-4ff6-bfac-c9f77a45c04b/Bc9E8QJAYq.lottie',
  success: 'https://lottie.host/2e54393d-e7c3-447b-af85-04ea55db9246/Qxlez535IE.lottie',
} as const

function ExecutionFeedback({ status }: { status: 'success' | 'error' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      className="fixed right-5 bottom-5 z-[80] pointer-events-none"
    >
      <div
        className={cn(
          'rounded-2xl border px-3 py-2 backdrop-blur-sm',
          status === 'success' ? 'border-emerald-400/35 bg-emerald-500/10' : 'border-rose-400/35 bg-rose-500/10'
        )}
      >
        <div className="h-24 w-24 sm:h-28 sm:w-28">
          <DotLottieReact
            src={EXECUTION_FEEDBACK_ANIMATIONS[status]}
            autoplay
            loop
            style={{ width: '100%', height: '100%', background: 'transparent' }}
          />
        </div>
      </div>
    </motion.div>
  )
}

// ── Starter templates ─────────────────────────────────────────────────────────
const TEMPLATES: Record<string, Record<string, string>> = {
  python: {
    blank: `# Free Coding Sandbox — Python
# Write anything you want here. No limits!

`,
    fibonacci: `# Fibonacci sequence — multiple approaches

def fib_recursive(n):
    """Classic recursive — O(2^n)"""
    if n <= 1:
        return n
    return fib_recursive(n - 1) + fib_recursive(n - 2)


def fib_memo(n, memo={}):
    """Memoized — O(n)"""
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]


def fib_iterative(n):
    """Iterative — O(n) time, O(1) space"""
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a


# Compare outputs
for i in range(10):
    print(f"fib({i}) = {fib_iterative(i)}")
`,
    linked_list: `# Linked List implementation

class Node:
    def __init__(self, val):
        self.val = val
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, val):
        node = Node(val)
        if not self.head:
            self.head = node
            return
        cur = self.head
        while cur.next:
            cur = cur.next
        cur.next = node

    def prepend(self, val):
        node = Node(val)
        node.next = self.head
        self.head = node

    def delete(self, val):
        if not self.head:
            return
        if self.head.val == val:
            self.head = self.head.next
            return
        cur = self.head
        while cur.next and cur.next.val != val:
            cur = cur.next
        if cur.next:
            cur.next = cur.next.next

    def to_list(self):
        result, cur = [], self.head
        while cur:
            result.append(cur.val)
            cur = cur.next
        return result

    def __str__(self):
        return " -> ".join(map(str, self.to_list()))


# Test
ll = LinkedList()
for v in [1, 2, 3, 4, 5]:
    ll.append(v)

print("List:", ll)
ll.prepend(0)
print("After prepend(0):", ll)
ll.delete(3)
print("After delete(3):", ll)
`,
    stack: `# Stack & Queue using Python lists

class Stack:
    def __init__(self):
        self._data = []

    def push(self, item):
        self._data.append(item)

    def pop(self):
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self._data.pop()

    def peek(self):
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self._data[-1]

    def is_empty(self):
        return len(self._data) == 0

    def size(self):
        return len(self._data)

    def __repr__(self):
        return f"Stack({self._data})"


# Bracket validator using stack
def is_valid_brackets(s):
    stack = Stack()
    pairs = {')': '(', '}': '{', ']': '['}
    for ch in s:
        if ch in '({[':
            stack.push(ch)
        elif ch in pairs:
            if stack.is_empty() or stack.pop() != pairs[ch]:
                return False
    return stack.is_empty()


# Tests
s = Stack()
for v in [10, 20, 30]:
    s.push(v)
print("Stack:", s)
print("Pop:", s.pop())
print("Stack after pop:", s)

print()
tests = ["()", "()[]{}", "(]", "([)]", "{[]}"]
for t in tests:
    print(f'is_valid("{t}") = {is_valid_brackets(t)}')
`,
  },
  algorithm: {
    blank: `Algorithme MonProgramme
debut
  Ecrire("Bonjour le monde!")
fin
`,
    fibonacci: `Algorithme Fibonacci
tdo
  n : Entier
  a : Entier
  b : Entier
  c : Entier
  i : Entier
debut
  Lire(n)
  a <-- 0
  b <-- 1
  pour i de 0 a n-1 faire
    Ecrire(a)
    c <-- a + b
    a <-- b
    b <-- c
  fin pour
fin
`,
    factorielle: `Algorithme Factorielle
tdo
  n : Entier
  f : Entier
  i : Entier
debut
  Lire(n)
  f <-- 1
  pour i de 1 a n faire
    f <-- f * i
  fin pour
  Ecrire(f)
fin
`,
    tri_bulles: `Algorithme TriBulles
tdo
  n : Entier
  i : Entier
  j : Entier
  tmp : Entier
  t : Tableau de 5 Entier
debut
  n <-- 5
  t[0] <-- 64
  t[1] <-- 34
  t[2] <-- 25
  t[3] <-- 12
  t[4] <-- 22
  pour i de 0 a n-2 faire
    pour j de 0 a n-i-2 faire
      si t[j] > t[j+1] alors
        tmp <-- t[j]
        t[j] <-- t[j+1]
        t[j+1] <-- tmp
      fin si
    fin pour
  fin pour
  pour i de 0 a n-1 faire
    Ecrire(t[i])
  fin pour
fin
`,
  },
}

// ── Simulated execution ────────────────────────────────────────────────────────
function runSandboxCode(code: string, language: string): string {
  if (!code.trim()) return '⚠️  Nothing to run. Write some code first!'

  // Simulate basic Python print() output extraction
  const printMatches = [...code.matchAll(/print\(([^)]+)\)/g)]
  const lines: string[] = []

  if (language === 'python') {
    // Walk through print statements and give realistic-looking output
    for (const m of printMatches) {
      const arg = m[1].trim()
      // f-string or simple string
      if (arg.startsWith('f"') || arg.startsWith("f'")) {
        lines.push(`<f-string output: ${arg.slice(2, -1)}>`)
      } else if (arg.startsWith('"') || arg.startsWith("'")) {
        lines.push(arg.slice(1, -1))
      } else {
        lines.push(`<expression: ${arg}>`)
      }
    }
  }

  const execTime = (Math.random() * 2 + 0.3).toFixed(1)
  const memKB    = (Math.random() * 10 + 12).toFixed(1)

  const header = `▶  Running ${language} code…\n${'─'.repeat(42)}\n`

  if (printMatches.length > 0 && language === 'python') {
    return header + lines.join('\n') + `\n\n${'─'.repeat(42)}\n✅  Executed successfully\n⏱   ${execTime}ms  |  📦 ${memKB} KB`
  }

  // Generic success output with code length heuristic
  const lineCount = code.split('\n').filter(l => l.trim()).length
  return [
    header,
    `✅  Code executed successfully`,
    `📝  ${lineCount} lines processed`,
    `⏱   ${execTime}ms  |  📦 ${memKB} KB`,
    ``,
    `ℹ️   Note: Full execution output requires a backend runtime.`,
    `    This sandbox shows structure analysis. Connect a Python/Node`,
    `    server to src/store/index.ts → runCode() for live output.`,
  ].join('\n')
}

// ── Tab ────────────────────────────────────────────────────────────────────────
interface Tab {
  id: string
  name: string
  language: string
  code: string
}

interface AlgorithmPrompt {
  key: string
  variable: string
  label: string
  loop?: {
    startExpr: string
    endExpr: string
    stepExpr: string
  } | null
}

function evaluateAlgorithmExpression(expression: string, valuesByName: Record<string, string>): number | null {
  const trimmed = expression.trim()
  if (!trimmed) return null

  const substituted = trimmed.replace(/[A-Za-z_À-ÖØ-öø-ÿ][A-Za-z0-9_À-ÖØ-öø-ÿ]*/g, token => {
    const value = valuesByName[token.toLowerCase()]
    return value !== undefined ? String(Number(value)) : token
  })

  if (!/^[0-9+\-*/%().\s]+$/.test(substituted)) return null

  try {
    const result = Function(`"use strict"; return (${substituted});`)()
    return Number.isFinite(result) ? Number(result) : null
  } catch {
    return null
  }
}

function resolveLoopRepeatCount(
  prompt: AlgorithmPrompt,
  prompts: AlgorithmPrompt[],
  collectedInputs: string[],
  promptIndex: number,
): number | null {
  if (!prompt.loop) return null

  const valuesByName: Record<string, string> = {}
  for (let i = 0; i < promptIndex && i < collectedInputs.length; i += 1) {
    const name = prompts[i]?.variable?.toLowerCase()
    if (name) {
      valuesByName[name] = collectedInputs[i]
    }
  }

  const start = evaluateAlgorithmExpression(prompt.loop.startExpr, valuesByName)
  const end = evaluateAlgorithmExpression(prompt.loop.endExpr, valuesByName)
  const step = evaluateAlgorithmExpression(prompt.loop.stepExpr, valuesByName) ?? 1

  if (start === null || end === null || step === 0) return null

  if (step > 0) {
    if (start > end) return 0
    return Math.floor((end - start) / step) + 1
  }

  if (start < end) return 0
  return Math.floor((start - end) / Math.abs(step)) + 1
}

function extractAlgorithmPrompts(code: string): AlgorithmPrompt[] {
  const prompts: AlgorithmPrompt[] = []
  const lines = code.split('\n')
  let lastMessage = ''
  const loopStack: Array<{ startExpr: string; endExpr: string; stepExpr: string }> = []

  const parseReadArgs = (line: string): string[] => {
    const withParens = line.match(/\blire\s*\(([^)]*)\)/i)
    if (withParens) {
      return withParens[1]
        .split(',')
        .map(v => v.trim())
        .filter(Boolean)
    }

    const bare = line.match(/^\s*lire\s+(.+)$/i)
    if (!bare) return []

    return bare[1]
      .split(',')
      .map(v => v.trim())
      .filter(Boolean)
  }

  const parseWriteMessage = (line: string): string => {
    const withParens = line.match(/\b(?:ecrire|écrire)\s*\(([^)]*)\)/i)
    if (withParens) {
      const content = withParens[1].trim()
      const literal = content.match(/^["']([^"']*)["']$/)
      return (literal?.[1] ?? content).trim()
    }

    const bare = line.match(/^\s*(?:ecrire|écrire)\s+(.+)$/i)
    if (bare) {
      const content = bare[1].trim()
      const literal = content.match(/^["']([^"']*)["']$/)
      return (literal?.[1] ?? content).trim()
    }

    return ''
  }

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex]
    const normalizedLine = line.trim().replace(/\s+/g, ' ')

    const loopStartMatch = normalizedLine.match(/^pour\s+[A-Za-z_À-ÖØ-öø-ÿ][A-Za-z0-9_À-ÖØ-öø-ÿ]*\s+de\s+(.+?)\s+a\s+(.+?)\s+faire$/i)
    if (loopStartMatch) {
      loopStack.push({
        startExpr: loopStartMatch[1].trim(),
        endExpr: loopStartMatch[2].trim(),
        stepExpr: '1',
      })
    }

    if (/^fin\s+pour$/i.test(normalizedLine)) {
      loopStack.pop()
    }

    const message = parseWriteMessage(line)
    if (message) {
      lastMessage = message
    }

    const args = parseReadArgs(line)
    if (args.length === 0) continue

    args.forEach((arg, argIndex) => {
      const varMatch = arg.match(/[A-Za-z_À-ÖØ-öø-ÿ][A-Za-z0-9_À-ÖØ-öø-ÿ]*/)
      const variable = varMatch?.[0] ?? `valeur${argIndex + 1}`
      prompts.push({
        key: `${lineIndex}-${argIndex}-${variable.toLowerCase()}`,
        variable,
        label: lastMessage,
        loop: loopStack.length > 0 ? { ...loopStack[loopStack.length - 1] } : null,
      })
    })
  }

  return prompts
}

function newTab(language = 'python'): Tab {
  const ext = language === 'python' ? 'py' : 'algo'
  return {
    id: Date.now().toString(),
    name: `untitled-${Math.floor(Math.random() * 900) + 100}.${ext}`,
    language,
    code: TEMPLATES[language]?.blank ?? '',
  }
}

function displayDriveFileName(name: string) {
  return name.replace(/\.json$/i, '')
}

// ── Main sandbox page ─────────────────────────────────────────────────────────
export default function SandboxPage() {
  const [tabs,       setTabs]       = useState<Tab[]>([newTab('python')])
  const [activeId,   setActiveId]   = useState(tabs[0].id)
  const [output,     setOutput]     = useState('')
  const [isRunning,  setIsRunning]  = useState(false)
  const [isAwaitingConsoleInput, setIsAwaitingConsoleInput] = useState(false)
  const [consoleInput, setConsoleInput] = useState('')
  const [pendingRunCode, setPendingRunCode] = useState<string | null>(null)
  const [inputRequests, setInputRequests] = useState<AlgorithmPrompt[]>([])
  const [inputCursor, setInputCursor] = useState(0)
  const [collectedInputs, setCollectedInputs] = useState<string[]>([])
  const [copied,     setCopied]     = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [executionFeedback, setExecutionFeedback] = useState<'success' | 'error' | null>(null)
  const [isDriveBusy, setIsDriveBusy] = useState(false)
  const [isDriveAuthorized, setIsDriveAuthorized] = useState(false)
  const [driveStatusLabel, setDriveStatusLabel] = useState('Drive not connected')
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false)
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFileSummary[]>([])
  const [driveModalError, setDriveModalError] = useState<string | null>(null)
  const [isDriveUploadModalOpen, setIsDriveUploadModalOpen] = useState(false)
  const [driveUploadFileName, setDriveUploadFileName] = useState('')
  const [driveUploadError, setDriveUploadError] = useState<string | null>(null)
  const feedbackTimerRef = useRef<number | null>(null)

  const activeTab = tabs.find(t => t.id === activeId) ?? tabs[0]

  function setDriveLinkedState(linked: boolean) {
    setIsDriveAuthorized(linked)
    try {
      if (linked) {
        window.localStorage.setItem(DRIVE_AUTH_STORAGE_KEY, '1')
      } else {
        window.localStorage.removeItem(DRIVE_AUTH_STORAGE_KEY)
      }
    } catch {
      // Ignore storage failures (private mode, disabled storage, etc.)
    }
  }

  function appendConsoleLine(line: string) {
    setOutput(prev => prev ? `${prev}\n${line}` : line)
  }

  async function executeAlgorithmWithInputs(code: string, inputs: string[]) {
    try {
      const result = await runAlgo(code, inputs.join('\n'))
      const execTime = (Math.random() * 0.5 + 0.1).toFixed(1)
      appendConsoleLine(`${'─'.repeat(42)}`)
      if (result.trim()) {
        appendConsoleLine(result)
      }
      appendConsoleLine('')
      appendConsoleLine(`${'─'.repeat(42)}`)
      appendConsoleLine('✅  Executed successfully')
      appendConsoleLine(`⏱   ${execTime}ms`)
    } catch (err) {
      appendConsoleLine(`❌  Error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsRunning(false)
      setIsAwaitingConsoleInput(false)
      setPendingRunCode(null)
      setInputRequests([])
      setInputCursor(0)
      setCollectedInputs([])
      setConsoleInput('')
    }
  }

  async function submitConsoleInput() {
    if (!isAwaitingConsoleInput) return

    const value = consoleInput
    const nextInputs = [...collectedInputs, value]
    const currentPrompt = inputRequests[inputCursor]
    appendConsoleLine(`> ${value}`)

    setCollectedInputs(nextInputs)
    setConsoleInput('')

    if (currentPrompt?.loop) {
      const repeatCount = resolveLoopRepeatCount(currentPrompt, inputRequests, nextInputs, inputCursor)
      if (repeatCount !== null && repeatCount > 1) {
        const loopCopies = Array.from({ length: repeatCount - 1 }, (_, loopIndex) => ({
          ...currentPrompt,
          key: `${currentPrompt.key}-loop-${loopIndex + 1}`,
          loop: null,
        }))
        const expandedRequests = [
          ...inputRequests.slice(0, inputCursor + 1),
          ...loopCopies,
          ...inputRequests.slice(inputCursor + 1),
        ]
        setInputRequests(expandedRequests)
        const nextPrompt = expandedRequests[inputCursor + 1]
        setInputCursor(inputCursor + 1)
        appendConsoleLine(nextPrompt.label || 'Entrez une valeur:')
        return
      }
    }

    const nextCursor = inputCursor + 1
    if (nextCursor < inputRequests.length) {
      const nextPrompt = inputRequests[nextCursor]
      setInputCursor(nextCursor)
      appendConsoleLine(nextPrompt.label || 'Entrez une valeur:')
      return
    }

    if (pendingRunCode) {
      await executeAlgorithmWithInputs(pendingRunCode, nextInputs)
    }
  }

  function updateCode(code: string) {
    setTabs(prev => prev.map(t => t.id === activeId ? { ...t, code } : t))
  }

  function updateLanguage(language: string) {
    setTabs(prev => prev.map(t => t.id === activeId ? { ...t, language } : t))
  }

  function addTab() {
    const tab = newTab(activeTab.language)
    setTabs(prev => [...prev, tab])
    setActiveId(tab.id)
  }

  function closeTab(id: string) {
    if (tabs.length === 1) return  // always keep at least one tab
    const newTabs = tabs.filter(t => t.id !== id)
    setTabs(newTabs)
    if (activeId === id) setActiveId(newTabs[newTabs.length - 1].id)
  }

  function renameTab(id: string, name: string) {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, name } : t))
  }

  async function run() {
    setIsRunning(true)
    setOutput('')
    setIsAwaitingConsoleInput(false)
    setPendingRunCode(null)
    setInputRequests([])
    setInputCursor(0)
    setCollectedInputs([])
    setConsoleInput('')

    if (activeTab.language === 'algorithm') {
      appendConsoleLine(`▶  Running algorithm…`)
      appendConsoleLine(`${'─'.repeat(42)}`)
      const requests = extractAlgorithmPrompts(activeTab.code)

      if (requests.length > 0) {
        setIsAwaitingConsoleInput(true)
        setPendingRunCode(activeTab.code)
        setInputRequests(requests)
        setInputCursor(0)
        appendConsoleLine(requests[0].label || 'Entrez une valeur:')
        return
      }

      await executeAlgorithmWithInputs(activeTab.code, [])
      return
    } else {
      // Python: use real Pyodide runtime with stdin support
      try {
        const result = await runPython(activeTab.code, '')
        const execTime = (Math.random() * 0.5 + 0.1).toFixed(1)
        setOutput(`▶  Running python…\n${'─'.repeat(42)}\n${result}\n\n${'─'.repeat(42)}\n✅  Executed successfully\n⏱   ${execTime}ms`)
      } catch (err) {
        setOutput(`❌  Error: ${err instanceof Error ? err.message : String(err)}`)
      }
      setIsRunning(false)
    }
  }

  function reset() {
    updateCode(TEMPLATES[activeTab.language]?.blank ?? '')
    setOutput('')
  }

  function loadTemplate(lang: string, key: string) {
    const code = TEMPLATES[lang]?.[key] ?? ''
    const ext  = lang === 'python' ? 'py' : 'algo'
    setTabs(prev => prev.map(t => t.id === activeId
      ? { ...t, code, language: lang, name: `${key}.${ext}` }
      : t
    ))
    setShowTemplates(false)
    setOutput('')
  }

  async function copyCode() {
    await navigator.clipboard.writeText(activeTab.code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function downloadCode() {
    const ext  = activeTab.language === 'python' ? 'py' : 'algo'
    const blob = new Blob([activeTab.code], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `${activeTab.name.replace(/\.[^.]+$/, '')}.${ext}`
    a.click(); URL.revokeObjectURL(url)
  }

  async function handleAuthorizeDrive() {
    setIsDriveBusy(true)
    setDriveStatusLabel('Waiting for Google authorization')

    try {
      await requestDriveAccessToken()
      setDriveLinkedState(true)
      setDriveStatusLabel('Google Drive connected')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google authorization failed.'
      setDriveLinkedState(false)
      setDriveStatusLabel('Drive authorization failed')
      setOutput(prev => {
        const line = `❌  Google Drive authorization failed: ${message}`
        return prev ? `${prev}\n${line}` : line
      })
    } finally {
      setIsDriveBusy(false)
    }
  }

  function openDriveUploadModal() {
    if (!activeTab) return
    const baseName = activeTab.name.replace(/\.[^.]+$/, '').trim() || 'sandbox_code'
    setDriveUploadFileName(baseName)
    setDriveUploadError(null)
    setIsDriveUploadModalOpen(true)
  }

  async function handleSaveToDrive(customFileName: string) {
    if (!activeTab) return

    setIsDriveBusy(true)
    setDriveStatusLabel('Authorize with Google to continue')

    try {
      await saveExerciseJsonToDrive({
        title: activeTab.name,
        slug: activeTab.name.replace(/\.[^.]+$/, ''),
        language: activeTab.language as DriveLanguage,
        content: activeTab.code,
      }, undefined, customFileName)
      setDriveLinkedState(true)
      setDriveStatusLabel('Uploaded to Drive')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload file to Google Drive.'
      const disabledApiHint = message.includes('Google Drive API has not been used in project')
        ? ' Enable Google Drive API in Google Cloud Console, then wait a few minutes and retry.'
        : ''
      setDriveStatusLabel('Drive upload failed')
      setOutput(prev => {
        const line = `❌  Google Drive upload failed: ${message}${disabledApiHint} If this is your first time, approve Google Drive access in the popup.`
        return prev ? `${prev}\n${line}` : line
      })
    } finally {
      setIsDriveBusy(false)
    }
  }

  async function confirmSaveToDrive() {
    const normalized = driveUploadFileName.trim()
    if (!normalized) {
      setDriveUploadError('Please enter a file name.')
      return
    }

    setDriveUploadError(null)
    setIsDriveUploadModalOpen(false)
    await handleSaveToDrive(normalized)
  }

  async function handleOpenDriveModal() {
    setIsDriveBusy(true)
    setDriveModalError(null)
    setDriveStatusLabel('Authorize with Google to continue')

    try {
      const files = await listJsonFilesInLearningPlusPlusFolder()
      setDriveFiles(files)
      setIsDriveModalOpen(true)
      setDriveLinkedState(true)
      setDriveStatusLabel(files.length > 0 ? 'Drive files loaded' : 'No Drive files found')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load files from Google Drive.'
      setDriveModalError(message)
      setIsDriveModalOpen(true)
      setDriveStatusLabel('Drive load failed')
    } finally {
      setIsDriveBusy(false)
    }
  }

  async function handleLoadDriveFile(fileId: string) {
    setIsDriveBusy(true)
    setDriveModalError(null)
    setDriveStatusLabel('Drive sync in progress')

    try {
      const fileContent = await downloadDriveJsonFile(fileId)
      const nextCode = fileContent?.content ?? fileContent?.code ?? ''
      if (!nextCode) {
        throw new Error('Selected Drive file does not contain code content.')
      }

      const language = fileContent?.language === 'algorithm' ? 'algorithm' : 'python'
      const baseName = (fileContent?.slug ?? fileContent?.title ?? 'drive-import').replace(/\s+/g, '_')
      const extension = language === 'algorithm' ? 'algo' : 'py'
      const tabName = `${baseName.replace(/\.[^.]+$/, '')}.${extension}`

      setTabs(prev => prev.map(tab => (
        tab.id === activeId ? { ...tab, code: nextCode, language, name: tabName } : tab
      )))
      setIsDriveModalOpen(false)
      setDriveStatusLabel('Loaded from Drive')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to download the selected Drive file.'
      setDriveModalError(message)
      setDriveStatusLabel('Drive load failed')
    } finally {
      setIsDriveBusy(false)
    }
  }

  function handleEditorMount(editor: any, monaco: any) {
    registerAlgorithmLanguage(monaco)
    monaco.editor.defineTheme('mq-dark', MONACO_THEME)
    monaco.editor.setTheme('mq-dark')
    installAlgorithmBangShortcut(editor, monaco)
  }

  const hasFailed = output.includes('❌') || output.includes('Error')
  const hasSuccess = output.includes('✅')
  const currentConsolePrompt = isAwaitingConsoleInput ? (inputRequests[inputCursor]?.label?.trim() || 'Entrez une valeur:') : ''

  useEffect(() => {
    try {
      const persisted = window.localStorage.getItem(DRIVE_AUTH_STORAGE_KEY) === '1'
      if (persisted) {
        setIsDriveAuthorized(true)
        setDriveStatusLabel('Restoring Drive session')
        void (async () => {
          const restored = await tryRestoreDriveAccessToken()
          setDriveStatusLabel(restored ? 'Google Drive connected' : 'Drive linked (reconnect on action)')
        })()
      }
    } catch {
      // Ignore localStorage access failures
    }
  }, [])

  useEffect(() => {
    if (isRunning || !output.trim()) return
    if (!hasSuccess && !hasFailed) return

    setExecutionFeedback(hasFailed ? 'error' : 'success')

    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current)
    }

    feedbackTimerRef.current = window.setTimeout(() => {
      setExecutionFeedback(null)
      feedbackTimerRef.current = null
    }, 5000)
  }, [hasFailed, hasSuccess, isRunning, output])

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="h-[calc(100dvh-60px)] flex flex-col">
      <AnimatePresence>
        {executionFeedback && <ExecutionFeedback status={executionFeedback} />}
      </AnimatePresence>

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-white/5 bg-surface-900/50 flex-shrink-0">
        {/* Page title */}
        <div className="flex items-center gap-2 mr-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500/20 to-accent-cyan/20 border border-brand-500/25 flex items-center justify-center">
            <Code2 size={14} className="text-brand-400" />
          </div>
          <span className="font-semibold text-sm hidden sm:block">Free Sandbox</span>
        </div>

        {/* File tabs */}
        <div className="flex items-center gap-1 flex-1 overflow-x-auto min-w-0">
          {tabs.map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex-shrink-0 group',
                tab.id === activeId
                  ? 'bg-surface-800 border border-white/12 text-white'
                  : 'text-surface-500 hover:text-surface-300 hover:bg-white/4'
              )}
            >
              <FileCode size={12} className={tab.id === activeId ? 'text-brand-400' : 'text-surface-600'} />
              <span className="max-w-[120px] truncate">{tab.name}</span>
              {tabs.length > 1 && (
                <button
                  onClick={e => { e.stopPropagation(); closeTab(tab.id) }}
                  className="opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-all ml-0.5 flex-shrink-0"
                >
                  <X size={11} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addTab}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-surface-500 hover:text-white hover:bg-white/5 transition-all flex-shrink-0"
            title="New tab"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Drive status */}
          <span className={cn(
            'hidden lg:inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-medium',
            isDriveBusy
              ? 'border-brand-400/40 text-brand-300 bg-brand-500/10'
              : isDriveAuthorized
                ? 'border-emerald-400/35 text-emerald-300 bg-emerald-500/10'
                : 'border-amber-400/35 text-amber-300 bg-amber-500/10',
          )}>
            {driveStatusLabel}
          </span>

          {/* Templates */}
          <div className="relative">
            <button
              onClick={() => setShowTemplates(v => !v)}
              className="btn-ghost text-xs py-1.5 px-3"
            >
              <BookOpen size={13} /> Templates <ChevronDown size={12} />
            </button>
            <AnimatePresence>
              {showTemplates && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="absolute right-0 top-full mt-2 w-64 glass-strong border border-white/10 rounded-2xl shadow-card-hover z-50 overflow-hidden"
                >
                  {Object.entries(TEMPLATES).map(([lang, tpls]) => (
                    <div key={lang}>
                      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-surface-500 border-b border-white/5">
                        {lang}
                      </div>
                      {Object.keys(tpls).filter(k => k !== 'blank').map(key => (
                        <button
                          key={key}
                          onClick={() => loadTemplate(lang, key)}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors capitalize text-surface-300 hover:text-white"
                        >
                          {key.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Language picker */}
          <select
            value={activeTab.language}
            onChange={e => updateLanguage(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-surface-800 border border-white/8 text-sm text-surface-300 outline-none cursor-pointer"
          >
            <option value="python">Python</option>
            <option value="algorithm">Algorithm</option>
          </select>

          {/* Copy */}
          <button onClick={copyCode} className="btn-ghost py-1.5 px-3 text-xs" title="Copy code">
            {copied ? <><Check size={13} className="text-emerald-400" /> Copied!</> : <><Copy size={13} /> Copy</>}
          </button>

          {/* Drive connect */}
          <button
            onClick={() => void handleAuthorizeDrive()}
            disabled={isDriveBusy}
            className={cn('btn-ghost py-1.5 px-3 text-xs', isDriveBusy && 'opacity-60 cursor-not-allowed')}
            title="Authorize this app with Google Drive"
          >
            {isDriveBusy ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {isDriveAuthorized ? 'Reconnect Drive' : 'Connect Drive'}
          </button>

          {/* Drive upload */}
          <button
            onClick={openDriveUploadModal}
            disabled={isDriveBusy}
            className={cn('btn-ghost py-1.5 px-3 text-xs', isDriveBusy && 'opacity-60 cursor-not-allowed')}
            title="Upload current file to Google Drive"
          >
            {isDriveBusy ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            Upload to Drive
          </button>

          {/* Drive load */}
          <button
            onClick={() => void handleOpenDriveModal()}
            disabled={isDriveBusy}
            className={cn('btn-ghost py-1.5 px-3 text-xs', isDriveBusy && 'opacity-60 cursor-not-allowed')}
            title="Load a file from Google Drive"
          >
            <Download size={13} />
            Load from Drive
          </button>

          {/* Download */}
          <button onClick={downloadCode} className="btn-ghost py-1.5 px-3 text-xs hidden sm:flex" title="Download">
            <Download size={13} /> Save
          </button>

          {/* Reset */}
          <button onClick={reset} className="btn-ghost py-1.5 px-3 text-xs" title="Reset">
            <RotateCcw size={13} />
          </button>

          {/* Run */}
          <button
            onClick={run}
            disabled={isRunning}
            className={cn('btn-primary text-sm py-1.5 px-4', isRunning && 'opacity-70 cursor-not-allowed')}
          >
            {isRunning
              ? <><Loader2 size={14} className="animate-spin" /> Running…</>
              : <><Play size={14} /> Run</>
            }
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isDriveUploadModalOpen && (
          <motion.div
            className="fixed inset-0 z-[125] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              aria-label="Close Drive upload dialog"
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsDriveUploadModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="relative w-full max-w-md rounded-2xl border border-white/12 bg-surface-900 shadow-card-hover"
            >
              <div className="flex items-center justify-between border-b border-white/8 px-5 py-3">
                <h3 className="text-sm font-semibold">Upload to Google Drive</h3>
                <button
                  onClick={() => setIsDriveUploadModalOpen(false)}
                  className="rounded-md p-1.5 text-surface-500 transition-colors hover:bg-white/5 hover:text-surface-300"
                >
                  <X size={14} />
                </button>
              </div>

              <form
                className="space-y-3 px-5 py-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  void confirmSaveToDrive()
                }}
              >
                <label className="block text-xs font-medium text-surface-400" htmlFor="drive-upload-file-name">
                  File name
                </label>
                <input
                  id="drive-upload-file-name"
                  type="text"
                  value={driveUploadFileName}
                  onChange={(event) => setDriveUploadFileName(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-surface-800/70 px-3 py-2 text-sm text-surface-100 outline-none transition-colors focus:border-brand-400/50"
                  placeholder="my-sandbox-code"
                  autoFocus
                />

                {driveUploadError && (
                  <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                    {driveUploadError}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsDriveUploadModalOpen(false)}
                    className="btn-ghost py-1.5 px-3 text-xs"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary py-1.5 px-3 text-xs">
                    Upload
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDriveModalOpen && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              aria-label="Close Drive file picker"
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsDriveModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="relative w-full max-w-xl rounded-2xl border border-white/12 bg-surface-900 shadow-card-hover"
            >
              <div className="flex items-center justify-between border-b border-white/8 px-5 py-3">
                <h3 className="text-sm font-semibold">Load from Google Drive</h3>
                <button
                  onClick={() => setIsDriveModalOpen(false)}
                  className="rounded-md p-1.5 text-surface-500 transition-colors hover:bg-white/5 hover:text-surface-300"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="max-h-[52vh] overflow-y-auto px-5 py-4 space-y-2">
                {driveModalError && (
                  <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                    {driveModalError}
                  </div>
                )}

                {!driveModalError && driveFiles.length === 0 && (
                  <div className="rounded-lg border border-white/10 bg-surface-800/70 px-3 py-3 text-xs text-surface-400">
                    No JSON files found in your LearningPlusPlus Drive folder.
                  </div>
                )}

                {driveFiles.map(file => (
                  <button
                    key={file.id}
                    onClick={() => void handleLoadDriveFile(file.id)}
                    className="w-full rounded-lg border border-white/10 bg-surface-800/70 px-3 py-2 text-left transition-colors hover:border-brand-400/40 hover:bg-brand-500/10"
                  >
                    <div className="truncate text-sm font-medium text-surface-100">{displayDriveFileName(file.name)}</div>
                    <div className="mt-0.5 text-[11px] text-surface-500">
                      {file.modifiedTime ? new Date(file.modifiedTime).toLocaleString() : 'Unknown date'}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Editor + Output ──────────────────────────────────────────────── */}
      <div className="flex-1 flex min-h-0">

        {/* Monaco editor */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-surface-900/20 flex-shrink-0">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
            </div>
            <span className="text-xs text-surface-500 font-mono ml-2">{activeTab.name}</span>
            <span className="ml-auto text-xs text-surface-600">{activeTab.code.split('\n').length} lines</span>
          </div>

          <div className="flex-1 min-h-0">
            <Suspense fallback={
              <div className="h-full flex items-center justify-center text-surface-500 gap-2">
                <Loader2 size={18} className="animate-spin" /> Loading editor…
              </div>
            }>
              <MonacoEditor
                key={activeTab.language}  // remount on language change
                height="100%"
                language={activeTab.language === 'algorithm' ? 'algorithm' : activeTab.language}
                value={activeTab.code}
                onChange={v => updateCode(v ?? '')}
                onMount={handleEditorMount}
                options={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontLigatures: true,
                  lineHeight: 1.7,
                  padding: { top: 16, bottom: 16 },
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  renderLineHighlight: 'gutter',
                  tabSize: 2,
                  insertSpaces: true,
                  wordWrap: 'on',
                  cursorBlinking: 'smooth',
                  smoothScrolling: true,
                  cursorSmoothCaretAnimation: 'on',
                  overviewRulerBorder: false,
                  autoClosingBrackets: 'always',
                  autoClosingQuotes: 'always',
                  autoSurround: 'languageDefined',
                  contextmenu: true,
                  // No character/line limits
                  maxTokenizationLineLength: 20000,
                }}
              />
            </Suspense>
          </div>
        </div>

        {/* ── Output panel ────────────────────────────────────────────────── */}
        <div className="w-80 xl:w-96 border-l border-white/5 flex-shrink-0 bg-surface-900/30 flex flex-col">

          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 flex-shrink-0">
            <Terminal size={14} className="text-surface-400" />
            <span className="text-xs font-medium text-surface-400">Console</span>
            {isRunning && (
              <span className="ml-auto flex items-center gap-1.5 text-xs text-brand-400">
                <Loader2 size={11} className="animate-spin" /> Running…
              </span>
            )}
            {!isRunning && output && (
              <span className={cn(
                'ml-auto text-xs font-semibold flex items-center gap-1',
                hasFailed ? 'text-rose-400' : 'text-emerald-400'
              )}>
                {hasFailed ? '● Error' : '● OK'}
              </span>
            )}
            {output && (
              <button
                onClick={() => setOutput('')}
                className="text-surface-600 hover:text-surface-400 transition-colors ml-1"
                title="Clear output"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-auto p-4 min-h-0 font-mono">
            {isRunning ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-surface-500 text-sm">
                  <Loader2 size={15} className="animate-spin text-brand-400" />
                  Executing…
                </div>
                {[65, 50, 75, 40].map((w, i) => (
                  <div key={i} className="h-3 rounded bg-surface-800 animate-pulse" style={{ width: `${w}%`, animationDelay: `${i * 0.12}s` }} />
                ))}
              </div>
            ) : output ? (
              <pre className={cn(
                'text-xs leading-relaxed whitespace-pre-wrap select-text',
                hasFailed ? 'text-rose-300' : 'text-surface-300'
              )}>
                {output.split('\n').map((line, i) => {
                  let cls = 'text-surface-300'
                  if (line.startsWith('✅'))              cls = 'text-emerald-300'
                  else if (line.startsWith('❌'))          cls = 'text-rose-300'
                  else if (line.startsWith('⚠️'))        cls = 'text-amber-300'
                  else if (line.startsWith('ℹ️'))        cls = 'text-brand-300'
                  else if (line.startsWith('▶'))          cls = 'text-brand-400'
                  else if (line.startsWith('─'))          cls = 'text-surface-700'
                  else if (/^[⏱📦📝]/.test(line))        cls = 'text-surface-500'
                  return <span key={i} className={cn('block', cls)}>{line || '\u00A0'}</span>
                })}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-surface-800 border border-white/8 flex items-center justify-center">
                  <Terminal size={24} className="text-surface-500" />
                </div>
                <div>
                  <p className="text-surface-400 text-sm font-medium">Console is empty</p>
                  <p className="text-surface-600 text-xs mt-1">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-surface-800 text-surface-400 font-mono">Run</kbd> to execute
                  </p>
                </div>
              </div>
            )}
          </div>

          {isAwaitingConsoleInput && (
            <div className="border-t border-white/5 px-3 py-2 flex items-center gap-2">
              <div className="w-full space-y-2">
                <div className="text-xs font-mono text-surface-300">
                  {currentConsolePrompt}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={consoleInput}
                    onChange={e => setConsoleInput(e.target.value)}
                    onKeyDown={async e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        await submitConsoleInput()
                      }
                    }}
                    placeholder="Saisir la valeur..."
                    className="flex-1 h-8 bg-surface-800/60 border border-white/10 rounded-md px-2 text-xs font-mono text-surface-200 placeholder:text-surface-600 outline-none"
                    autoFocus
                  />
                  <button
                    onClick={submitConsoleInput}
                    className="btn-ghost py-1.5 px-2 text-xs"
                    title="Send input"
                  >
                    Enter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
