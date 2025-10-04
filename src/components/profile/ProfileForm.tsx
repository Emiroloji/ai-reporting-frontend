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
      message.success('Profile updated successfully');
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
        label="First Name"
        name="firstName"
        rules={[{ required: true, message: 'First name is required' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<ProfileFormValues>
        label="Last Name"
        name="lastName"
        rules={[{ required: true, message: 'Last name is required' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save
        </Button>
      </Form.Item>
    </Form>
  )
  );
};

export default ProfileForm;