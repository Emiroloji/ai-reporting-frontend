import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Button, message, Modal, Form, InputNumber, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { creditService } from '../services/creditService';
import CreditHistoryTable from '../components/credits/CreditHistoryTable';
import type { CreditBalance, CreditTransaction, AddCreditRequest } from '../types/credits';

const CreditsPage: React.FC = () => {
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [history, setHistory] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const [creditData, historyData] = await Promise.all([
        creditService.getMyCredits(),
        creditService.getCreditHistory(),
      ]);
      setBalance(creditData);
      setHistory(historyData);
    } catch (error) {
      message.error('Failed to load credit information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleAddCredits = async (values: AddCreditRequest) => {
    try {
      await creditService.addCredits(values);
      message.success('Credits added successfully');
      setModalVisible(false);
      form.resetFields();
      void load();
    } catch (error) {
      message.error('Failed to add credits');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card
            title="Credit Balance"
            loading={loading}
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
              >
                Add Credits
              </Button>
            }
          >
            <Statistic
              title="Available Credits"
              value={balance?.balance ?? 0}
              valueStyle={{ color: '#3f8600' }}
            />
            <p style={{ marginTop: '16px', color: '#666' }}>
              Last updated: {balance?.lastUpdated ? new Date(balance.lastUpdated).toLocaleString() : '-'}
            </p>
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card title="Credit History">
            <CreditHistoryTable data={history} loading={loading} />
          </Card>
        </Col>
      </Row>

      <Modal
        title="Add Credits"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleAddCredits} layout="vertical">
          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              { required: true, message: 'Please enter amount' },
              { type: 'number', min: 1, message: 'Amount must be at least 1' },
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Optional description" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Credits
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreditsPage;