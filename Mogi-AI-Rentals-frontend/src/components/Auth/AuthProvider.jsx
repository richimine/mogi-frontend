import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE } from '../../config'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }){
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('mogi_user') || 'null'))

  useEffect(()=>{ const token = localStorage.getItem('mogi_token'); if(token && !user){ axios.get(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } }).then(r=>{ localStorage.setItem('mogi_user', JSON.stringify(r.data.user)); setUser(r.data.user) }).catch(()=>{}) } }, [])

  const login = async (email, password) => {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password })
    localStorage.setItem('mogi_token', res.data.token)
    localStorage.setItem('mogi_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }
  const logout = ()=>{ localStorage.removeItem('mogi_token'); localStorage.removeItem('mogi_user'); setUser(null) }

  return <AuthContext.Provider value={{ user, setUser, login, logout }}>{children}</AuthContext.Provider>
}