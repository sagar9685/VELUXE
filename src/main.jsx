import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { MarketplaceProvider } from './context/MarketplaceContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MarketplaceProvider>
        <App />
      </MarketplaceProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
