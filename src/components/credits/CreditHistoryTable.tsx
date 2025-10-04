import React from 'react';
import { Table, Tag } from 'antd';
import type { CreditTransaction } from '../../types/credits';

interface Props {
  data: CreditTransaction[];
  loading?: boolean;
}

const typeColors: Record<string, string> = {
  PURCHASE: 'green',
  USAGE: 'red',
  REFUND: 'blue',
  BONUS: 'gold',
};

const CreditHistoryTable: React.FC<Props> = ({ data, loading }) => {
  return (
    <Table
      rowKey="id"
      loading={loading}
      dataSource={data}
      pagination={{ pageSize: 10 }}
      columns={[
        {
          title: 'Date',
          dataIndex: 'createdAt',
          key: 'createdAt',
          render: (date: string) => new Date(date).toLocaleString(),
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
          render: (amount: number, record: CreditTransaction) => {
            const sign = record.type === 'USAGE' ? '-' : '+';
            return `${sign}${amount}`;
          },
        },
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
          render: (type: string) => (
            <Tag color={typeColors[type] || 'default'}>{type}</Tag>
          ),
        },
        {
          title: 'Balance After',
          dataIndex: 'balanceAfter',
          key: 'balanceAfter',
        },
      ]}
    />
  );
};

export default CreditHistoryTable;