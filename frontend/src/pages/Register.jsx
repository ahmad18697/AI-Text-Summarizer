import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Box, Button, Card, CardContent, TextField, Typography, CircularProgress } from '@mui/material';

export default function Register() {
  const { setUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/auth/register', { name, email, password }, { withCredentials: true });
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}auth-bg.png`;
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
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${import.meta.env.BASE_URL}auth-bg.png)`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', zIndex: 0 }} />
      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%' }}>
        <Card sx={{ width: 380, borderRadius: 3, bgcolor: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 10px 30px rgba(79,70,229,0.12)' }}>
          <CardContent>
          <Typography variant="h5" sx={{ color: '#111827', mb: 2, fontWeight: 700 }}>Create account</Typography>
          <Typography variant="body2" sx={{ color: '#374151', mb: 3 }}>Join to start summarizing</Typography>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Name" value={name} onChange={(e)=>setName(e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} sx={{ mb: 2 }} />
            <Button fullWidth type="submit" variant="contained" disabled={loading} sx={{ py: 1.2, borderRadius: 2, backgroundColor: '#4f46e5' }}>
              {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Create account'}
            </Button>
          </form>
          <Typography variant="body2" sx={{ mt: 2, color: '#374151' }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

