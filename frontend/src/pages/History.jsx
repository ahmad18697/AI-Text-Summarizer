import { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Button
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function History() {
  const [summaries, setSummaries] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/history')
        setSummaries(res.data)
      } catch (error) {
        console.error('Failed to fetch history:', error)
      }
    }
    fetchHistory()
  }, [])

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Summary History
      </Typography>
      
      <Button 
        variant="outlined" 
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Back to Summarizer
      </Button>
      
      <List>
        {summaries.map((item, index) => (
          <div key={index}>
            <ListItem>
              <ListItemText
                primary={item.summary}
                secondary={`Original: ${item.text.substring(0, 50)}...`}
              />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </Box>
  )
}