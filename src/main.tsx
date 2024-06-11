import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SupabaseProvider } from './context/supabaseContext.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { FileProvider } from './context/FileContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SupabaseProvider>
      <BrowserRouter>
        <FileProvider>
          <App />
          <Toaster />
        </FileProvider>
      </BrowserRouter>
    </SupabaseProvider>
  </React.StrictMode>,
);
