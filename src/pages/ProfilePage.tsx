import React from 'react';
import { Card } from 'antd';
import ProfileForm from '../components/profile/ProfileForm';

const ProfilePage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card title="My Profile" style={{ maxWidth: 720 }}>
        <ProfileForm />
      </Card>
    </div>
  );
};

export default ProfilePage;