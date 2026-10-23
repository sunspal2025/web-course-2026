import {useState} from 'react';
/** @param {{onAdd: (text: string) => void}} props */
export default function TodoForm({onAdd}) {
  const [text,setText] = useState(''); const [error,setError] = useState('');
  function submit(event) {
    event.preventDefault(); const value = text.trim();
    if (!value) { setError('Введите текст задачи.'); return; }
    onAdd(value); setText(''); setError('');
  }
  return <><form onSubmit={submit} noValidate><label htmlFor="task-input">Новая задача</label><input id="task-input" value={text} onChange={event => setText(event.target.value)} placeholder="Что нужно сделать?" maxLength={500} aria-invalid={Boolean(error)} aria-describedby="form-error"/><button>Добавить</button></form><p id="form-error" role="alert" className="error">{error}</p></>;
}
