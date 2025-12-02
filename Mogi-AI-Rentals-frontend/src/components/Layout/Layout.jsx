import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout(){
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="p-6"><Outlet/></main>
      </div>
    </div>
  )
}