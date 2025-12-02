import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './components/Auth/AuthProvider'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import ForgotPassword from './components/Auth/ForgotPassword'
import ResetPassword from './components/Auth/ResetPassword'
import Layout from './components/Layout/Layout'
import AdminDashboard from './components/Admin/AdminDashboard'
import LandlordDashboard from './components/Landlord/LandlordDashboard'
import TenantPortal from './components/Tenant/TenantPortal'

function RequireRole({ children, role }){
  const { user } = useAuth()
  if(!user) return <Navigate to="/login" />
  if(role && user.role !== role) return <div className="p-6">Access denied</div>
  return children
}

export default function App(){
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<div className="p-6">Welcome to Mogi AI Rentals</div>} />
            <Route path="admin" element={<RequireRole role={'admin'}><AdminDashboard /></RequireRole>} />
            <Route path="landlord" element={<RequireRole role={'landlord'}><LandlordDashboard /></RequireRole>} />
            <Route path="tenant" element={<RequireRole role={'tenant'}><TenantPortal /></RequireRole>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}