import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store, persistor } from './store/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import EB from './pages/PNF/EB.jsx';
import { AuthProvider } from './context/AuthContext';
import WindowContextProvider from './context/windowContext.jsx';
import { Toaster } from 'react-hot-toast';
import { cleanupStalePaymentData } from './utils/paymentStorage';
import { queryClient } from './utils/ReactQueryClient';
import SpiritualLoader from './components/SpiritualLoader.jsx';

// Drop any payment/shipping-address data left over from an abandoned checkout (>15 min old).
cleanupStalePaymentData();
try {
  localStorage.removeItem('pendingPaymentData');
  localStorage.removeItem('pendingCartData');
} catch { /* storage unavailable */ }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ✅ Wrap App inside AuthProvider */}
    <EB>
       <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={<SpiritualLoader />} persistor={persistor}>
          <AuthProvider>
            <WindowContextProvider>
              <App />
               <Toaster position="top-center" toastOptions={{ duration: 3000 }} containerStyle={{ zIndex: 99999 }} />
            </WindowContextProvider>
          </AuthProvider>
        </PersistGate>
      </Provider>
      </QueryClientProvider>
    </EB>
  </StrictMode>
);
