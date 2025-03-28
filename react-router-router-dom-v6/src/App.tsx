// 组件
import Home from "@/pages/Home/index"
import About from "@/pages/About/index"
import Login from "@/pages/Login/index"
// Router
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
// UI
import { Layout, Menu } from 'antd';

// ===============================================1
// 第一个版本 自定义菜单组件
const CustomMenu = () => {
    const location = useLocation();
    // 根据当前路由设置选中的菜单项
    const selectedKey = location.pathname === '/' ? 'home' : location.pathname.slice(1);

    return (
        <Menu
            mode="horizontal"
            selectedKeys={[selectedKey]}
        >
            <Menu.Item key="home" icon={<></>}>
                <Link to="/">主页</Link>
            </Menu.Item>
            <Menu.Item key="about" icon={<></>}>
                <Link to="/about">关于</Link>
            </Menu.Item>
            <Menu.Item key="login" icon={<></>}>
                <Link to="/login">登录</Link>
            </Menu.Item>
        </Menu>
    );
};

// 主应用组件
const App1 = () => {
    return (
        <Router>
            <div>
                <CustomMenu />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
};

 export {App1};


//=====================================================================================
export const App = ()=>{
    const routes = [
        {path:"/", element: <Home />},
        {path:"/about", element: <About />},
        {path:"login", element: <Login />}
    ]

    return <>
        <Router>
            <Layout>
                <Menu mode="horizontal" items={routes.map(r => ({ label: r.path, key: r.path }))} />
                <Routes>
                    {routes.map(route=>(<Route key={route.path} element={route.element} path={route.path} />))}
                </Routes>
            </Layout>
        </Router>
    </>
}
