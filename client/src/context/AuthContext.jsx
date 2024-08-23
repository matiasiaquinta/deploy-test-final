import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, registerRequest, verifyTokenRequest } from "../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    } else {
        return context;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    //para saber si ya inicio sesion
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    //para leer los errores del backend
    const [errors, setErrors] = useState([]);
    //para hacer un cargador y evitar errores
    const [loading, setLoading] = useState(true);

    //esto va a recibir los datos del usuario (registro)
    const signup = async (user) => {
        try {
            const res = await registerRequest(user);
            //console.log(res.data);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            //console.log(error);
            //console.log(error.response);
            setErrors(error.response.data);
        }
    };

    //Espera los datos para logearse (login)
    const signin = async (user) => {
        try {
            const res = await loginRequest(user);
            //console.log(res);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.log(error);
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            } else {
                setErrors([error.response.data.message]);
            }
        }
    };

    //logout
    const logout = () => {
        Cookies.remove("token");
        setIsAuthenticated(false);
        setUser(null);
    };

    //para borrar los errores a los 5 segundos
    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    //para que al recargar la web no se pierda la autenticación
    useEffect(() => {
        async function checkLogin() {
            const cookies = Cookies.get();
            //console.log(cookies);

            /*
                Aca valida si hay token.
                Si no hay -> autenticación false, usuario no hay y no esta cargando
            */
            if (!cookies.token) {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
                return;
            } else {
                /*
                    Aca es si hay token.
                    Pero si no hay datos del backend.
                    Si hay -> guarda los datos
                */
                try {
                    const res = await verifyTokenRequest(cookies.token);
                    //console.log(res);
                    if (!res.data) {
                        setIsAuthenticated(false);
                        setLoading(false);
                        return;
                    } else {
                        setIsAuthenticated(true);
                        setUser(res.data);
                        setLoading(false);
                    }
                } catch (error) {
                    //console.log(error)
                    setIsAuthenticated(false);
                    setUser(null);
                    setLoading(false);
                }
            }
        }
        checkLogin();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                //exporto las variables:
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
