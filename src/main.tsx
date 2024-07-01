import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { FileProvider } from './context/FileContext.tsx';
import { SupabaseProvider } from './context/supabaseContext.tsx';
import './index.css';
import { Toaster } from './component/ui/sonner.tsx';

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
