import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText, Languages, RefreshCw, UploadCloud, Link as LinkIcon, Download,
  Copy, Type, File as FileIcon, Clock, CheckCircle2, ChevronDown, Sparkles
} from 'lucide-react'
import jsPDF from 'jspdf'
import toast from 'react-hot-toast'
import api from '../api/axios'

const STYLES = ['Short', 'Detailed', 'Bullet Points', 'Formal', 'Casual'];
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];

export default function Summarizer() {
  const [text, setText] = useState('')
  const [summaryData, setSummaryData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [style, setStyle] = useState('Short')
  const [language, setLanguage] = useState('English')
  const navigate = useNavigate()

  // Real-time Text Metrics
  const metrics = useMemo(() => {
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const charCount = text.length;
    const readTime = Math.ceil(wordCount / 200) || 1;
    return { wordCount, charCount, readTime };
  }, [text]);

  const handleSummarize = async () => {
    if (!text.trim() && !selectedFile) {
      toast.error('Please enter text or upload a file.');
      return;
    }
    setLoading(true)

    const formData = new FormData();
    if (text.trim()) formData.append('text', text);
    if (selectedFile) formData.append('file', selectedFile);
    formData.append('style', style);
    formData.append('language', language);

    try {
      const res = await api.post(`/api/summary`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setSummaryData(res.data.summary)
      toast.success('Summary generated successfully!');
    } catch (error) {
      const msg = error?.response?.data?.error || error?.message || 'Failed to generate summary'
      const details = error?.response?.data?.details
      toast.error(details ? `${msg}: ${details} ` : msg)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const ext = file.name.toLowerCase().split('.').pop()
      if (['txt', 'pdf', 'docx'].includes(ext)) {
        setSelectedFile(file)
        toast.success(`Attached ${file.name} `);
      } else {
        toast.error('Unsupported file. Please upload .txt, .pdf, or .docx')
      }
    }
  }

  const copyToClipboard = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy!');
    }
  }

  const downloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([summaryData.summary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "summary.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Downloaded as TXT');
  }

  const downloadPdf = () => {
    const doc = new jsPDF()
    const lines = doc.splitTextToSize(summaryData.summary, 180)
    doc.text(lines, 10, 10)
    doc.save("summary.pdf")
    toast.success('Downloaded as PDF');
  }

  const shareSummary = async () => {
    if (!summaryData?.shareId) return;
    const shareUrl = `${window.location.origin}/shared/${summaryData.shareId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Public share link copied!');
    } catch (err) {
      toast.error('Failed to copy share link!');
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">AI Summarizer Workspace</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Configure your settings, input content, and let AI do the rest.</p>
        </div>
        <button
          onClick={() => navigate('/history')}
          className="px-4 py-2 rounded-xl text-sm font-medium glass-card hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          View Dashboard History
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Settings & Input */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-6">

            {/* Top Toolbar (Style & Language) */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Summary Style
                </label>
                <div className="relative">
                  <select
                    value={style}
                    onChange={e => setStyle(e.target.value)}
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow transition-colors"
                  >
                    {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <Languages className="w-4 h-4 text-indigo-500" />
                  Output Language
                </label>
                <div className="relative">
                  <select
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow transition-colors"
                  >
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Document Text
                </label>
                {/* File Upload Trigger */}
                <div>
                  <input type="file" id="file-upload" accept=".txt,application/pdf,.docx" hidden onChange={handleFileChange} />
                  <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                    <UploadCloud className="w-3.5 h-3.5" />
                    {selectedFile ? 'Change File' : 'Upload PDF/DOCX'}
                  </label>
                </div>
              </div>

              {selectedFile && (
                <div className="mb-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <FileIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{selectedFile.name}</p>
                      <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedFile(null)} className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors" title="Remove attachment">
                    <span className="text-xs font-semibold">Remove</span>
                  </button>
                </div>
              )}

              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Paste your text here..."
                className="w-full h-64 resize-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>

            {/* Metrics Footer */}
            <div className="flex items-center justify-between mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
              <div className="flex gap-4">
                <span className="flex items-center gap-1"><Type className="w-3.5 h-3.5" /> {metrics.wordCount} words</span>
                <span className="hidden sm:inline-block">•</span>
                <span className="hidden sm:inline-flex items-center gap-1">{metrics.charCount} chars</span>
              </div>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> ~{metrics.readTime} min read</span>
            </div>

          </div>

          <button
            onClick={handleSummarize}
            disabled={loading || (!text.trim() && !selectedFile)}
            className={`w-full py-4 rounded-xl text-white font-semibold flex justify-center items-center gap-2 transition-all shadow-lg ${loading
              ? 'bg-indigo-400 cursor-not-allowed'
              : (!text.trim() && !selectedFile)
                ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed shadow-none'
                : 'btn-premium'
              }`}
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? 'Processing Document...' : 'Generate AI Summary'}
          </button>
        </div>

        {/* Right Column: Result Rendering */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-28">
            {loading ? (
              <div className="glass-card rounded-2xl p-6 min-h-[400px]">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-1/3"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-3/4"></div>
                  <div className="space-y-2 mt-8">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-5/6"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-4/6"></div>
                  </div>
                </div>
              </div>
            ) : summaryData ? (
              <div className="glass-card rounded-2xl p-6 min-h-[400px] border-t-4 border-t-indigo-500 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    Result
                  </h3>
                  <div className="flex gap-1">
                    <button onClick={() => copyToClipboard(summaryData.summary)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors" title="Copy Text"><Copy className="w-4 h-4" /></button>
                    <button onClick={downloadTxt} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors" title="Download TXT"><Download className="w-4 h-4" /></button>
                    {summaryData.shareId && (
                      <button onClick={shareSummary} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors" title="Copy Share Link"><LinkIcon className="w-4 h-4" /></button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                    {summaryData.style}
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30">
                    {summaryData.language}
                  </span>
                </div>

                <div className="prose prose-sm dark:prose-invert prose-slate flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {summaryData.summary}
                  </p>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center text-center border-dashed">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Ready to Summarize</h3>
                <p className="text-sm text-slate-500 dark:text-slate-500 max-w-[250px]">
                  Fill out the parameters on the left and hit generate to see the AI magic here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}