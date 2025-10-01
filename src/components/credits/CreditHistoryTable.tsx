import React from 'react';
import { Table, Tag } from 'antd';
import type { CreditTransaction } from '../../types/credits';

interface Props {
  data: CreditTransaction[];
  loading?: boolean;
}

const CreditHistoryTable: React.FC<Props> = ({ data, loading }) => {
  return (
    <Table
      rowKey="id"
      loading={loading}
      dataSource={data}
      pagination={{ pageSize: 10 }}
      columns={[
        { title: 'Tarih', dataIndex: 'createdAt', key: 'createdAt' },
        { title: 'Açıklama', dataIndex: 'description', key: 'description' },
        { title: 'Tutar', dataIndex: 'amount', key: 'amount' },
        {
          title: 'Tür',
          dataIndex: 'type',
          key: 'type',
          render: (t) => <Tag color={t === 'use' ? 'red' : 'green'}>{t}</Tag>,
        },
      ]}
    />
  );
};

export default CreditHistoryTable;