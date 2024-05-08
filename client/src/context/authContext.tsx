import React, { createContext, useContext, useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const AuthContext = createContext<any>(null)

export const AuthProvider = ({children}: any) => {
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'given_name', 'pictureURL', 'credits', 'isLoggedIn']);
    const navigate = useNavigate();

    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {
            const login_info = await axios.post(
                `${import.meta.env.VITE_APISERVER}/auth/google`, {
                    code: codeResponse.code,
                });

            setCookie('token', login_info.data.id_token)
            setCookie('given_name', login_info.data.given_name)
            setCookie('pictureURL', login_info.data.picture)
            setCookie('isLoggedIn', true)
            navigate('/generate')
        },
        onError: errorResponse => console.error("Google Login Error: ", errorResponse),
    });

    const _isTokenExpired = () => {
        if (!cookies.token) { return false }
        const segments = cookies.token.split('.');
        var payloadSeg = segments[1];
        var payload = JSON.parse(_base64Decode(payloadSeg));
        if (payload.exp*1000 < Date.now()) {
            setCookie('isLoggedIn', false)
            navigate('/')
            return false
        }
        return true
    }

    const _base64Decode = (token: string) => {
        const base64 = token.replace(/-/g, '+').replace(/_/g, '/');
        return atob(base64)
    }

    const isAuthorized = () => {
        return _isTokenExpired()
    }

    const login = () => {
        googleLogin()
    }

    const logout = () => {
        setCookie('isLoggedIn', false)
        navigate('/')
    }

    React.useEffect(() => {
        if (!cookies.token) {
            setCookie('isLoggedIn', false)
            navigate('/')
        }
    }, [cookies])

    return (
        <AuthContext.Provider value={{ login, logout, isAuthorized }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}