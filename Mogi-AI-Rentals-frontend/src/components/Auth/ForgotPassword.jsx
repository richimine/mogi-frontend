import React, { useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../../config'

export default function ForgotPassword(){
  const [email,setEmail]=useState(''); const [msg,setMsg]=useState(null)
  const submit=async(e)=>{ e.preventDefault(); try{ await axios.post(`${API_BASE}/auth/forgot-password`, { email }); setMsg('If account exists, reset email sent.') }catch(err){ setMsg('Error sending reset') } }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Forgot password</h2>
        {msg && <div className="mb-2">{msg}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <button className="w-full bg-indigo-600 text-white p-2 rounded">Send reset</button>
        </form>
      </div>
    </div>
  )
}