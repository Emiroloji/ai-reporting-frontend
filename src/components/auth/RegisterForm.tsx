import React from 'react';
import { Button, Form, Input, Alert, message } from 'antd';
import type { FormProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import type { RegisterRequest } from '../../types/auth';

interface RegisterValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'object' && err !== null) {
    const maybe = err as { response?: { data?: { message?: string } } };
    const msg = maybe.response?.data?.message;
    if (typeof msg === 'string' && msg) return msg;
  }
  return 'Beklenmeyen hata';
}

const RegisterForm: React.FC = () => {
  const [form] = Form.useForm<RegisterValues>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const onFinish: FormProps<RegisterValues>['onFinish'] = async (values) => {
    setError(null);
    setLoading(true);
    const payload: RegisterRequest = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      password: values.password,
    };
    try {
      await authService.register(payload);
      message.success('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.');
      navigate('/login', { replace: true });
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<RegisterValues>
      form={form}
      name="register"
      layout="vertical"
      style={{ maxWidth: 520, width: '100%' }}
      onFinish={onFinish}
      autoComplete="off"
    >
      {error && (
        <Form.Item>
          <Alert type="error" message={error} showIcon />
        </Form.Item>
      )}

      <Form.Item<RegisterValues>
        label="Ad"
        name="firstName"
        rules={[{ required: true, message: 'Ad zorunludur' }]}
      >
        <Input placeholder="Adınız" />
      </Form.Item>

      <Form.Item<RegisterValues>
        label="Soyad"
        name="lastName"
        rules={[{ required: true, message: 'Soyad zorunludur' }]}
      >
        <Input placeholder="Soyadınız" />
      </Form.Item>

      <Form.Item<RegisterValues>
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Email zorunludur' },
          { type: 'email', message: 'Geçerli bir email giriniz' },
        ]}
      >
        <Input placeholder="email@example.com" />
      </Form.Item>

      <Form.Item<RegisterValues>
        label="Şifre"
        name="password"
        rules={[{ required: true, message: 'Şifre zorunludur' }, { min: 6, message: 'En az 6 karakter' }]}
      >
        <Input.Password placeholder="••••••••" />
      </Form.Item>

      <Form.Item<RegisterValues>
        label="Şifre (Tekrar)"
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Şifre tekrar zorunludur' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) return Promise.resolve();
              return Promise.reject(new Error('Şifreler eşleşmiyor'));
            },
          }),
        ]}
      >
        <Input.Password placeholder="••••••••" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Kayıt Ol
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;