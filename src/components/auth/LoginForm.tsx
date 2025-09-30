import React from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { LoginRequest } from '../../types/auth';

type FieldType = {
  email?: string;      // form alanı olarak bunu kullan
  username?: string;   // yanlışlıkla username kullanırsanız fallback olacak
  password?: string;
  remember?: boolean;
};

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const loading = useAuth((s) => s.loading);
  const error = useAuth((s) => s.error);
  const login = useAuth((s) => s.login);

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    // email yoksa username'i email olarak kullan (yanlış alan adı ihtimaline karşı)
    const payload: LoginRequest = {
      email: (values.email ?? values.username ?? '').trim(),
      password: values.password ?? '',
    };

    // Debug için: Network > Payload ile kıyaslayın
    // console.log('Login payload:', payload);

    try {
      await login(payload);
      navigate('/', { replace: true });
    } catch {
      // Hata store'da set ediliyor; Alert ile gösteriyoruz
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = () => {
    // Validation hataları
  };

  return (
    <Form
      name="login"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 520, width: '100%' }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {error && (
        <Form.Item wrapperCol={{ span: 24 }}>
          <Alert type="error" message={error} showIcon />
        </Form.Item>
      )}

      <Form.Item<FieldType>
        label="Email"
        name="email" // ÖNEMLİ: backend email bekliyor
        rules={[
          { required: true, message: 'Lütfen email adresinizi girin!' },
          { type: 'email', message: 'Geçerli bir email adresi girin!' },
        ]}
      >
        <Input placeholder="email@example.com" />
      </Form.Item>

      <Form.Item<FieldType>
        label="Şifre"
        name="password"
        rules={[{ required: true, message: 'Lütfen şifrenizi girin!' }]}
      >
        <Input.Password placeholder="••••••••" />
      </Form.Item>

      <Form.Item<FieldType> name="remember" valuePropName="checked" label={null} wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>Beni hatırla</Checkbox>
      </Form.Item>

      <Form.Item label={null} wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Giriş Yap
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;