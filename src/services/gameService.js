import api from './api'
export async function listGames(q=''){ const {data}=await api.get('/games',{params:q?{q}:{}}); return data }
export async function getGame(slug){ const {data}=await api.get(`/games/${slug}`); return data }
export async function createGame(payload){ const {data}=await api.post('/games',payload); return data }
