import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './redux/auth.jsx';
import { ProductProvider } from './redux/Productprovider.jsx';




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductProvider>
  <AuthProvider>
    <App />
    <ToastContainer autoClose={3000} position="top-right"/>
    </AuthProvider>
    </ProductProvider>
  </StrictMode>,
)
