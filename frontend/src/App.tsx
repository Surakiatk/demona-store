import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CurrencyProvider } from './contexts/CurrencyContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import IncomePage from './pages/IncomePage'
import ExpensePage from './pages/ExpensePage'
import CategoriesPage from './pages/CategoriesPage'

function App() {
  return (
    <CurrencyProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/income" element={<IncomePage />} />
            <Route path="/expense" element={<ExpensePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
          </Routes>
        </Layout>
      </Router>
    </CurrencyProvider>
  )
}

export default App

