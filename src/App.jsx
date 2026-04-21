import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'

import Login from './pages/Login'
import AdminDashboard from './pages/admin/Dashboard'
import ReviewQueue from './pages/admin/ReviewQueue'
import Analytics from './pages/admin/Analytics'
import OEMRegistry from './pages/admin/OEMRegistry'
import Registrations from './pages/admin/Registrations'
import Announcements from './pages/admin/Announcements'
import Messaging from './pages/Messaging'
import PartnerDashboard from './pages/partner/Dashboard'
import PartnerSubmissions from './pages/partner/Submissions'
import NewSubmission from './pages/partner/NewSubmission'
import AcquirerDashboard from './pages/acquirer/Dashboard'
import AcquirerTechnologies from './pages/acquirer/Technologies'
import AcquirerCertificates from './pages/acquirer/Certificates'
import RenewalFlow from './pages/acquirer/RenewalFlow'
import FeePayment from './pages/acquirer/FeePayment'

function ProtectedRoute({ children, role }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  if (role && user.role !== role) return <Navigate to={`/${user.role}`} replace />
  return <Layout>{children}</Layout>
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={`/${user.role}`} replace /> : <Login />} />

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/review" element={<ProtectedRoute role="admin"><ReviewQueue /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><Analytics /></ProtectedRoute>} />
      <Route path="/admin/oem-registry" element={<ProtectedRoute role="admin"><OEMRegistry /></ProtectedRoute>} />
      <Route path="/admin/registrations" element={<ProtectedRoute role="admin"><Registrations /></ProtectedRoute>} />
      <Route path="/admin/messages" element={<ProtectedRoute role="admin"><Messaging /></ProtectedRoute>} />
      <Route path="/admin/announcements" element={<ProtectedRoute role="admin"><Announcements /></ProtectedRoute>} />

      {/* Partner routes */}
      <Route path="/partner" element={<ProtectedRoute role="partner"><PartnerDashboard /></ProtectedRoute>} />
      <Route path="/partner/submissions" element={<ProtectedRoute role="partner"><PartnerSubmissions /></ProtectedRoute>} />
      <Route path="/partner/new-submission" element={<ProtectedRoute role="partner"><NewSubmission /></ProtectedRoute>} />
      <Route path="/partner/messages" element={<ProtectedRoute role="partner"><Messaging /></ProtectedRoute>} />

      {/* Acquirer routes */}
      <Route path="/acquirer" element={<ProtectedRoute role="acquirer"><AcquirerDashboard /></ProtectedRoute>} />
      <Route path="/acquirer/technologies" element={<ProtectedRoute role="acquirer"><AcquirerTechnologies /></ProtectedRoute>} />
      <Route path="/acquirer/certificates" element={<ProtectedRoute role="acquirer"><AcquirerCertificates /></ProtectedRoute>} />
      <Route path="/acquirer/renew" element={<ProtectedRoute role="acquirer"><RenewalFlow /></ProtectedRoute>} />
      <Route path="/acquirer/pay-fee" element={<ProtectedRoute role="acquirer"><FeePayment /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
