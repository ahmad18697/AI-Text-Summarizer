import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, FileText, Share2, Shield, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden flex flex-col justify-center">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/20 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-violet-500/20 blur-[100px]"
        />
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[40vw] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 relative z-10 w-full">
        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 text-indigo-600 dark:text-indigo-400 text-sm font-semibold shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Text Intelligence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]"
          >
            Summarize Smarter. <br className="hidden sm:block" />
            <span className="text-gradient animate-gradient">Faster. Beautiful.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Turn endless walls of text, massive PDFs, and long documents into clear, concise insights in seconds. Choose your style, tone, and language effortlessly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/app" className="btn-premium px-8 py-4 rounded-xl text-base font-semibold flex items-center gap-2 w-full sm:w-auto justify-center group">
              Start Summarizing
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/history" className="px-8 py-4 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-200 glass-card hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors w-full sm:w-auto text-center border border-slate-200 dark:border-slate-700">
              View Your History
            </Link>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          <FeatureCard
            icon={<Zap />}
            title="Instant Analysis"
            desc="Process thousands of words in milliseconds with advanced AI."
            delay={0.4}
          />
          <FeatureCard
            icon={<FileText />}
            title="PDF & DOCX Support"
            desc="Upload massive files natively without worrying about formats."
            delay={0.5}
          />
          <FeatureCard
            icon={<Share2 />}
            title="Public Sharing"
            desc="Generate unique, beautiful links to share insights globally."
            delay={0.6}
          />
          <FeatureCard
            icon={<Shield />}
            title="Private & Secure"
            desc="Your data is encrypted and completely isolated per account."
            delay={0.7}
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-6 rounded-2xl group hover:-translate-y-2 transition-transform duration-300"
    >
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <div className="text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}
