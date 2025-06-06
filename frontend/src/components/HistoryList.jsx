import { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import axios from 'axios';

export default function History() {
  const [summaries, setSummaries] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/history');
        setSummaries(res.data);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      }
    };
    fetchHistory();
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Summary History</Typography>
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
  );
}