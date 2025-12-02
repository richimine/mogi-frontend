import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../../config'

export default function AdminDashboard(){
  const [pending,setPending]=useState([])
  useEffect(()=>{ fetchPending() },[])
  const fetchPending=async()=>{ try{ const r=await axios.get(`${API_BASE}/admin/landlords/pending`, { headers: { Authorization: `Bearer ${localStorage.getItem('mogi_token')}` } }); setPending(r.data.pending) }catch(e){ console.error(e) } }
  const approve=async(id)=>{ await axios.post(`${API_BASE}/admin/landlords/${id}/approve`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('mogi_token')}` } }); fetchPending() }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin — Pending Landlords</h1>
      <div className="bg-white p-4 rounded shadow">
        {pending.length===0? <div>No pending</div> : (
          <ul>{pending.map(p=> <li key={p._id} className="flex justify-between py-2 border-b">{p.name} <button onClick={()=>approve(p._1d)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button></li>)}</ul>
        )}
      </div>
    </div>
  )
}