'use client';
import {useState} from 'react';
import Link from 'next/link';
import {useFinance} from '../components/FinanceProvider';
import Connection from '../components/Connection';
import {money} from '../lib/money';
export default function Home() {
 const {transactions,categories,loading,error,remove} = useFinance();
 const [type,setType] = useState('all'), [actionError,setActionError] = useState(''),[busy,setBusy] = useState(null);
 async function deleteItem(id) { setBusy(id);setActionError(''); try { await remove(id); } catch(e) { setActionError(e.message); } finally { setBusy(null); } }
 const items = [...transactions].filter(item => type === 'all' || item.type === type).sort((a,b) => b.date.localeCompare(a.date));
 return <main><p className="eyebrow">Обзор / Ваши финансы</p><h1>Каждая операция<br/>на своём месте.</h1><Connection/><section className="panel"><div className="row"><label>Тип операций<select value={type} onChange={e => setType(e.target.value)}><option value="all">Все</option><option value="income">Доходы</option><option value="expense">Расходы</option></select></label><Link className="button-link" href="/add">Новая операция ↗</Link></div><p className="error" role="alert">{actionError}</p>{!loading && !error && !items.length && <p className="empty">Операций пока нет.</p>}<ul className="list">{items.map(item => <li key={item.id}><span className="text"><Link href={`/transaction/${item.id}`}>{item.date} · {categories.find(category => String(category.id) === String(item.categoryId))?.name || 'Категория'}</Link><br/>{item.comment}</span><strong className={item.type}>{item.type === 'income' ? '+' : '−'}{money(item.amount)}</strong><Link href={`/add?id=${item.id}`}>Изменить</Link><button className="secondary" disabled={busy !== null} onClick={() => deleteItem(item.id)}>Удалить</button></li>)}</ul></section></main>;
}
