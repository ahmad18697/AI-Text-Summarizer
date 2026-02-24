import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Trash2, Share2, ChevronDown, ChevronUp, Star,
  AlertTriangle, X, Clock, FileText, Languages, ChevronLeft, ChevronRight, Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/axios';

const STYLES = ['All', 'Short', 'Detailed', 'Bullet Points', 'Formal', 'Casual'];
const LANGUAGES = ['All', 'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
const ITEMS_PER_PAGE = 5;

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  if (diffInSeconds < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  if (diffInSeconds < 2592000) return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  if (diffInSeconds < 31536000) return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
};

export default function History() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [styleFilter, setStyleFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Favorites'
  const [currentPage, setCurrentPage] = useState(1);

  // UI State
  const [expandedId, setExpandedId] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/history`);
      setSummaries(res.data);
    } catch (error) {
      toast.error('Failed to load history.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (e, id) => {
    e.stopPropagation(); // prevent accordion toggle
    try {
      const res = await api.patch(`/api/history/${id}/favorite`);
      setSummaries(prev => prev.map(s => s._id === id ? { ...s, isFavorite: res.data.isFavorite } : s));
      toast.success(res.data.isFavorite ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      toast.error('Failed to update favorite status');
    }
  };

  const handleDelete = async () => {
    if (!deleteModalId) return;
    try {
      await api.delete(`/api/history/${deleteModalId}`);
      setSummaries(prev => prev.filter(item => item._id !== deleteModalId));
      toast.success('Summary deleted successfully');

      // Adjust pagination if deleted last item on page
      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage(p => p - 1);
      }
    } catch (error) {
      toast.error('Failed to delete summary');
    } finally {
      setDeleteModalId(null);
    }
  };

  const handleShare = (e, shareId) => {
    e.stopPropagation();
    if (!shareId) return;
    const url = `${window.location.origin}/shared/${shareId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Share link copied!');
    });
  };

  const copyText = (e, text) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Text copied!');
    });
  };

  // Filtering Logic
  const filteredSummaries = useMemo(() => {
    let result = [...summaries];

    // Status Tab
    if (activeTab === 'Favorites') {
      result = result.filter(s => s.isFavorite);
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        (s.text && s.text.toLowerCase().includes(q)) ||
        (s.summary && s.summary.toLowerCase().includes(q))
      );
    }

    // Dropdowns
    if (styleFilter !== 'All') {
      result = result.filter(s => s.style === styleFilter);
    }
    if (languageFilter !== 'All') {
      result = result.filter(s => s.language === languageFilter);
    }

    // Sort: Favorites first, then newest
    return result.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [summaries, searchQuery, styleFilter, languageFilter, activeTab]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredSummaries.length / ITEMS_PER_PAGE) || 1;
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSummaries.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSummaries, currentPage]);

  useEffect(() => {
    // Reset to page 1 if filters change and current page is now invalid
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Summary Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage, search, and review all your generated insights.</p>
        </div>
        <button
          onClick={() => navigate('/app')}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold btn-premium shadow-lg shadow-indigo-500/20"
        >
          + New Summary
        </button>
      </div>

      {/* Control Bar */}
      <div className="glass-card rounded-2xl p-4 mb-6 sticky top-20 z-30">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">

          {/* Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full lg:w-auto">
            {['All', 'Favorites'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 lg:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
              >
                {tab === 'Favorites' && <Star className="inline w-4 h-4 mr-1 pb-0.5" />}
                {tab}
              </button>
            ))}
          </div>

          {/* Filters array */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto overflow-hidden">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search text or summary..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={styleFilter}
                onChange={e => setStyleFilter(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <select
                value={languageFilter}
                onChange={e => setLanguageFilter(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4 min-h-[400px]">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 h-32 animate-pulse flex flex-col justify-between">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-1/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-1/2"></div>
            </div>
          ))
        ) : currentItems.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Records Found</h3>
            <p className="text-slate-500 max-w-sm mb-6">
              {summaries.length === 0
                ? "You haven't generated any summaries yet. Go back to the dashboard to start."
                : "No summaries match your current filters. Try changing your search query or dropdowns."}
            </p>
            {summaries.length > 0 && (
              <button
                onClick={() => { setSearchQuery(''); setStyleFilter('All'); setLanguageFilter('All'); setActiveTab('All'); }}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {currentItems.map((item) => {
              const isExpanded = expandedId === item._id;

              return (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`glass-card rounded-2xl overflow-hidden border-2 transition-colors ${isExpanded ? 'border-indigo-500/30 dark:border-indigo-400/30' : 'border-transparent'
                    }`}
                >
                  {/* Collapsible Header */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : item._id)}
                    className="p-5 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-2">
                        {item.isFavorite && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{formatRelativeTime(item.createdAt)}</span>
                        <div className="flex gap-1 ml-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{item.style || 'Short'}</span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{item.language || 'English'}</span>
                        </div>
                      </div>
                      <p className="text-slate-900 dark:text-white font-medium truncate text-base">
                        {item.summary ? item.summary.split('\n')[0] : "Summary..."}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={(e) => handleToggleFavorite(e, item._id)} className="p-2 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors" title={item.isFavorite ? "Unfavorite" : "Favorite"}>
                        <Star className={`w-5 h-5 ${item.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                      {item.shareId && (
                        <button onClick={(e) => handleShare(e, item.shareId)} className="p-2 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors" title="Copy Share Link">
                          <Share2 className="w-5 h-5" />
                        </button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); setDeleteModalId(item._id); }} className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors" title="Delete">
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                      <div className="p-2 text-slate-400">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
                      >
                        <div className="p-5 md:p-6 bg-slate-50/50 dark:bg-slate-900/50 grid grid-cols-1 md:grid-cols-2 gap-6">

                          {/* Left: Original Text */}
                          <div className="flex flex-col h-[300px]">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <FileText className="w-4 h-4 text-slate-400" /> Original Text
                              </h4>
                              <button onClick={(e) => copyText(e, item.text)} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
                            </div>
                            <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 overflow-y-auto custom-scrollbar">
                              <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">{item.text}</p>
                            </div>
                          </div>

                          {/* Right: Summary */}
                          <div className="flex flex-col h-[300px]">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Languages className="w-4 h-4 text-indigo-500" /> Generated Summary
                              </h4>
                              <button onClick={(e) => copyText(e, item.summary)} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
                            </div>
                            <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-4 border border-indigo-100 dark:border-indigo-500/20 overflow-y-auto custom-scrollbar relative shadow-inner">
                              <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">{item.summary}</p>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Pagination Footer */}
      {!loading && filteredSummaries.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 px-2">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-slate-700 dark:text-slate-300">{Math.min(currentPage * ITEMS_PER_PAGE, filteredSummaries.length)}</span> of <span className="font-semibold text-slate-700 dark:text-slate-300">{filteredSummaries.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg glass-card text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${currentPage === i + 1
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'glass-card text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg glass-card text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Layer */}
      <AnimatePresence>
        {deleteModalId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModalId(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl z-50 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <button onClick={() => setDeleteModalId(null)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Summary?</h3>
              <p className="text-slate-500 mb-6 text-sm">
                This action cannot be undone. This summary will be permanently removed from your history.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModalId(null)}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-500/30 transition-all"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
