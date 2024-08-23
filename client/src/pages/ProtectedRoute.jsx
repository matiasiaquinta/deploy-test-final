import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
    const { loading, isAuthenticated } = useAuth();
    //para testear
    //console.log(loading, isAuthenticated);

    if (loading) {
        return <h1>Loading...</h1>;
    } else if (!loading && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    } else {
        //Outlet -> hace que continue con el componente que esta dentro
        return <Outlet />;
    }
};

export default ProtectedRoute;
