import React, { useState } from 'react'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'
import { API_BASE } from '../../config'

export default function ResetPassword(){
  const [search] = useSearchParams();
  const id = search.get('id'); const token = search.get('token');
  const [newPassword,setNewPassword]=useState(''); const [msg,setMsg]=useState(null)
  const submit=async(e)=>{ e.preventDefault(); try{ await axios.post(`${API_BASE}/auth/reset-password`, { id, token, newPassword }); setMsg('Password reset successful') }catch(err){ setMsg('Reset failed') } }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Reset password</h2>
        {msg && <div className="mb-2">{msg}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input type="password" className="w-full p-2 border rounded" placeholder="New password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
          <button className="w-full bg-green-600 text-white p-2 rounded">Reset password</button>
        </form>
      </div>
    </div>
  )
}