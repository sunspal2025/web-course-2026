import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../../task10/src/style.css';
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
