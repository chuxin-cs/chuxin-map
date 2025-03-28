import {Menu} from 'antd';
import {Link, useLocation} from 'react-router-dom';
import {routesConfig} from '@/router/routesConfig';
import {useEffect, useState} from "react";
import type {RouteItem} from "@/router/routesConfig"

function convertRoutesToMenu(
    routes: RouteItem[],
    parentPath = ''
): React.ReactNode[] {
    return routes
        .filter(route => !route.hideInMenu)
        .map(route => {
            const fullPath = `${parentPath}/${route.path}`.replace(/\/+/g, '/');

            if (route.children) {
                return (
                    <Menu.SubMenu
                        key={fullPath}
                        title={
                            <>
                                {route.icon}
                                <span>{route.name}</span>
                            </>
                        }
                    >
                        {convertRoutesToMenu(route.children, fullPath)}
                    </Menu.SubMenu>
                );
            }

            return (
                <Menu.Item key={fullPath}>
                    <Link to={fullPath}>
                        {route.icon}
                        <span>{route.name}</span>
                    </Link>
                </Menu.Item>
            );
        });
}

export default function SiderMenu() {
    const location = useLocation();
    const [openKeys, setOpenKeys] = useState<string[]>([]);

    // 自动保持展开当前路径的父级菜单
    useEffect(() => {
        const pathSnippets = location.pathname.split('/').filter(i => i);
        const newOpenKeys = pathSnippets
            .map((_, index) => `/${pathSnippets.slice(0, index + 1).join('/')}`);

        setOpenKeys(prev => [...new Set([...prev, ...newOpenKeys])]);
    }, [location]);

    return (
        <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[location.pathname]}
            openKeys={openKeys}
            onOpenChange={keys => setOpenKeys(keys as string[])}
        >
            {convertRoutesToMenu(routesConfig)}
        </Menu>
    );
}