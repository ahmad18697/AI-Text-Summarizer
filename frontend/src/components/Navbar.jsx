import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
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
        'px-3 py-2 rounded-lg text-sm font-medium link-glow',
        location.pathname === to
          ? 'text-black'
          : 'text-black/70'
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
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-40"
    >
      <div className="w-full border-b border-black/5 dark:border-white/10 backdrop-blur-md glass bg-white/60 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-lg" />
            <Link to="/" className="font-bold text-lg link-glow text-black">AI Summarizer</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/history">History</NavLink>
            <button
              aria-label="toggle theme"
              onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
              className="p-2 rounded-lg glass hover:shadow-lg"
            >
              <SunIcon className="h-5 w-5 hidden dark:block" />
              <MoonIcon className="h-5 w-5 dark:hidden" />
            </button>

            <Menu as="div" className="relative ml-2">
              <Menu.Button className="flex items-center gap-2 pl-2 pr-3 py-1.5 glass">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-semibold">
                  {initials}
                </div>
                <span className="text-sm text-black hidden sm:block">{user?.name || user?.email || 'User'}</span>
              </Menu.Button>
              <Transition
                enter="transition duration-150"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right rounded-xl glass p-1 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => navigate('/profile')}
                        className={classNames('w-full text-left px-3 py-2 rounded-lg text-sm', active && 'bg-white/10')}
                      >
                        Profile
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={classNames('w-full text-left px-3 py-2 rounded-lg text-sm text-rose-300', active && 'bg-white/10')}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <button
              aria-label="toggle theme"
              onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
              className="p-2 rounded-lg glass"
            >
              <SunIcon className="h-5 w-5 hidden dark:block" />
              <MoonIcon className="h-5 w-5 dark:hidden" />
            </button>
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="p-2 rounded-lg glass"
              aria-label="toggle menu"
            >
              {mobileOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="glass p-2 mt-2 mx-1 flex flex-col gap-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/history">History</NavLink>
            <button
              onClick={() => { setMobileOpen(false); navigate('/profile'); }}
              className="px-3 py-2 rounded-lg text-sm text-black text-left"
            >
              Profile
            </button>
            <button
              onClick={() => { setMobileOpen(false); handleLogout(); }}
              className="px-3 py-2 rounded-lg text-sm text-rose-300 text-left"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </motion.nav>
  );
}
