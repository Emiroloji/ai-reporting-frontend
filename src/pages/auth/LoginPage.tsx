// src/pages/auth/LoginPage.tsx

import React from 'react';
import { Row, Col, Card } from 'antd';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100%',
      background: '#f0f2f5',
      margin: 0,
      padding: 0
    }}>
      <Row 
        style={{ 
          minHeight: '100vh',
          width: '100%',
          margin: 0
        }} 
        align="middle"
        gutter={0}
      >
        {/* Sol taraf - SVG İllüstrasyon */}
        <Col 
          xs={0} 
          sm={0} 
          md={12} 
          lg={14} 
          xl={14}
          style={{ background: '#f0f2f5' }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100vh',
            padding: '48px',
            background: '#f0f2f5'
          }}>
            <svg
              width="100%"
              height="auto"
              viewBox="0 0 500 400"
              style={{ maxWidth: '500px' }}
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Arka plan daireler */}
              <circle cx="250" cy="200" r="180" fill="#e6f4ff" opacity="0.3" />
              <circle cx="250" cy="200" r="140" fill="#bae0ff" opacity="0.3" />
              
              {/* Bilgisayar ekranı */}
              <rect x="150" y="120" width="200" height="140" rx="8" fill="#1890ff" />
              <rect x="160" y="130" width="180" height="110" fill="#ffffff" />
              
              {/* Ekrandaki form simülasyonu */}
              <rect x="175" y="145" width="150" height="12" rx="4" fill="#f0f0f0" />
              <rect x="175" y="165" width="150" height="12" rx="4" fill="#f0f0f0" />
              <rect x="175" y="185" width="100" height="12" rx="4" fill="#1890ff" />
              
              {/* Bilgisayar tabanı */}
              <rect x="230" y="260" width="40" height="30" fill="#8c8c8c" />
              <ellipse cx="250" cy="290" rx="80" ry="8" fill="#d9d9d9" />
              
              {/* Kilit ikonu */}
              <circle cx="250" cy="80" r="25" fill="#52c41a" opacity="0.2" />
              <rect x="240" y="70" width="20" height="15" rx="10" fill="none" stroke="#52c41a" strokeWidth="3" />
              <rect x="238" y="80" width="24" height="20" rx="3" fill="#52c41a" />
              <circle cx="250" cy="90" r="3" fill="#ffffff" />
              
              {/* Dekoratif elementler */}
              <circle cx="80" cy="100" r="15" fill="#ffd666" opacity="0.6" />
              <circle cx="420" cy="300" r="20" fill="#ff7875" opacity="0.6" />
              <circle cx="400" cy="120" r="12" fill="#95de64" opacity="0.6" />
            </svg>
          </div>
        </Col>

        {/* Sağ taraf - Login Form */}
        <Col 
          xs={24} 
          sm={24} 
          md={12} 
          lg={10} 
          xl={10}
          style={{ background: '#f0f2f5' }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: '24px',
            minHeight: '100vh',
            background: '#f0f2f5'
          }}>
            <Card
              title="Giriş Yap"
              bordered
              style={{ 
                width: '100%', 
                maxWidth: '420px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
            >
              <LoginForm />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;