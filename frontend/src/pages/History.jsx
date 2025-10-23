import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Button,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Collapse,
  TextField,
  InputAdornment,
  Skeleton
} from '@mui/material';
import { 
  useNavigate, 
  useLocation 
} from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowBack, 
  Search, 
  ExpandMore, 
  ExpandLess,
  Delete,
  Refresh
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Custom relative time formatter using Intl
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  
  if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second');
  if (diffInSeconds < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  if (diffInSeconds < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  if (diffInSeconds < 2592000) return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  if (diffInSeconds < 31536000) return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
};

const StyledListItem = styled(ListItem)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateX(4px)'
  },
  '& .MuiListItemText-primary': {
    fontWeight: 500,
    color: theme.palette.text.primary
  },
  '& .MuiListItemText-secondary': {
    color: theme.palette.text.secondary
  }
}));

const SummaryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: '12px',
  boxShadow: theme.shadows[2],
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[6]
  }
}));

// Helper function to render formatted text with line breaks as paragraphs
const renderFormattedText = (text) => {
  if (!text) return null;
  // Split text by double line breaks or single line breaks for paragraphs
  const paragraphs = text.split(/\n{1,2}/g);
  return paragraphs.map((para, idx) => (
    <Typography 
      key={idx} 
      paragraph 
      sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
    >
      {para}
    </Typography>
  ));
};

export default function History() {
  const [summaries, setSummaries] = useState([]);
  const [filteredSummaries, setFilteredSummaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/history`);
        setSummaries(res.data);
        setFilteredSummaries(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch history:', error);
        setError('Failed to load history. Please try again.');
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSummaries(summaries);
    } else {
      const filtered = summaries.filter(item => 
        item.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSummaries(filtered);
    }
  }, [searchTerm, summaries]);

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/history/${id}`);
      setSummaries(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error('Failed to delete summary:', error);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    axios.get(`/api/history`)
      .then(res => {
        setSummaries(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch history:', error);
        setLoading(false);
      });
  };

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography variant="h6" color="error">{error}</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.location.reload()}
          startIcon={<Refresh />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 },
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Go back">
            <IconButton 
              onClick={() => navigate(location.state?.from || '/')}
              color="primary"
              size="large"
            >
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <Typography variant="h3" component="h1" sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #1976d2, #00acc1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Summary History
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Refresh history">
            <IconButton onClick={handleRefresh} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
            startIcon={<ArrowBack />}
            sx={{ borderRadius: '20px' }}
          >
            New Summary
          </Button>
        </Box>
      </Box>
      
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search summaries..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="primary" />
            </InputAdornment>
          ),
          sx: { borderRadius: '30px' }
        }}
      />
      
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[...Array(5)].map((_, index) => (
            <Skeleton 
              key={index} 
              variant="rounded" 
              height={120} 
              sx={{ borderRadius: '12px' }} 
            />
          ))}
        </Box>
      ) : filteredSummaries.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '300px',
          flexDirection: 'column',
          gap: 2,
          textAlign: 'center'
        }}>
          <Typography variant="h5" color="textSecondary">
            {searchTerm ? 'No matching summaries found' : 'Your summary history is empty'}
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/')}
            sx={{ borderRadius: '20px' }}
          >
            Create your first summary
          </Button>
        </Box>
      ) : (
        <List sx={{ width: '100%' }}>
          {filteredSummaries.map((item, index) => (
            <motion.div
              key={item._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <SummaryCard elevation={3}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Chip 
                    label={formatRelativeTime(item.createdAt)}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                  <Tooltip title="Delete summary">
                    <IconButton 
                      onClick={() => handleDelete(item._id)}
                      size="small"
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Summary
                </Typography>
                {/* Use renderFormattedText here */}
                {renderFormattedText(item.summary)}
                
                <Collapse in={expandedId === item._id} timeout="auto" unmountOnExit>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Original Text
                  </Typography>
                  <Box sx={{ 
                    mb: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    padding: 2,
                    borderRadius: 1
                  }}>
                    {/* Use renderFormattedText here */}
                    {renderFormattedText(item.text)}
                  </Box>
                </Collapse>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    onClick={() => handleExpand(item._id)}
                    endIcon={expandedId === item._id ? <ExpandLess /> : <ExpandMore />}
                    size="small"
                    sx={{ borderRadius: '20px' }}
                  >
                    {expandedId === item._id ? 'Show Less' : 'Show Original'}
                  </Button>
                </Box>
              </SummaryCard>
            </motion.div>
          ))}
        </List>
      )}
    </Box>
  );
}
