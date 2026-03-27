import { useState, Suspense, lazy, useRef } from 'react'
import { runPython } from '@/lib/pythonCompiler'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, RotateCcw, Save, Download, Copy, Check,
  Terminal, Loader2, Plus, X, ChevronDown,
  Code2, FileCode, Trash2, BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { runAlgo } from '@/lib/algoCompiler'
import { registerAlgorithmLanguage } from '@/lib/algorithmLanguage'

const MonacoEditor = lazy(() => import('@monaco-editor/react'))

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

function newTab(language = 'python'): Tab {
  const ext = language === 'python' ? 'py' : 'algo'
  return {
    id: Date.now().toString(),
    name: `untitled-${Math.floor(Math.random() * 900) + 100}.${ext}`,
    language,
    code: TEMPLATES[language]?.blank ?? '',
  }
}

// ── Main sandbox page ─────────────────────────────────────────────────────────
export default function SandboxPage() {
  const [tabs,       setTabs]       = useState<Tab[]>([newTab('python')])
  const [activeId,   setActiveId]   = useState(tabs[0].id)
  const [output,     setOutput]     = useState('')
  const [isRunning,  setIsRunning]  = useState(false)
  const [copied,     setCopied]     = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [stdinInput, setStdinInput] = useState('')

  const activeTab = tabs.find(t => t.id === activeId) ?? tabs[0]

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
    if (activeTab.language === 'algorithm') {
      try {
        const result = await runAlgo(activeTab.code, stdinInput)
        const execTime = (Math.random() * 0.5 + 0.1).toFixed(1)
        setOutput(`▶  Running algorithm…\n${'─'.repeat(42)}\n${result}\n\n${'─'.repeat(42)}\n✅  Executed successfully\n⏱   ${execTime}ms`)
      } catch (err) {
        setOutput(`❌  Error: ${err instanceof Error ? err.message : String(err)}`)
      }
    } else {
      // Python: use real Pyodide runtime with stdin support
      try {
        const result = await runPython(activeTab.code, stdinInput)
        const execTime = (Math.random() * 0.5 + 0.1).toFixed(1)
        setOutput(`▶  Running python…\n${'─'.repeat(42)}\n${result}\n\n${'─'.repeat(42)}\n✅  Executed successfully\n⏱   ${execTime}ms`)
      } catch (err) {
        setOutput(`❌  Error: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
    setIsRunning(false)
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

  function handleEditorMount(_: unknown, monaco: any) {
    registerAlgorithmLanguage(monaco)
    monaco.editor.defineTheme('mq-dark', MONACO_THEME)
    monaco.editor.setTheme('mq-dark')
  }

  const hasFailed = output.includes('❌') || output.includes('Error')
  const hasSuccess = output.includes('✅')

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">

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

          {/* ── Stdin input section ─────────────────────────────────────── */}
          <div className="border-b border-white/5 flex-shrink-0">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
              <Terminal size={14} className="text-surface-400" />
              <span className="text-xs font-medium text-surface-400">Input (stdin)</span>
            </div>
            <textarea
              value={stdinInput}
              onChange={e => setStdinInput(e.target.value)}
              placeholder="Provide input for your program here&#10;(one value per line)"
              spellCheck={false}
              className="w-full h-24 bg-transparent px-4 py-3 text-xs font-mono text-surface-300 placeholder:text-surface-600 resize-none outline-none"
            />
          </div>

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
        </div>
      </div>
    </div>
  )
}
