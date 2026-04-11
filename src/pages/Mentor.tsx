import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Send, Trash2, Lightbulb, Bug, BookOpen,
  Sparkles, ChevronDown, Loader2, Bot, User, Zap
} from 'lucide-react'
import { useMentorStore } from '@/store'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/data/mockData'
import { useTranslation } from 'react-i18next'

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500/20 to-accent-cyan/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
        <Bot size={15} className="text-brand-400" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm glass border border-white/8">
        <div className="flex items-center gap-1.5 h-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-brand-400"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  const typeStyle: Record<string, string> = {
    error: 'border-rose-500/25 bg-rose-500/5',
    hint: 'border-amber-500/25 bg-amber-500/5',
    explanation: 'border-brand-500/20 bg-brand-500/5',
    normal: '',
  }

  const typeIcon: Record<string, React.ReactNode> = {
    error: <Bug size={12} className="text-rose-400" />,
    hint: <Lightbulb size={12} className="text-amber-400" />,
    explanation: <Sparkles size={12} className="text-brand-400" />,
  }

  // Simple markdown-like bold rendering
  function renderContent(text: string) {
    const parts = text.split(/\*\*(.*?)\*\*/g)
    return parts.map((part, i) =>
      i % 2 === 1
        ? <strong key={i} className="font-semibold text-white">{part}</strong>
        : <span key={i}>{part}</span>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn('flex items-end gap-3', isUser && 'flex-row-reverse')}
    >
      {/* Avatar */}
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold',
        isUser
          ? 'bg-gradient-to-br from-brand-500 to-accent-cyan'
          : 'bg-gradient-to-br from-brand-500/20 to-accent-cyan/20 border border-brand-500/30'
      )}>
        {isUser ? <User size={15} className="text-white" /> : <Bot size={15} className="text-brand-400" />}
      </div>

      <div className={cn('flex flex-col gap-1 max-w-[80%]', isUser && 'items-end')}>
        {/* Type badge */}
        {!isUser && message.type && message.type !== 'normal' && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-800 border border-white/8 w-fit">
            {typeIcon[message.type]}
            <span className="text-xs text-surface-400 capitalize">{message.type}</span>
          </div>
        )}

        {/* Bubble */}
        <div className={cn(
          'px-4 py-3 rounded-2xl text-sm leading-relaxed',
          isUser
            ? 'bg-brand-500/20 border border-brand-500/30 text-white rounded-br-sm'
            : cn(
                'glass border border-white/8 text-surface-300 rounded-bl-sm',
                message.type && typeStyle[message.type]
              )
        )}>
          {renderContent(message.content)}
        </div>

        <span className="text-xs text-surface-600 px-1">{message.timestamp}</span>
      </div>
    </motion.div>
  )
}

export default function MentorPage() {
  const { messages, isTyping, sendMessage, clearMessages } = useMentorStore()
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const QUICK_PROMPTS = [
    { icon: Bug, label: t('mentor.quickPrompts.debugLabel'), text: t('mentor.quickPrompts.debugText') },
    { icon: Lightbulb, label: t('mentor.quickPrompts.hintLabel'), text: t('mentor.quickPrompts.hintText') },
    { icon: BookOpen, label: t('mentor.quickPrompts.explainLabel'), text: t('mentor.quickPrompts.explainText') },
    { icon: Zap, label: t('mentor.quickPrompts.optimizeLabel'), text: t('mentor.quickPrompts.optimizeText') },
  ]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  async function handleSend() {
    const text = input.trim()
    if (!text || isTyping) return
    setInput('')
    await sendMessage(text)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="max-w-[1120px] mx-auto h-[calc(100vh-120px)] flex flex-col">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 flex-shrink-0"
        >
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-cyan/20 border border-brand-500/30 flex items-center justify-center">
                <Brain size={20} className="text-brand-400" />
              </div>
              {t('mentor.titlePart1')}<span className="gradient-text">{t('mentor.titlePart2')}</span>
            </h1>
            <p className="text-surface-400 mt-2 ml-14">{t('mentor.subtitle')}</p>
          </div>
          <button
            onClick={clearMessages}
            className="btn-ghost text-xs py-2"
          >
            <Trash2 size={13} />
            {t('mentor.clearChat')}
          </button>
        </motion.div>

        <div className="flex flex-1 gap-6 min-h-0">

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="hidden lg:flex flex-col gap-4 w-64 xl:w-72 flex-shrink-0"
          >
            {/* Quick prompts */}
            <div className="p-4 rounded-2xl glass border border-white/8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-3">{t('mentor.quickPromptsTitle')}</h3>
              <div className="space-y-2">
                {QUICK_PROMPTS.map(({ icon: Icon, label, text }) => (
                  <button
                    key={label}
                    onClick={() => { setInput(text); inputRef.current?.focus() }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-surface-400 hover:text-white hover:bg-white/5 transition-all text-left group"
                  >
                    <Icon size={15} className="flex-shrink-0 group-hover:text-brand-400 transition-colors" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Capabilities */}
            <div className="p-4 rounded-2xl glass border border-white/8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-3">{t('mentor.whatICanHelpTitle')}</h3>
              <div className="space-y-3 text-sm text-surface-400">
                {[
                  t('mentor.capabilities.debug'),
                  t('mentor.capabilities.hint'),
                  t('mentor.capabilities.explain'),
                  t('mentor.capabilities.optimize'),
                  t('mentor.capabilities.strategy'),
                  t('mentor.capabilities.examples'),
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-xs leading-relaxed">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="p-4 rounded-2xl bg-brand-500/8 border border-brand-500/20">
              <div className="flex items-center gap-2 text-brand-400 text-xs font-semibold mb-2">
                <Sparkles size={13} />
                {t('mentor.proTip')}
              </div>
              <p className="text-xs text-surface-400 leading-relaxed">
                {t('mentor.proTipDesc')}
              </p>
            </div>
          </motion.div>

          {/* Chat area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex-1 flex flex-col min-w-0 rounded-2xl glass border border-white/8 overflow-hidden"
          >
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5 flex-shrink-0">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center">
                  <Brain size={17} className="text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-surface-900" />
              </div>
              <div>
                <div className="font-semibold text-sm">{t('mentor.chatTitle')}</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t('mentor.online')}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-xs text-surface-500">
                <ChevronDown size={14} />
                {t('mentor.messagesCount', { count: messages.length })}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              <AnimatePresence>
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                {isTyping && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <TypingIndicator />
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div className="flex-shrink-0 border-t border-white/5 p-4">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value)
                      e.target.style.height = 'auto'
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={t('mentor.placeholder')}
                    className="input-field resize-none leading-relaxed py-3 min-h-[44px] max-h-[120px] overflow-y-auto"
                    style={{ height: '44px' }}
                  />
                </div>
                <motion.button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all',
                    input.trim() && !isTyping
                      ? 'bg-gradient-to-br from-brand-500 to-brand-600 shadow-glow-blue'
                      : 'bg-surface-800 border border-white/8 cursor-not-allowed'
                  )}
                >
                  {isTyping
                    ? <Loader2 size={16} className="text-surface-400 animate-spin" />
                    : <Send size={16} className={input.trim() ? 'text-white' : 'text-surface-600'} />
                  }
                </motion.button>
              </div>
              <p className="text-xs text-surface-600 mt-2 text-center">
                {t('mentor.pressEnterHint')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
