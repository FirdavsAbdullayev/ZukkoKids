import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { UserProvider } from './hooks/useUser';
import { StreakProvider } from './hooks/useStreak';
import { ShopProvider } from './hooks/useShop';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <StreakProvider>
          <ShopProvider>
            <App />
          </ShopProvider>
        </StreakProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
