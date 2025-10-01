import React from 'react';
import { Card } from 'antd';
import ProfileForm from '../components/profile/ProfileForm';

const ProfilePage: React.FC = () => {
  return (
    <Card title="Profilim" variant="outlined" style={{ maxWidth: 720 }}>
      <ProfileForm />
    </Card>
  );
};

export default ProfilePage;