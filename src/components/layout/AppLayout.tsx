import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const { Header, Content } = Layout;

const AppLayout: React.FC = () => {
  const path = useLocation().pathname;
  const logout = useAuth((s) => s.logout);
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();

  const items = [
    { key: '/', label: <Link to="/">Dashboard</Link> },
    { key: '/reports', label: <Link to="/reports">Raporlar</Link> },
    { key: '/profile', label: <Link to="/profile">Profil</Link> },
    { key: '/credits', label: <Link to="/credits">Krediler</Link> },
  ];

  const selected =
    items.find((i) => (i.key === '/' ? path === '/' : path.startsWith(i.key)))?.key || '/';

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Header style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ color: '#fff', fontWeight: 600, marginRight: 24 }}>AI Raporlama</div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selected]}
          items={items}
          style={{ flex: 1 }}
        />
        <div style={{ color: '#fff', marginRight: 12 }}>
          {user?.firstName} {user?.lastName}
        </div>
        <Button
          onClick={() => {
            logout();
            navigate('/login', { replace: true });
          }}
        >
          Çıkış
        </Button>
      </Header>
      <Content style={{ padding: 24 }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AppLayout;