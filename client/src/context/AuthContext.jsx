import { createContext, useContext, useEffect, useState } from "react";
import {
    loginRequest,
    registerRequest,
    verifyTokenRequest,
    logoutRequest,
} from "../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    const signup = async (user) => {
        try {
            const res = await registerRequest(user);
            // Guarda el token en localStorage
            localStorage.setItem("token", res.data.token);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            setErrors(error.response ? error.response.data : [error.message]);
        }
    };

    const signin = async (user) => {
        try {
            const res = await loginRequest(user);
            // Guarda el token en localStorage
            localStorage.setItem("token", res.data.token);
            // Sincroniza el token con las cookies del backend
            await syncTokenWithCookies(res.data.token);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            setErrors(error.response ? error.response.data : [error.message]);
        }
    };

    const logout = async () => {
        try {
            await logoutRequest();
            // Elimina el token del localStorage
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            setUser(null);
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const syncTokenWithCookies = async (token) => {
        try {
            await axios.post(
                "/api/auth/sync-token",
                { token },
                { withCredentials: true }
            );
        } catch (error) {
            console.error("Error syncing token with cookies:", error);
        }
    };

    useEffect(() => {
        async function checkLogin() {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const res = await verifyTokenRequest();
                setIsAuthenticated(true);
                setUser(res.data);
            } catch (error) {
                console.error("Error verifying token:", error);
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        checkLogin();
    }, []);

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    return (
        <AuthContext.Provider
            value={{
                signup,
                signin,
                logout,
                loading,
                user,
                isAuthenticated,
                errors,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
