/*
AI Rent — Dashboards (React + Tailwind + Recharts)
File: src/App.jsx

This single-file React scaffold provides three dashboards:
- AdminDashboard
- LandlordDashboard
- TenantPortal

Features included:
- Auth (login) flow with token storage
- Protected routes and role-based rendering
- Landlord: tenants list, initiate STK push, view payments
- Admin: pending landlords, approve landlord
- Tenant: view rent balance and payment history
- Simple charts (using recharts)
- API layer that calls the backend endpoints we created earlier

Quick setup (recommended):
1. Create a project: `npm create vite@latest ai-rent-frontend --template react` (or use CRA)
2. Install deps: `npm install react-router-dom axios recharts` and add Tailwind per tailwindcss docs
3. Replace src/App.jsx with this file and add src/main.css with Tailwind directives
4. Update API_BASE const to point to your backend (e.g., http://localhost:4000)

Note: this is a starter UI. Wire it to your real backend URL and enable CORS on the server.
*/

import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

// ---------------- Auth Context ----------------
const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('ai_rent_user');
    return raw ? JSON.parse(raw) : null;
  });
  const token = localStorage.getItem('ai_rent_token');

  const login = async (email, password) => {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    localStorage.setItem('ai_rent_token', res.data.token);
    const me = res.data.user || (await axios.get(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${res.data.token}` } })).data.user;
    localStorage.setItem('ai_rent_user', JSON.stringify(me));
    setUser(me);
    return me;
  };

  const logout = () => {
    localStorage.removeItem('ai_rent_token');
    localStorage.removeItem('ai_rent_user');
    setUser(null);
  };

  const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('ai_rent_token')}` });

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, authHeaders }}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------------- Protected Route ----------------
function RequireAuth({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <div className="p-4">Access denied</div>;
  return children;
}

// ---------------- Login Page ----------------
function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === 'admin') nav('/admin');
      else if (user.role === 'landlord') nav('/landlord');
      else nav('/tenant');
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
        {err && <div className="bg-red-100 text-red-700 p-2 rounded mb-2">{err}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full p-2 border rounded" />
          <button className="w-full bg-indigo-600 text-white p-2 rounded">Login</button>
        </form>
      </div>
    </div>
  );
}

