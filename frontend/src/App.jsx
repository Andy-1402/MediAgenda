import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Register from './pages/Register'
import List from './pages/List'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/lista" element={<List />} />
      </Routes>
      <footer className="footer">
        <div className="container footer-inner">
          <span>MediAgenda · Sistema de gestión de citas médicas</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  )
}

export default App
