import {Layout} from 'antd';
import SiderMenu from './SiderMenu';
import {Outlet} from "react-router-dom";
import {useState} from "react";

const {Content, Sider} = Layout;

function Header() {
    return <>
        <div>11</div>
    </>
}

export default function MainLayout() {
    const [collapsed] = useState(false);

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider collapsed={collapsed} trigger={null}>
                <SiderMenu/>
            </Sider>
            <Layout>
                <Header/>
                <Content style={{margin: '24px 16px'}}>
                    <Outlet/> {/* 路由出口 */}
                </Content>
            </Layout>
        </Layout>
    );
}