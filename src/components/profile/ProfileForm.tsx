import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useAuth } from '../../hooks/useAuth';
import type { FormProps } from 'antd';

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
}

const ProfileForm: React.FC = () => {
  const user = useAuth((s) => s.user);
  const updateProfile = useAuth((s) => s.updateProfile);
  const loading = useAuth((s) => s.loading);

  const [form] = Form.useForm<ProfileFormValues>();

  React.useEffect(() => {
    form.setFieldsValue({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
    });
  }, [user, form]);

  const onFinish: FormProps<ProfileFormValues>['onFinish'] = async (values) => {
    try {
      await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
      });
      message.success('Profil güncellendi');
    } catch {
      // Hata store'da set ediliyor
    }
  };

  return (
    <Form<ProfileFormValues>
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 480 }}
    >
      <Form.Item<ProfileFormValues> label="Email" name="email">
        <Input disabled />
      </Form.Item>
      <Form.Item<ProfileFormValues>
        label="Ad"
        name="firstName"
        rules={[{ required: true, message: 'Ad zorunludur' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<ProfileFormValues>
        label="Soyad"
        name="lastName"
        rules={[{ required: true, message: 'Soyad zorunludur' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Kaydet
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProfileForm;