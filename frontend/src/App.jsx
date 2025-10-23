import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Summarizer from './pages/Summarizer'
import History from './pages/History'
import Login from './pages/Login'
import Register from './pages/Register'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Profile from './pages/Profile'
import { useAuth } from './context/AuthContext'

function App() {
  const { user } = useAuth()
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<PrivateRoute><Summarizer /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Routes>
    </Router>
  )
}

export default App