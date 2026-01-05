import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import ExpenseForm from './pages/ExpenseForm'
import Categories from './pages/Categories'
import FinancialCalculator from './pages/FinancialCalculator'
import Layout from './components/Layout'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="expenses/new" element={<ExpenseForm />} />
            <Route path="expenses/edit/:id" element={<ExpenseForm />} />
            <Route path="categories" element={<Categories />} />
            <Route path="calculator" element={<FinancialCalculator />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

