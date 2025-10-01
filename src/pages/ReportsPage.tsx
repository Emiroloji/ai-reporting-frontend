import React from 'react';
import { Row, Col } from 'antd';
import NewReportForm from '../components/reports/NewReportForm';
import ReportList from '../components/reports/ReportList';

const ReportsPage: React.FC = () => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={10}>
          <NewReportForm />
        </Col>
        <Col xs={24} lg={14}>
          <ReportList />
        </Col>
      </Row>
    </div>
  );
};

export default ReportsPage;