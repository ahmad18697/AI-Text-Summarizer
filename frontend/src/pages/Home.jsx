import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-80 w-[36rem] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24">
        {/* Heading */}
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-400 bg-clip-text text-transparent drop-shadow-sm"
          >
            Summarize Smarter.
            <br className="hidden sm:block" /> Faster. Beautiful.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-4 max-w-2xl text-lg sm:text-xl text-black/70"
          >
            Turn walls of text into clear, concise insights. Choose your style and tone, then save, share, or listen—
            all in one elegant dashboard.
          </motion.p>
          <div className="mt-6 flex gap-3">
            <Link to="/app" className="btn-primary">
              Get Started
            </Link>
            <Link to="/history" className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold text-black glass">
              View History
            </Link>
          </div>
        </div>

        {/* Center Device Mock */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="order-2 lg:order-1 lg:col-span-6">
            <FeatureList />
          </div>
          <div className="order-1 lg:order-2 lg:col-span-6">
            <DeviceMock />
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureList() {
  const items = [
    { title: 'Brief, Detailed, Bulleted, Creative', emoji: '✨' },
    { title: 'Tone: Professional, Friendly, Academic, News', emoji: '🎯' },
    { title: 'Copy, Download, Text‑to‑Speech', emoji: '🎧' },
    { title: 'History & Shareable Links', emoji: '🔗' },
  ]
  return (
    <ul className="space-y-3">
      {items.map((it, idx) => (
        <motion.li
          key={idx}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.35, delay: idx * 0.05 }}
          className="glass px-4 py-3 flex items-center gap-3"
        >
          <span className="text-xl">{it.emoji}</span>
          <span className="text-sm sm:text-base text-black">{it.title}</span>
        </motion.li>
      ))}
    </ul>
  )
}

function DeviceMock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45 }}
      className="relative mx-auto w-full max-w-md"
    >
      <div className="rounded-[2.2rem] border border-black/10 dark:border-white/10 shadow-glow bg-white/80 dark:bg-slate-900/60 backdrop-blur-md overflow-hidden">
        <div className="h-10 bg-gradient-to-r from-indigo-600 to-violet-600" />
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-full bg-indigo-500 text-white grid place-items-center text-sm font-semibold">A</div>
            <div className="text-sm text-black">AI Summarizer</div>
          </div>
          <div className="space-y-2">
            <Bubble side="left" text="Paste your text and choose a mode." />
            <Bubble side="right" text="Mode: Brief • Tone: Professional" accent />
            <Bubble side="left" text="Generating summary…" typing />
          </div>
        </div>
      </div>
      {/* Floating avatars */}
      <motion.div className="absolute -left-10 -top-6" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 6 }}>
        <Avatar color="bg-amber-400" label="😊" />
      </motion.div>
      <motion.div className="absolute -right-10 top-10" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 7 }}>
        <Avatar color="bg-rose-400" label="🎤" />
      </motion.div>
      <motion.div className="absolute left-1/2 -bottom-6 -translate-x-1/2" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 5.5 }}>
        <Avatar color="bg-emerald-400" label="👍" />
      </motion.div>
    </motion.div>
  )
}

function Bubble({ side = 'left', text, accent, typing }) {
  return (
    <div className={`max-w-[85%] ${side === 'right' ? 'ml-auto' : ''}`}>
      <div className={`px-3 py-2 rounded-2xl text-sm shadow-lg ${
        accent
          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white'
          : 'glass text-black'
      }`}>
        {typing ? (
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" />
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:240ms]" />
          </span>
        ) : (
          text
        )}
      </div>
    </div>
  )
}

function Avatar({ color = 'bg-indigo-400', label = '🙂' }) {
  return (
    <div className={`h-12 w-12 rounded-full grid place-items-center shadow-glow ${color} text-white text-lg`}>
      {label}
    </div>
  )
}
