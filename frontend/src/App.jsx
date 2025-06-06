import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Summarizer from './pages/Summarizer'
import History from './pages/History'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Summarizer />} exact />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  )
}

export default App