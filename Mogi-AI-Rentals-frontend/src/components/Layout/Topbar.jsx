import React from 'react'
import { useAuth } from '../Auth/AuthProvider'
export default function Topbar(){
  const { user, logout } = useAuth()
  return (
    <div className="flex items-center justify-between bg-white p-4 border-b">
      <div className="text-sm text-gray-600">Welcome {user?.name || 'Guest'}</div>
      <div className="flex items-center space-x-3">
        {user && <button onClick={logout} className="px-3 py-1 border rounded">Logout</button>}
      </div>
    </div>
  )
}