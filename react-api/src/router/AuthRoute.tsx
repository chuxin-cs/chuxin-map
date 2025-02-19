import React from 'react';
import { Navigate } from 'react-router-dom';

export default function AuthRoute({ children, auth }: {
    children: JSX.Element | React.ReactNode;
    auth?: string[];
}) {
    // const location = useLocation();
    // if (!localStorage.getItem('token')) {
    //     return <Navigate to="/login" state={{ from: location }} replace />;
    // }

    const role = 'admin'
    if (auth && !auth.includes(role)) {
        return <Navigate to="/403" replace />;
    }
    return children;
}