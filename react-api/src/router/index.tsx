import {createBrowserRouter, Outlet, RouteObject} from 'react-router-dom';
import AuthRoute from './AuthRoute';
import MainLayout from '@/Layout/MainLayout';
import {RouteItem, routesConfig} from './routesConfig';

function wrapRoutes(config: RouteItem[]): RouteObject[] {
    return config.map(route => ({
        path: route.path,
        element: (
            <AuthRoute auth={route.auth}>
                {route.element || <Outlet />}
            </AuthRoute>
        ),
        children: route.children ? wrapRoutes(route.children) : undefined
    }));
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: wrapRoutes(routesConfig)
    },
]);