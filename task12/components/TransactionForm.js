'use client';
import {useState,useEffect} from 'react';
import {useRouter,useSearchParams} from 'next/navigation';
import {useFinance} from './FinanceProvider';
import Connection from './Connection';
function today() { const d = new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
export default function TransactionForm() {
 const router = useRouter(), params = useSearchParams(), id = params.get('id');
 const {transactions,categories,loading,error:connectionError,save} = useFinance();
 const [values,setValues] = useState({amount:'',type:'expense',categoryId:'',date:today(),comment:''}),[error,setError] = useState(''),[busy,setBusy] = useState(false);
 const existing = transactions.find(item => String(item.id) === id);
 useEffect(() => { if (existing) setValues({...existing,categoryId:String(existing.categoryId)}); },[existing]);
 function change(e) { const {name,value} = e.target; setValues(previous => ({...previous,[name]:value,...(name === 'type' ? {categoryId:''} : {})})); }
 async function submit(e) {
  e.preventDefault(); if (busy) return;
  const amount = Number(values.amount);
  if (!Number.isFinite(amount) || Math.round(amount*100) <= 0 || !values.categoryId || !values.date) { setError('Укажите положительную сумму, категорию и дату.'); return; }
  if (!categories.some(c => String(c.id) === values.categoryId && c.type === values.type)) { setError('Категория должна соответствовать типу операции.'); return; }
  setBusy(true); setError('');
  try { await save({...values,amount:Math.round(amount*100)/100,comment:values.comment.trim()},id); router.push('/'); }
  catch(failure) { setError(failure.message); }
  finally { setBusy(false); }
 }
 return <><Connection/>{id && !loading && !connectionError && !existing ? <p role="alert">Операция не найдена.</p> : <form className="panel transaction-form" onSubmit={submit}><label>Сумма, ₽<input name="amount" type="number" min="0.01" step="0.01" required value={values.amount} onChange={change}/></label><label>Тип<select name="type" value={values.type} onChange={change}><option value="expense">Расход</option><option value="income">Доход</option></select></label><label>Категория<select name="categoryId" required value={values.categoryId} onChange={change}><option value="">Выберите категорию</option>{categories.filter(c => c.type === values.type).map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}</select></label><label>Дата<input name="date" type="date" required value={values.date} onChange={change}/></label><label>Комментарий<textarea name="comment" maxLength={500} value={values.comment} onChange={change}/></label><p className="error" role="alert">{error}</p><button disabled={busy || loading || Boolean(connectionError)}>{busy ? 'Сохранение…' : id ? 'Сохранить изменения' : 'Добавить операцию'}</button></form>}</>;
}
