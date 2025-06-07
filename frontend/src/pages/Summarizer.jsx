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
import BACKEND_URL from '../../config'

export default function Summarizer() {
  const [text, setText] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSummarize = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const res = await axios.post(`${BACKEND_URL}/api/summarize`, { text })
      setSummary(res.data.summary.summary)
    } catch (error) {
      alert('Failed to generate summary')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        AI Text Summarizer
      </Typography>
      
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