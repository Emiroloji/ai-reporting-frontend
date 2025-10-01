import React from 'react';
import { Card, Statistic, Row, Col, Button, message } from 'antd';
import { creditService } from '../services/creditService';
import CreditHistoryTable from '../components/credits/CreditHistoryTable';
import type { UserCredits, CreditTransaction } from '../types/credits';

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === 'object' && err !== null) {
    const maybe = err as { response?: { data?: { message?: string } } };
    const msg = maybe.response?.data?.message;
    if (typeof msg === 'string' && msg) return msg;
  }
  return 'Beklenmeyen hata';
};

const CreditsPage: React.FC = () => {
  const [credits, setCredits] = React.useState<UserCredits | null>(null);
  const [history, setHistory] = React.useState<CreditTransaction[]>([]);
  const [loading, setLoading] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [c, h] = await Promise.all([
        creditService.getCredits(),
        creditService.getCreditHistory(),
      ]);
      setCredits(c);
      setHistory(h);
    } catch (e: unknown) {
      message.error(getErrorMessage(e) || 'Kredi bilgisi alınamadı');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const handleUseOne = async () => {
    try {
      await creditService.useCredits({ amount: 1, reason: 'Demo işlem' });
      message.success('1 kredi kullanıldı');
      await load();
    } catch (e: unknown) {
      message.error(getErrorMessage(e) || 'Kredi kullanımı başarısız');
    }
  };

  return (
    <div style={{ padding: 0 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="Kredi Durumu" variant="outlined" loading={loading}>
            <Row gutter={16}>
              <Col span={8}><Statistic title="Toplam" value={credits?.total ?? 0} /></Col>
              <Col span={8}><Statistic title="Kullanılan" value={credits?.used ?? 0} /></Col>
              <Col span={8}><Statistic title="Kalan" value={credits?.remaining ?? 0} /></Col>
            </Row>
            <Button type="primary" style={{ marginTop: 16 }} onClick={handleUseOne}>
              1 Kredi Kullan
            </Button>
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card title="Kredi Geçmişi" variant="outlined">
            <CreditHistoryTable data={history} loading={loading} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreditsPage;