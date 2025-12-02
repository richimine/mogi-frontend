import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export default function Login(){
  const { login } = useAuth();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)
  const nav = useNavigate()
  const submit = async (e)=>{ e.preventDefault(); try{ const u = await login(email, password); if(u.role==='admin') nav('/admin'); else if(u.role==='landlord') nav('/landlord'); else nav('/tenant') }catch(err){ setErr(err.response?.data?.message || err.message) } }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Mogi AI Rentals — Sign in</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" className="w-full p-2 border rounded" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="w-full bg-indigo-600 text-white p-2 rounded">Login</button>
        </form>
        <div className="mt-4 text-sm">
          <Link to="/forgot" className="text-indigo-600">Forgot password?</Link>
        </div>
      </div>
    </div>
  )
}