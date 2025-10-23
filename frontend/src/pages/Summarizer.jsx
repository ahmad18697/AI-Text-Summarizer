import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Card, 
  CardContent,
  CircularProgress
} from '@mui/material'
import axios from 'axios'

export default function Summarizer() {
  const [text, setText] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const [docText, setDocText] = useState('')
  const navigate = useNavigate()

  const handleSummarize = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const instructionWords = text.trim().split(/\s+/).filter(Boolean)
      const useComposed = docText && instructionWords.length > 0 && instructionWords.length < 10
      const payloadText = useComposed
        ? `Instruction: ${text}\n\nDocument:\n${docText}`
        : text
      const res = await axios.post(`/api/summary`, { text: payloadText }, { withCredentials: true })
      setSummary(res.data.summary.summary)
    } catch (error) {
      const msg = error?.response?.data?.error || error?.message || 'Failed to generate summary'
      const details = error?.response?.data?.details
      alert(details ? `${msg}: ${details}` : msg)
    } finally {
      setLoading(false)
    }
  }

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const ext = file.name.toLowerCase().split('.').pop()
    try {
      if (ext === 'txt') {
        const content = await file.text()
        setText(content)
        setDocText(content)
      } else if (ext === 'pdf') {
        const content = await extractTextFromPDF(file)
        setText(content)
        setDocText(content)
      } else {
        alert('Unsupported file. Please upload a .txt or .pdf file')
      }
    } catch (err) {
      alert(`Failed to read file${err?.message ? `: ${err.message}` : ''}`)
    }
  }

  async function extractTextFromPDF(file) {
    // Uses PDF.js loaded via CDN in index.html (window.pdfjsLib)
    const arrayBuffer = await file.arrayBuffer()
    const pdfjsLib = window.pdfjsLib
    if (!pdfjsLib) {
      throw new Error('PDF support not loaded. Please hard refresh the page so PDF.js can initialize.')
    }
    if (pdfjsLib?.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      // Fallback in case workerSrc wasn’t set by index.html script
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js'
    }
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
    const pdf = await loadingTask.promise
    let fullText = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const strings = content.items.map((it) => it.str)
      fullText += strings.join(' ') + '\n'
    }
    return fullText.trim()
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        AI Text Summarizer
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Button component="label" variant="outlined">
          Upload .txt / .pdf
          <input type="file" accept=".txt,application/pdf" hidden onChange={handleFile} />
        </Button>
        {fileName ? <Typography variant="body2" color="text.secondary">{fileName}</Typography> : null}
      </Box>

      <TextField
        fullWidth
        multiline
        rows={6}
        label="Enter text to summarize"
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <Button
        variant="contained"
        onClick={handleSummarize}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
        sx={{ mr: 2 }}
      >
        {loading ? 'Summarizing...' : 'Generate Summary'}
      </Button>
      
      <Button 
        variant="outlined" 
        onClick={() => navigate('/history')}
      >
        View History
      </Button>

      {summary && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6">Summary:</Typography>
            <Typography>{summary}</Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}