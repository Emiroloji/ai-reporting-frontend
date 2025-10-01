import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" id="visual" viewBox="0 0 900 600" width="900" height="600" version="1.1"><rect x="0" y="0" width="900" height="600" fill="#002233"/><path d="M259 0L263.8 7.7C268.7 15.3 278.3 30.7 275.5 46C272.7 61.3 257.3 76.7 243 92C228.7 107.3 215.3 122.7 203.2 138.2C191 153.7 180 169.3 184.7 184.8C189.3 200.3 209.7 215.7 231.3 231C253 246.3 276 261.7 283.3 277C290.7 292.3 282.3 307.7 288.2 323C294 338.3 314 353.7 292.2 369C270.3 384.3 206.7 399.7 186.3 415.2C166 430.7 189 446.3 186 461.8C183 477.3 154 492.7 172.3 508C190.7 523.3 256.3 538.7 266.8 554C277.3 569.3 232.7 584.7 210.3 592.3L188 600L0 600L0 592.3C0 584.7 0 569.3 0 554C0 538.7 0 523.3 0 508C0 492.7 0 477.3 0 461.8C0 446.3 0 430.7 0 415.2C0 399.7 0 384.3 0 369C0 353.7 0 338.3 0 323C0 307.7 0 292.3 0 277C0 261.7 0 246.3 0 231C0 215.7 0 200.3 0 184.8C0 169.3 0 153.7 0 138.2C0 122.7 0 107.3 0 92C0 76.7 0 61.3 0 46C0 30.7 0 15.3 0 7.7L0 0Z" fill="#0066FF" stroke-linecap="round" stroke-linejoin="miter"/></svg>`;
const bgUrl = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

const RegisterPage: React.FC = () => {
  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        margin: 0,
        padding: 0,
        backgroundImage: bgUrl,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Row style={{ height: '100%', width: '100%', margin: 0 }} align="middle" justify="end" gutter={0}>
        <Col xs={0} sm={0} md={14} lg={16} xl={16} style={{ height: '100%' }} />
        <Col xs={24} sm={24} md={10} lg={8} xl={8} style={{ height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 24, height: '100%' }}>
            <Card title="Kayıt Ol" variant="outlined" style={{ width: '100%', maxWidth: 480, marginLeft: 'auto' }}>
              <RegisterForm />
              <Typography.Paragraph style={{ marginTop: 16 }}>
                Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
              </Typography.Paragraph>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterPage;