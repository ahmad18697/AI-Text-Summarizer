import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Chip,
  Stack,
  Tooltip
} from '@mui/material';
import axios from 'axios';

// Helper function to render formatted text (bold + newlines)
const renderFormattedText = (text) => {
  if (!text) return null;

  return text.split('\n').map((line, idx) => (
    <Typography
      key={idx}
      component="div"
      variant="body1"
      sx={{ lineHeight: 1.7, mb: 1 }}
    >
      {line.split(/(\*\*.*?\*\*)/g).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} style={{ fontWeight: 600 }}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
    </Typography>
  ));
};

export default function History() {
  const [summaries, setSummaries] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/api/history');
        setSummaries(res.data);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      }
    };
    fetchHistory();
  }, []);

  return (
    <Box sx={{ maxWidth: '900px', mx: 'auto', p: 3 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        📚 Summary History
      </Typography>

      {summaries.length === 0 ? (
        <Typography variant="body1" color="text.secondary" textAlign="center">
          No summaries found.
        </Typography>
      ) : (
        <List sx={{ width: '100%' }}>
          {summaries.map((item, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{ mb: 4, p: 3, borderRadius: 3, backgroundColor: '#fafafa' }}
            >
              <ListItem alignItems="flex-start" disableGutters>
                <ListItemText
                  primary={<Box>{renderFormattedText(item.summary)}</Box>}
                  secondary={
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mt: 2 }}
                    >
                      <Tooltip title={item.text} arrow>
                        <Chip
                          label={`Original: ${item.text.substring(0, 40)}...`}
                          size="small"
                          variant="outlined"
                          color="primary"
                          clickable
                          onClick={() => alert(`Original Text:\n\n${item.text}`)}
                        />
                      </Tooltip>
                      <Typography variant="caption" color="text.secondary">
                        Summary #{index + 1}
                      </Typography>
                    </Stack>
                  }
                />
              </ListItem>
              {index < summaries.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
}
