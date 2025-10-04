import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, message } from 'antd';
import { FileOutlined, LineChartOutlined, DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { fileService } from '../services/fileService';
import { analysisService } from '../services/analysisService';
import { creditService } from '../services/creditService';

const DashboardPage: React.FC = () => {
  const user = useAuth((s) => s.user);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalReports: 0,
    credits: 0,
    recentFiles: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [files, reports, creditData] = await Promise.all([
        fileService.getMyFiles(),
        analysisService.getAllReports(),
        creditService.getMyCredits(),
      ]);

      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const recentFiles = files.filter(
        (f) => new Date(f.uploadedAt) > lastWeek
      ).length;

      setStats({
        totalFiles: files.length,
        totalReports: reports.length,
        credits: creditData.balance,
        recentFiles,
      });
    } catch (error) {
      message.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>
        Welcome, {user?.firstName} {user?.lastName}
      </h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Files"
              value={stats.totalFiles}
              prefix={<FileOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Analysis Reports"
              value={stats.totalReports}
              prefix={<LineChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Available Credits"
              value={stats.credits}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Recent Files (Last 7 Days)"
              value={stats.recentFiles}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: '24px' }} title="Quick Actions">
        <p>Get started with your AI reporting platform:</p>
        <ul>
          <li>Upload files for analysis</li>
          <li>Configure column mappings for your data</li>
          <li>Run AI-powered analysis on your files</li>
          <li>View and download analysis reports</li>
        </ul>
      </Card>
    </div>
  );
};

export default DashboardPage;