import { useEffect, useState } from 'react'
import { Box, Card, CardContent, Typography, Avatar, Stack, Divider, Button } from '@mui/material'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()
  const [me, setMe] = useState(user)
  const [loading, setLoading] = useState(!user)

  useEffect(() => {
    let mounted = true
    if (!user) {
      setLoading(true)
      api.get('/auth/me')
        .then(res => { if (mounted) setMe(res.data.user) })
        .catch(() => { })
        .finally(() => mounted && setLoading(false))
    }
    return () => { mounted = false }
  }, [user])

  const display = me || user

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>My Profile</Typography>
      <Card className="glass">
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
            <Avatar sx={{ width: 72, height: 72, bgcolor: '#6366f1' }}>
              {(display?.name || display?.email || 'U').toUpperCase().charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ color: 'black' }}>
                {display?.name || 'User'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'black' }}>
                {display?.email || '—'}
              </Typography>
            </Box>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ color: 'black', mb: 1 }}>Preferences</Typography>
          <Typography variant="body2" sx={{ color: 'black' }}>Theme: Light</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ color: 'black', mb: 1 }}>Quick Actions</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" href="/history">View History</Button>
            <Button variant="contained" href="/app">Open Summarizer</Button>
          </Stack>
        </CardContent>
      </Card>
      {loading && <Typography sx={{ mt: 2 }}>Loading profile…</Typography>}
    </Box>
  )
}
