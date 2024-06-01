import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SupabaseProvider } from './context/supabaseContext.tsx';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SupabaseProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </SupabaseProvider>
  </React.StrictMode>,
);
