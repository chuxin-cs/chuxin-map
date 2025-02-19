import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';

// 定义不同的页面组件
const Home = () => <div>这是主页</div>;
const About = () => <div>这是关于页面</div>;
const Contact = () => <div>这是联系我们页面</div>;

// 自定义菜单组件
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
            <Menu.Item key="contact" icon={<></>}>
                <Link to="/contact">联系我们</Link>
            </Menu.Item>
        </Menu>
    );
};

// 主应用组件
const App = () => {
    return (
        <Router>
            <div>
                <CustomMenu />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </div>
        </Router>
    );
};

 export default App;