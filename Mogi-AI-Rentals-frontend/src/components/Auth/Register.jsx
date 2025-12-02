import React, { useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../../config'
import { Link } from 'react-router-dom'

export default function Register(){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [role,setRole]=useState('landlord'); const [msg,setMsg]=useState(null)
  const submit=async(e)=>{ e.preventDefault(); try{ await axios.post(`${API_BASE}/auth/register`, { name, email, password, role }); setMsg('Registered — awaiting approval if landlord') }catch(err){ setMsg(err.response?.data?.message || err.message) } }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        {msg && <div className="mb-2">{msg}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full p-2 border rounded" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" className="w-full p-2 border rounded" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <select className="w-full p-2 border rounded" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="landlord">Landlord</option>
            <option value="tenant">Tenant</option>
          </select>
          <button className="w-full bg-green-600 text-white p-2 rounded">Register</button>
        </form>
        <div className="mt-3 text-sm">Already have an account? <Link to="/login" className="text-indigo-600">Login</Link></div>
      </div>
    </div>
  )
}