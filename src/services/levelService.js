import api from './api'
export async function createLevel(gameId,payload){ const {data}=await api.post(`/levels/${gameId}/levels`,payload); return data }
export async function getLevel(levelId){ const {data}=await api.get(`/levels/${levelId}`); return data }
