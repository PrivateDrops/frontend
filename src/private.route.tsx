import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context"

const PrivateRoute = () => {
    const { accessToken } = useAuth();
    if(!accessToken) return <Navigate to="/login" />;
    return <Outlet />;
}

export default PrivateRoute;