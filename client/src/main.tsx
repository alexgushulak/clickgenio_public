import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CookiesProvider } from 'react-cookie';
import { AuthProvider } from './context/authContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <CookiesProvider defaultSetOptions={{ path: '/' }} />
            <Router>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </Router>
    </GoogleOAuthProvider>
)