    import { createContext, useState, useContext, useEffect } from 'react'
    import { userAPI } from '../services/api'

    const AuthContext = createContext(null)

    export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Check if user is already logged in on mount
    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
        const userData = await userAPI.getMe()
        setUser(userData)
        } catch (error) {
        setUser(null)
        } finally {
        setLoading(false)
        }
    }

    const login = async (email, password) => {
        try {
        const response = await userAPI.login(email, password)
        setUser(response.user)
        return { success: true }
        } catch (error) {
        return {
            success: false,
            error: error.message || 'Login failed'
        }
        }
    }

    const register = async (name, email, password) => {
        try {
        await userAPI.register(name, email, password)
        // Auto-login after registration
        // return await login(email, password)
        return { success: true }
        } catch (error) {
        return {
            success: false,
            error: error.message || 'Registration failed'
        }
        }
    }

    const logout = async () => {
        try {
        await userAPI.logout()
        setUser(null)
        } catch (error) {
        console.error('Logout error:', error)
        }
    }

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    }

    export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
    }