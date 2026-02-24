import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Box, Button, Card, CardContent, TextField, Typography, CircularProgress } from '@mui/material';

export default function Login() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleResponse = async (response) => {
    try {
      const res = await api.post('/auth/google', { id_token: response.credential });
      setUser(res.data.user);
      navigate('/');
    } catch (e) {
      alert('Google sign-in failed');
    }
  };

  useEffect(() => {
    /* global google */
    if (window.google && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { theme: 'outline', size: 'large', shape: 'pill' }
      );
    }
  }, []);

  useEffect(() => {
    const url = '/login-bg.png';
    const body = document.body;
    const prev = {
      image: body.style.backgroundImage,
      size: body.style.backgroundSize,
      position: body.style.backgroundPosition,
      repeat: body.style.backgroundRepeat,
      attachment: body.style.backgroundAttachment,
    };
    body.style.backgroundImage = `url(${url})`;
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = 'center';
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundAttachment = 'fixed';
    return () => {
      body.style.backgroundImage = prev.image;
      body.style.backgroundSize = prev.size;
      body.style.backgroundPosition = prev.position;
      body.style.backgroundRepeat = prev.repeat;
      body.style.backgroundAttachment = prev.attachment;
    };
  }, []);

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url('/login-bg.png')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', zIndex: 0 }} />
      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%' }}>
        <Card sx={{ width: 380, borderRadius: 3, bgcolor: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 10px 30px rgba(79,70,229,0.12)' }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: '#111827', mb: 2, fontWeight: 700 }}>Welcome back</Typography>
            <Typography variant="body2" sx={{ color: '#374151', mb: 3 }}>Sign in to continue</Typography>
            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />
              <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} />
              <Button fullWidth type="submit" variant="contained" disabled={loading} sx={{ py: 1.2, borderRadius: 2, backgroundColor: '#4f46e5' }}>
                {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Sign In'}
              </Button>
            </form>
            <Box id="googleSignInDiv" style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }} />
            <Typography variant="body2" sx={{ mt: 2, color: '#374151' }}>
              Don't have an account? <Link to="/register">Create one</Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

