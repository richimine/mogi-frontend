import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../../config'

export default function TenantPortal(){
  const [me,setMe]=useState(null)
  const [payments,setPayments]=useState([])
  useEffect(()=>{ const token = localStorage.getItem('mogi_token'); if(token){ axios.get(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } }).then(r=>setMe(r.data.user)).catch(()=>{}); axios.get(`${API_BASE}/tenant/payments`, { headers: { Authorization: `Bearer ${token}` } }).then(r=>setPayments(r.data.payments)).catch(()=>{}) } },[])
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tenant Portal</h1>
      <div className="bg-white p-4 rounded shadow mb-4">
        <div>Name: {me?.name}</div>
        <div>Email: {me?.email}</div>
        <div>Phone: {me?.phone}</div>
        <div>Rent Balance: {me?.rentBalance ?? '—'}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Payment History</h2>
        {payments.length===0? <div>No payments</div> : payments.map(p=> <div key={p._id} className="border-b py-2">{new Date(p.transactionDate).toLocaleString()} — KES {p.amount}</div>)}
      </div>
    </div>
  )
}