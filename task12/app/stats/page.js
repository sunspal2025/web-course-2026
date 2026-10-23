'use client';
import {useFinance} from '../../components/FinanceProvider';
import Connection from '../../components/Connection';
import {money,totals} from '../../lib/money';
export default function StatsPage() {
 const {transactions,categories,loading,error} = useFinance(); const {income,expense,balance} = totals(transactions);
 return <main><p className="eyebrow">Статистика / Общая картина</p><h1>Знайте, куда<br/>движетесь.</h1><Connection/>{!loading && !error && <><section className="summary">{[['Доходы',income],['Расходы',expense],['Баланс',balance]].map(([label,value]) => <article className="panel" key={label}><h2>{label}</h2><p>{money(value)}</p></article>)}</section><section className="panel"><h2>Расходы по категориям</h2><ul className="list">{categories.filter(c => c.type === 'expense').map(category => { const sum = transactions.filter(item => item.type === 'expense' && String(item.categoryId) === String(category.id)).reduce((total,item) => total + Math.round(item.amount*100),0)/100;return <li key={category.id}><span className="text">{category.name}</span><strong>{money(sum)}</strong></li>; })}</ul></section></>}</main>;
}
