import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import { Menu as MenuIcon, X, Sun, Moon, LogOut, User as UserIcon, Zap } from 'lucide-react';
import classNames from 'classnames';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldDark = theme === 'dark' || (theme === 'system' && prefersDark);
    root.classList.toggle('dark', shouldDark);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const initials = useMemo(() => {
    const name = user?.name || user?.email || 'U';
    return name.trim()[0]?.toUpperCase?.() || 'U';
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={classNames(
        'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative',
        location.pathname === to
          ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10'
          : 'text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-white/5'
      )}
      onClick={() => setMobileOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="glass-nav border-b-0 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Logo area */}
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
                <Zap className="text-white h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                AI Summarizer
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              <NavLink to="/app">Dashboard</NavLink>
              <NavLink to="/history">History</NavLink>

              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />

              <button
                aria-label="toggle theme"
                onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors ml-1"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <Menu as="div" className="relative ml-2">
                <Menu.Button className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-sm transition-all bg-white/50 dark:bg-slate-800/50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white text-sm font-semibold shadow-sm">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                    {user?.name || user?.email || 'User'}
                  </span>
                </Menu.Button>

                <Transition
                  enter="transition duration-200 ease-out"
                  enterFrom="opacity-0 scale-95 translate-y-2"
                  enterTo="opacity-100 scale-100 translate-y-0"
                  leave="transition duration-150 ease-in"
                  leaveFrom="opacity-100 scale-100 translate-y-0"
                  leaveTo="opacity-0 scale-95 translate-y-2"
                >
                  <Menu.Items className="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 p-2 focus:outline-none">
                    <div className="px-3 py-2 mb-2 border-b border-slate-100 dark:border-slate-700/50">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {user?.name || 'Account'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => navigate('/profile')}
                          className={classNames(
                            'flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                            active ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                          )}
                        >
                          <UserIcon className="h-4 w-4" />
                          Profile
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={classNames(
                            'flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors mt-1',
                            active ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' : 'text-rose-600 dark:text-rose-400'
                          )}
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800"
          >
            <div className="px-4 pt-2 pb-6 flex flex-col gap-2">
              <NavLink to="/app">Dashboard</NavLink>
              <NavLink to="/history">History</NavLink>
              <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
              <button
                onClick={() => { setMobileOpen(false); navigate('/profile'); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <UserIcon className="h-5 w-5" />
                Profile
              </button>
              <button
                onClick={() => { setMobileOpen(false); handleLogout(); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors text-left"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
