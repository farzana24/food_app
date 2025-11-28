import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RoleBasedRedirect() {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Redirect based on user role
    if (user?.role === 'ADMIN') {
        return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/dashboard" replace />;
}

export default RoleBasedRedirect;
