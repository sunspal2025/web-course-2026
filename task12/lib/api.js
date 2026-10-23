const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export async function request(path,options = {}) {
  try {
    const response = await fetch(`${base}${path}`,{...options,headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(10000)});
    if (!response.ok) throw new Error(response.status === 404 ? 'Операция не найдена.' : `Ошибка сервера: ${response.status}`);
    return response.status === 204 ? null : await response.json();
  } catch (error) { throw new Error(`${error.message} Для работы с данными нужен json-server (localhost:3001).`); }
}
