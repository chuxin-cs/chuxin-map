import React from "react";
import DashboardPage from "@/pages/DashboardPage";
import UseStatePage from "@/pages/Hooks/UseState";
import {DashboardOutlined, UserOutlined} from '@ant-design/icons';

// 定义路由的描述类型
export interface RouteItem {
    path: string;
    name: string;
    icon?: React.ReactNode;
    element?: React.ReactNode | JSX.Element,
    hideInMenu?: boolean;
    auth?: string[];
    children?: RouteItem[]
}

export const routesConfig: RouteItem[] = [
    {
        path: "/dashboard",
        name: "控制台",
        icon: <DashboardOutlined/>,
        element: <DashboardPage/>,
        auth: ['admin', 'user']
    },
    {
        path: "/hooks",
        name: "控制台",
        icon: <UserOutlined/>,
        auth: ['admin'],
        children: [
            {
                path: "/useState",
                name: "useState",
                element: <UseStatePage/>,
            }
        ]
    }
]