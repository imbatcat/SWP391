import { useAuth } from "../Context/AuthProvider";
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import { useUser } from "../Context/UserContext";

function CheckAuth({ children, allowedRoles }) {
    console.log('banana')
    const [isAuthenticated, setIsAuthenticated] = useAuth();
    const [user, setUser] = useUser();

    const logout = async () => {
        try {
            const response = await fetch(`https://localhost:7206/api/ApplicationAuth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setIsAuthenticated(false);
            localStorage.removeItem("user");
            toast.info('You have been logged out');
        } catch (error) {
            toast.error('Error logging out!');
            console.error(error.message);
        }
    };
    const handleAuth = () => {
        if (!isAuthenticated) {
            toast.info('Please login');
            return false;
        }

        if (allowedRoles && !allowedRoles.includes(user?.role)) {
            toast.error('Access denied');
            logout();
            return false;
        }

        return true;
    }

    if (!handleAuth()) {
        switch (user?.role) {
            case 'Admin':
                return <Navigate to="/admin/customers" />;
            case 'Customer':
                return <Navigate to="/" />;
            case 'Vet':
                return <Navigate to="/login" />;
            case 'Staff':
                return <Navigate to="/login" />;
            default:
                return <Navigate to="/login" />;
        }
    }

    return (<>{children}</>);
}

export default CheckAuth;
