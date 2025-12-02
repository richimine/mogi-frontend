import React from 'react'
import { Link } from 'react-router-dom'
export default function Sidebar(){
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <div className="text-xl font-bold mb-6">Mogi AI Rentals</div>
      <nav className="space-y-2">
        <Link to="/" className="block p-2 rounded hover:bg-gray-100">Home</Link>
        <Link to="/admin" className="block p-2 rounded hover:bg-gray-100">Admin</Link>
        <Link to="/landlord" className="block p-2 rounded hover:bg-gray-100">Landlord</Link>
        <Link to="/tenant" className="block p-2 rounded hover:bg-gray-100">Tenant</Link>
      </nav>
    </aside>
  )
}