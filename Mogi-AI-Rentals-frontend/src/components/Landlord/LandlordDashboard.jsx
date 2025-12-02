import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../../config'

export default function LandlordDashboard(){
  const [tenants,setTenants]=useState([])
  const [pending,setPending]=useState([])
  const [amount,setAmount]=useState('')
  const [selected,setSelected]=useState('')
  useEffect(()=>{ fetchTenants(); fetchPending() },[])
  const fetchTenants=async()=>{ try{ const r=await axios.get(`${API_BASE}/landlord/tenants`, { headers: { Authorization: `Bearer ${localStorage.getItem('mogi_token')}` } }); setTenants(r.data.tenants) }catch(e){ console.error(e) } }
  const fetchPending=async()=>{ try{ const r=await axios.get(`${API_BASE}/landlord/tenants/pending`, { headers: { Authorization: `Bearer ${localStorage.getItem('mogi_token')}` } }); setPending(r.data.pending) }catch(e){ console.error(e) } }
  const approve=async(id)=>{ await axios.post(`${API_BASE}/landlord/tenants/${id}/approve`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('mogi_token')}` } }); fetchPending(); fetchTenants() }
  const initSTK=async()=>{ if(!selected) return alert('Select tenant'); await axios.post(`${API_BASE}/api/mpesa/stk/push`, { tenantId: selected, amount }, { headers: { Authorization: `Bearer ${localStorage.getItem('mogi_token')}` } }); alert('STK push initiated') }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Landlord Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Pending Tenants</h2>
          {pending.length===0? <div>No pending</div> : pending.map(t=> <div key={t._id} className="flex justify-between items-center border-b py-2">{t.name} <button onClick={()=>approve(t._id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button></div>)}
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Collect Rent (STK Push)</h2>
          <select className="w-full p-2 border rounded mb-2" onChange={e=>setSelected(e.target.value)} value={selected}>
            <option value="">Select tenant</option>
            {tenants.map(t=> <option key={t._id} value={t._id}>{t.name} - {t.phone}</option>)}
          </select>
          <input className="w-full p-2 border rounded mb-2" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
          <button onClick={initSTK} className="w-full bg-indigo-600 text-white p-2 rounded">Initiate STK Push</button>
        </div>
      </div>
    </div>
  )
}