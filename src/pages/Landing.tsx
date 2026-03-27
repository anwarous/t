import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Zap, Brain, Trophy, GitBranch, Code2, Play,
  CheckCircle, Star, BarChart2, Lock, Sparkles
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const FEATURES = [
  {
    icon: GitBranch,
    color: '#1a5cff',
    glow: 'rgba(26,92,255,0.3)',
    title: 'Step-by-Step Visualization',
    desc: 'Watch algorithms execute in real time. Pause, rewind, and inspect every swap, comparison, and pivot.',
  },
  {
    icon: Brain,
    color: '#00d4ff',
    glow: 'rgba(0,212,255,0.3)',
    title: 'AI Mentor',
    desc: 'Get instant explanations, debug hints, and personalized guidance from an AI that understands your code.',
  },
  {
    icon: Trophy,
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.3)',
    title: 'Gamified Learning',
    desc: 'Earn XP, unlock badges, maintain streaks, and climb the leaderboard as you master each algorithm.',
  },
  {
    icon: Code2,
    color: '#10b981',
    glow: 'rgba(16,185,129,0.3)',
    title: 'Interactive Code Editor',
    desc: 'Write and run Python directly in the browser. Instant feedback with test cases and performance metrics.',
  },
]

const STATS = [
  { value: '50+', label: 'Algorithms' },
  { value: '200+', label: 'Practice Problems' },
  { value: '12k+', label: 'Students' },
  { value: '4.9★', label: 'Rating' },
]

const ALGORITHMS = [
  'Bubble Sort', 'Quick Sort', 'Merge Sort', 'Binary Search',
  'BFS', 'DFS', 'Dijkstra', 'Dynamic Programming',
  'Heap Sort', 'A* Search', 'Kruskal', 'Floyd-Warshall',
]

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-4">

        {/* Hero glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(26,92,255,0.12) 0%, transparent 70%)' }} />
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-sm font-medium mb-8">
            <Sparkles size={14} className="text-accent-cyan" />
            AI-Powered Algorithm Learning Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-5xl sm:text-6xl md:text-7xl font-display font-bold leading-[1.08] tracking-tight mb-6 text-balance"
          >
            Master Algorithms.{' '}
            <span className="gradient-text">See Them Move.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The interactive platform where you write code, visualize execution step-by-step,
            and get AI guidance — all in one place. From bubble sort to dynamic programming.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard" className="btn-primary text-base px-7 py-3.5 rounded-2xl">
              Start Learning Free
              <ArrowRight size={18} />
            </Link>
            <Link to="/visualize" className="btn-ghost text-base px-7 py-3.5 rounded-2xl">
              <Play size={16} />
              See Visualizer
            </Link>
          </motion.div>

          {/* Trust line */}
          <motion.div variants={fadeUp} custom={4} className="mt-10 flex items-center justify-center gap-6 text-sm text-surface-500">
            {['No credit card', 'Python & more', 'Free forever'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle size={13} className="text-accent-green" />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating algorithm tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="relative mt-20 w-full max-w-4xl mx-auto"
        >
          <div className="flex flex-wrap justify-center gap-2.5">
            {ALGORITHMS.map((algo, i) => (
              <motion.div
                key={algo}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.05, duration: 0.3 }}
                className="px-4 py-2 rounded-full glass border border-white/8 text-sm text-surface-300 font-medium hover:border-brand-500/40 hover:text-white transition-all cursor-default"
              >
                {algo}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Stats ──────────────────────────────────── */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-display font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-surface-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Everything you need to <span className="gradient-text">actually learn</span>
            </h2>
            <p className="text-surface-400 text-lg max-w-xl mx-auto">
              Not just theory — hands-on practice with tools that make abstract concepts concrete.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="relative p-7 rounded-2xl glass border border-white/8 overflow-hidden group"
              >
                {/* Background glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 30% 40%, ${f.glow} 0%, transparent 60%)` }}
                />
                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: `${f.color}20`, border: `1px solid ${f.color}30` }}
                  >
                    <f.icon size={22} style={{ color: f.color }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-surface-400 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Learning Path Preview ──────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              A structured path to <span className="gradient-text">mastery</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                step: '01', color: '#10b981', title: 'Foundations',
                items: ['Arrays & Strings', 'Linked Lists', 'Stacks & Queues', 'Hash Tables'],
              },
              {
                step: '02', color: '#1a5cff', title: 'Core Algorithms',
                items: ['Sorting Algorithms', 'Binary Search', 'Recursion', 'Graph Traversal'],
              },
              {
                step: '03', color: '#7c3aed', title: 'Advanced Topics',
                items: ['Dynamic Programming', 'Greedy Algorithms', 'Backtracking', 'Advanced Graphs'],
              },
            ].map((path, i) => (
              <motion.div
                key={path.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative p-7 rounded-2xl glass border border-white/8"
              >
                <div className="text-6xl font-display font-bold mb-4 opacity-10" style={{ color: path.color }}>
                  {path.step}
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: path.color }}>{path.title}</h3>
                <ul className="space-y-2.5">
                  {path.items.map((item, j) => (
                    <li key={item} className="flex items-center gap-2.5 text-surface-300 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: path.color }} />
                      {item}
                      {j > 2 && <Lock size={12} className="text-surface-600 ml-auto" />}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Proof ───────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                quote: "The visualizer completely changed how I understand recursion. I went from confused to confident in a week.",
                name: 'Priya M.', role: 'CS Student', stars: 5,
              },
              {
                quote: "The AI mentor caught a subtle bug in my merge sort that I'd been staring at for hours. Game changer.",
                name: 'Marcus J.', role: 'Software Engineer', stars: 5,
              },
              {
                quote: "Gamification keeps me coming back daily. 21-day streak and I've solved more problems than the entire last year.",
                name: 'Sarah K.', role: 'Bootcamp Graduate', stars: 5,
              },
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl glass border border-white/8"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: review.stars }).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-surface-300 text-sm leading-relaxed mb-5">"{review.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-300">
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{review.name}</div>
                    <div className="text-xs text-surface-500">{review.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────── */}
      <section className="py-28 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-12 rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(26,92,255,0.15) 0%, rgba(0,212,255,0.08) 100%)',
              border: '1px solid rgba(26,92,255,0.3)',
            }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 0%, rgba(26,92,255,0.2) 0%, transparent 60%)' }} />
            <div className="relative">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center shadow-glow-blue">
                  <BarChart2 size={32} className="text-white" />
                </div>
              </div>
              <h2 className="text-4xl font-display font-bold mb-4">Ready to level up?</h2>
              <p className="text-surface-400 text-lg mb-8">Join 12,000+ students who are mastering algorithms with MQAcademy.</p>
              <Link to="/dashboard" className="btn-primary text-base px-8 py-4 rounded-2xl">
                Start for Free — No signup needed
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center text-xs font-bold">MQ</div>
            <span className="font-display font-bold text-sm">MQAcademy</span>
          </div>
          <p className="text-surface-500 text-sm">© 2025 MQAcademy. Built for learners, by learners.</p>
          <div className="flex gap-6 text-sm text-surface-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
