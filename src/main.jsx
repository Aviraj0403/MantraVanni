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
import { toast, ToastContainer } from 'react-toastify'; // Import both toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the Toastify styles
import { queryClient } from './utils/ReactQueryClient';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ✅ Wrap App inside AuthProvider */}
    <EB>
       <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthProvider>
            <WindowContextProvider>
              <App />
               <ToastContainer position="top-center" autoClose={2000} />
            </WindowContextProvider>
          </AuthProvider>
        </PersistGate>
      </Provider>
      </QueryClientProvider>
    </EB>
  </StrictMode>
);
