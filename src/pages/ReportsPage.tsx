import React, { useState, useEffect } from 'react';
import { Table, Card, Button, message, Space } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { analysisService } from '../services/analysisService';
import type { AnalysisReport } from '../types/analysis';

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<AnalysisReport[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await analysisService.getAllReports();
      setReports(data);
    } catch (error) {
      message.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reportId: number) => {
    try {
      await analysisService.deleteReport(reportId);
      message.success('Report deleted successfully');
      void fetchReports();
    } catch (error) {
      message.error('Failed to delete report');
    }
  };

  const columns = [
    {
      title: 'File Name',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: 'Rows',
      key: 'rows',
      render: (_: unknown, record: AnalysisReport) => record.analysisData.rowCount,
    },
    {
      title: 'Columns',
      key: 'columns',
      render: (_: unknown, record: AnalysisReport) => record.analysisData.columns.length,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: AnalysisReport) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/reports/${record.fileId}`)}
          >
            View
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Analysis Reports">
        <Table
          columns={columns}
          dataSource={reports}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default ReportsPage;