import React from 'react';
import { Card, Typography } from 'antd';
import { useAuth } from '../hooks/useAuth';

const { Title, Paragraph } = Typography;

const DashboardPage: React.FC = () => {
  const user = useAuth((s) => s.user);

  return (
    <Card variant="outlined">
      <Title level={3} style={{ marginBottom: 8 }}>Dashboard</Title>
      <Paragraph>Hoş geldin, {user?.firstName} {user?.lastName}</Paragraph>
      <Paragraph>Soldaki menüden Profil ve Krediler sayfalarına geçebilirsin.</Paragraph>
    </Card>
  );
};

export default DashboardPage;