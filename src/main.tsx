import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { TenantProvider } from './context/TenantContext';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <TenantProvider>
          <App />
        </TenantProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
