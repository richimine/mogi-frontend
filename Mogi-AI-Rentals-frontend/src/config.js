export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api'
export const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('mogi_token')}` })