import React from 'react';
import { Card, Descriptions, Tag, Space, Button, Result, message } from 'antd';
import { useParams } from 'react-router-dom';
import { reportService } from '../services/reportService';
import type { Report } from '../types/report';

const statusColor: Record<Report['status'], string> = {
  queued: 'default',
  processing: 'blue',
  completed: 'green',
  failed: 'red',
};

const POLL_MS = 2000;

const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = React.useState<Report | null>(null);
  const [loading, setLoading] = React.useState(false);

  const load = React.useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const r = await reportService.get(id);
      setReport(r);
    } catch {
      message.error('Rapor bilgisi alınamadı');
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    void load();
  }, [load]);

  // Polling: processing/queued ise periyodik kontrol
  React.useEffect(() => {
    if (!report) return;
    if (report.status === 'completed' || report.status === 'failed') return;
    const t = setInterval(() => {
      void load();
    }, POLL_MS);
    return () => clearInterval(t);
  }, [report, load]);

  if (!report) return <Card loading />;

  if (report.status === 'failed') {
    return (
      <Result
        status="error"
        title="Rapor başarısız"
        subTitle={report.errorMessage ?? 'Bilinmeyen hata'}
        extra={
          <Space>
            <Button onClick={() => void load()}>Tekrar Dene</Button>
          </Space>
        }
      />
    );
  }

  return (
    <Card title={`Rapor #${report.id}`} loading={loading}>
      <Descriptions column={1} bordered size="middle">
        <Descriptions.Item label="Ad">{report.name}</Descriptions.Item>
        <Descriptions.Item label="Durum">
          <Tag color={statusColor[report.status]}>{report.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Kredi">
          {report.creditsUsed ?? '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Oluşturulma">
          {report.createdAt}
        </Descriptions.Item>
        {report.prompt && (
          <Descriptions.Item label="Prompt">
            <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{report.prompt}</pre>
          </Descriptions.Item>
        )}
      </Descriptions>

      <Space style={{ marginTop: 16 }}>
        <Button
          type="primary"
          disabled={report.status !== 'completed'}
          onClick={() => reportService.download(report.id)}
        >
          Çıktıyı İndir
        </Button>
        <Button onClick={() => void load()}>Yenile</Button>
      </Space>
    </Card>
  );
};

export default ReportDetailPage;