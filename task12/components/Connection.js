'use client';
import {useFinance} from './FinanceProvider';
export default function Connection() {
 const {loading,error,load} = useFinance();
 return <>{loading && <p role="status">Загрузка…</p>}{error && <section className="panel"><p className="error" role="alert">{error}</p><button onClick={load}>Повторить подключение</button></section>}</>;
}
