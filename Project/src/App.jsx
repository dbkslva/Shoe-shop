import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AboutPage from './pages/AboutPage'
import CatalogPage from './pages/CatalogPage'
import ContactsPage from './pages/ContactsPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog.html" element={<CatalogPage />} />
        <Route path="/about.html" element={<AboutPage />} />
        <Route path="/contacts.html" element={<ContactsPage />} />
        <Route path="/404.html" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404.html" replace />} />
      </Route>
    </Routes>
  )
}

export default App
