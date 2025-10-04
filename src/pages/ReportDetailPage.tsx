import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Table, Button, message, Spin, Tag } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { analysisService } from '../services/analysisService';
import type { AnalysisReport } from '../types/analysis';

const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      void fetchReport(parseInt(id, 10));
    }
  }, [id]);

  const fetchReport = async (fileId: number) => {
    setLoading(true);
    try {
      const data = await analysisService.getReport(fileId);
      setReport(data);
    } catch (error) {
      message.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!report) {
    return <Card>No report found</Card>;
  }

  const statisticsData = Object.entries(report.analysisData.statistics).map(([col, stats]) => ({
    key: col,
    column: col,
    ...stats,
  }));

  const statisticsColumns = [
    { title: 'Column', dataIndex: 'column', key: 'column', fixed: 'left' as const },
    { title: 'Count', dataIndex: 'count', key: 'count' },
    { title: 'Mean', dataIndex: 'mean', key: 'mean', render: (v?: number) => v?.toFixed(2) || '-' },
    { title: 'Std', dataIndex: 'std', key: 'std', render: (v?: number) => v?.toFixed(2) || '-' },
    { title: 'Min', dataIndex: 'min', key: 'min', render: (v?: number) => v?.toFixed(2) || '-' },
    { title: 'Max', dataIndex: 'max', key: 'max', render: (v?: number) => v?.toFixed(2) || '-' },
    { title: 'Unique', dataIndex: 'uniqueValues', key: 'uniqueValues' },
    { title: 'Nulls', dataIndex: 'nullCount', key: 'nullCount' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <div>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/reports')}
              style={{ marginRight: '16px' }}
            />
            Analysis Report
          </div>
        }
      >
        <Descriptions column={2} bordered style={{ marginBottom: '24px' }}>
          <Descriptions.Item label="File Name">{report.fileName}</Descriptions.Item>
          <Descriptions.Item label="Total Rows">{report.analysisData.rowCount}</Descriptions.Item>
          <Descriptions.Item label="Columns">{report.analysisData.columns.length}</Descriptions.Item>
          <Descriptions.Item label="Created">{new Date(report.createdAt).toLocaleString()}</Descriptions.Item>
        </Descriptions>

        <h3>Columns</h3>
        <div style={{ marginBottom: '24px' }}>
          {report.analysisData.columns.map((col) => (
            <Tag key={col} color="blue" style={{ margin: '4px' }}>
              {col}
            </Tag>
          ))}
        </div>

        <h3>Statistics</h3>
        <Table
          columns={statisticsColumns}
          dataSource={statisticsData}
          pagination={false}
          scroll={{ x: 'max-content' }}
          size="small"
          style={{ marginBottom: '24px' }}
        />

        {report.analysisData.summary && (
          <>
            <h3>Summary</h3>
            <p>{report.analysisData.summary}</p>
          </>
        )}

        {report.analysisData.insights && report.analysisData.insights.length > 0 && (
          <>
            <h3>Insights</h3>
            <ul>
              {report.analysisData.insights.map((insight, idx) => (
                <li key={idx}>{insight}</li>
              ))}
            </ul>
          </>
        )}
      </Card>
    </div>
  );
};

export default ReportDetailPage;