"use client"

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { SocketProvider } from "./components/contexts/socket-context"
import LoginPage from "./components/auth/login-page"
import RegistrationForm from "./components/auth/register-form"
import Dashboard from "./components/dashboard/dashboard"  // Keeping dashboard as it is

function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          {/* Home redirects to Login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Login Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Sign Up Page */}
          <Route path="/signup" element={<RegistrationForm />} />

          {/* Dashboard Page (unchanged) */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  )
}

export default App
