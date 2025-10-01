import React from 'react';
import { Form, Input, Button, Upload, Alert, message, Card } from 'antd';
import type { UploadProps, FormProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { reportService } from '../../services/reportService.ts';
import type { ReportCreateRequest } from '../../types/report';
import { useNavigate } from 'react-router-dom';

interface FormValues {
  name: string;
  prompt?: string;
  file?: File;
}

const { Dragger } = Upload;

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'object' && err !== null) {
    const maybe = err as { response?: { data?: { message?: string } } };
    const msg = maybe.response?.data?.message;
    if (typeof msg === 'string' && msg) return msg;
  }
  return 'Rapor oluşturulamadı';
}

const NewReportForm: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const [file, setFile] = React.useState<File | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const uploadProps: UploadProps = {
    multiple: false,
    maxCount: 1,
    beforeUpload: () => false, // otomatik upload yapma, biz handle edeceğiz
    onRemove: () => {
      setFile(undefined);
    },
    onChange: (info) => {
      const f = info.fileList[0]?.originFileObj as File | undefined;
      setFile(f);
    },
  };

  const onFinish: FormProps<FormValues>['onFinish'] = async (values) => {
    setError(null);
    setLoading(true);
    try {
      const payload: ReportCreateRequest = {
        name: values.name.trim(),
        prompt: values.prompt?.trim(),
      };
      // 1) Rapor kaydını oluştur
      const created = await reportService.create(payload);

      // 2) Dosya varsa yükle
      if (file) {
        await reportService.uploadFile(created.id, file);
      }

      message.success('Rapor kuyruğa alındı');
      // 3) Detay sayfasına yönlendir
      navigate(`/reports/${created.id}`, { replace: true });
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Yeni Rapor Oluştur" variant="outlined">
      {error && (
        <Alert style={{ marginBottom: 16 }} type="error" message={error} showIcon />
      )}
      <Form<FormValues>
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 720 }}
      >
        <Form.Item<FormValues>
          label="Rapor Adı"
          name="name"
          rules={[{ required: true, message: 'Rapor adı zorunludur' }]}
        >
          <Input placeholder="Örn: Haftalık Satış Analizi" />
        </Form.Item>

        <Form.Item<FormValues> label="Prompt (opsiyonel)" name="prompt">
          <Input.TextArea
            placeholder="Rapor için yönlendirme/prompt (opsiyonel)"
            rows={4}
          />
        </Form.Item>

        <Form.Item label="Dosya (CSV/Excel) - opsiyonel">
          <Dragger {...uploadProps} accept=".csv,.xlsx,.xls">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Dosyanızı buraya sürükleyip bırakın ya da tıklayıp seçin
            </p>
            <p className="ant-upload-hint">
              Tek dosya yükleyin. CSV ya da Excel tercih edilir.
            </p>
          </Dragger>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Oluştur
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default NewReportForm;