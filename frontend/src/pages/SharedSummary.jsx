import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CircularProgress, Stack } from '@mui/material';
import axios from 'axios';

// Public page does not use the auth interceptor by default to avoid triggering login redirects
const publicApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
});

export default function SharedSummary() {
    const { shareId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await publicApi.get(`/api/summary/shared/${shareId}`);
                setData(res.data);
            } catch (err) {
                setError('Shared summary not found or invalid link.');
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, [shareId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !data) {
        return (
            <Box sx={{ p: 4, textAlign: 'center', mt: 10 }}>
                <Typography variant="h5" color="error">{error}</Typography>
                <Link to="/" style={{ display: 'inline-block', marginTop: '1rem', color: '#4f46e5' }}>
                    Back to AI Summarizer
                </Link>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '800px', mx: 'auto' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
                Shared Summary
            </Typography>
            <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>
                Created via AI Text Summarizer
            </Typography>

            <Card sx={{ borderRadius: 3, boxShadow: 3, borderTop: '4px solid #4f46e5' }}>
                <CardContent>
                    <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
                        <Typography variant="caption" sx={{ px: 1, py: 0.5, bgcolor: '#f3f4f6', borderRadius: 1 }}>
                            Style: <b>{data.style || 'Short'}</b>
                        </Typography>
                        <Typography variant="caption" sx={{ px: 1, py: 0.5, bgcolor: '#f3f4f6', borderRadius: 1 }}>
                            Language: <b>{data.language || 'English'}</b>
                        </Typography>
                    </Box>
                    <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#374151' }}>
                        {data.summary}
                    </Typography>

                    <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e5e7eb' }}>
                        <Typography variant="body2" color="text.secondary">
                            <b>Original Text Snippet:</b>
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {data.text}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