// ---------------- Admin Dashboard ----------------
function AdminDashboard() {
  const { authHeaders, logout } = useAuth();
  const [pending, setPending] = useState([]);

  useEffect(() => { fetchPending(); }, []);
  const fetchPending = async () => {
    const res = await axios.get(`${API_BASE}/admin/landlords/pending`, { headers: authHeaders() });
    setPending(res.data.pending);
  };

  const approve = async (id) => {
    await axios.post(`${API_BASE}/admin/landlords/${id}/approve`, {}, { headers: authHeaders() });
    fetchPending();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div>
          <button onClick={logout} className="px-3 py-1 border rounded">Logout</button>
        </div>
      </div>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Pending Landlords</h2>
        {pending.length === 0 ? <div>No pending landlords</div> : (
          <ul>
            {pending.map(p => (
              <li key={p._id} className="flex justify-between items-center border-b py-2">
                <div>{p.name} — {p.email}</div>
                <button onClick={() => approve(p._id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

// ---------------- Landlord Dashboard ----------------
function LandlordDashboard() {
  const { authHeaders, logout } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [amount, setAmount] = useState('');
  const [selectedTenant, setSelectedTenant] = useState(null);

  useEffect(() => { fetchTenants(); fetchPayments(); }, []);

  const fetchTenants = async () => {
    const res = await axios.get(`${API_BASE}/landlord/tenants`, { headers: authHeaders() });
    setTenants(res.data.tenants);
  };

  const fetchPayments = async () => {
    const res = await axios.get(`${API_BASE}/landlord/payments`, { headers: authHeaders() }).catch(() => ({ data: { payments: [] }}));
    setPayments(res.data.payments || []);
  };

  const initSTK = async () => {
    if (!selectedTenant) return alert('Select tenant');
    const res = await axios.post(`${API_BASE}/api/mpesa/stk/push`, { tenantId: selectedTenant, amount }, { headers: authHeaders() });
    alert('STK Push initiated — ' + res.data.paymentRequest.checkoutRequestId);
  };

  const chartData = payments.slice(-8).map(p => ({ date: new Date(p.transactionDate).toLocaleDateString(), amount: p.amount }));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Landlord Dashboard</h1>
        <div>
          <button onClick={logout} className="px-3 py-1 border rounded">Logout</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Tenants</h2>
          <table className="w-full text-left border-collapse">
            <thead><tr><th>Name</th><th>Phone</th><th>Rent</th></tr></thead>
            <tbody>
              {tenants.map(t => (
                <tr key={t._id} className="border-t"><td>{t.name}</td><td>{t.phone}</td><td>{t.rent || '—'}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Quick Rent Collect</h2>
          <select className="w-full p-2 border rounded mb-2" onChange={e => setSelectedTenant(e.target.value)}>
            <option value="">Select Tenant</option>
            {tenants.map(t => <option key={t._id} value={t._id}>{t.name} — {t.phone}</option>)}
          </select>
          <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="w-full p-2 border rounded mb-2" />
          <button onClick={initSTK} className="w-full bg-indigo-600 text-white p-2 rounded">Initiate STK Push</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mt-4">
        <h2 className="font-semibold mb-2">Recent Payments</h2>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ---------------- Tenant Portal ----------------
function TenantPortal() {
  const { authHeaders, logout } = useAuth();
  const [tenant, setTenant] = useState(null);
  const [payments, setPayments] = useState([]);

  useEffect(() => { fetchMe(); fetchPayments(); }, []);

  const fetchMe = async () => {
    const res = await axios.get(`${API_BASE}/auth/me`, { headers: authHeaders() });
    setTenant(res.data.user);
  };
  const fetchPayments = async () => {
    const res = await axios.get(`${API_BASE}/tenant/payments`, { headers: authHeaders() }).catch(() => ({ data: { payments: [] }}));
    setPayments(res.data.payments || []);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Tenant Portal</h1>
        <div>
          <button onClick={logout} className="px-3 py-1 border rounded">Logout</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold">Your Info</h2>
        <div className="mt-2">Name: {tenant?.name}</div>
        <div>Email: {tenant?.email}</div>
        <div>Phone: {tenant?.phone}</div>
        <div>Rent Balance: {tenant?.rentBalance ?? '—'}</div>
      </div>

      <div className="bg-white p-4 rounded shadow mt-4">
        <h2 className="font-semibold">Payment History</h2>
        <ul>
          {payments.map(p => (
            <li key={p._id} className="border-b py-2">{new Date(p.transactionDate).toLocaleString()} — KES {p.amount}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ---------------- App Shell ----------------
function AppShell() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white p-4 shadow">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="font-bold">AI Rent</Link>
          <div className="space-x-3">
            {!user && <Link to="/login" className="px-3 py-1">Login</Link>}
            {user && user.role === 'admin' && <Link to="/admin">Admin</Link>}
            {user && user.role === 'landlord' && <Link to="/landlord">Landlord</Link>}
            {user && user.role === 'tenant' && <Link to="/tenant">Tenant</Link>}
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto mt-6">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<RequireAuth role={'admin'}><AdminDashboard /></RequireAuth>} />
          <Route path="/landlord" element={<RequireAuth role={'landlord'}><LandlordDashboard /></RequireAuth>} />
          <Route path="/tenant" element={<RequireAuth role={'tenant'}><TenantPortal /></RequireAuth>} />
          <Route path="/" element={<div className="p-6">Welcome to AI Rent — please <Link to="/login" className="text-indigo-600">login</Link>.</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppShell />
      </Router>
    </AuthProvider>
  );
}
