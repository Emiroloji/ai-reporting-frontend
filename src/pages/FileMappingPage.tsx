import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Table, Form, Input, Modal, message, Space, Tag } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined, ExperimentOutlined } from '@ant-design/icons';
import { mappingService } from '../services/mappingService';
import { analysisService } from '../services/analysisService';
import type { FileColumnMapping, CreateMappingRequest } from '../types/file';

const FileMappingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mappings, setMappings] = useState<FileColumnMapping[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fileId = id ? parseInt(id, 10) : 0;

  useEffect(() => {
    if (fileId) {
      void fetchMappings();
    }
  }, [fileId]);

  const fetchMappings = async () => {
    setLoading(true);
    try {
      const data = await mappingService.getMappings(fileId);
      setMappings(data);
    } catch (error) {
      message.error('Failed to load mappings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMapping = async (values: CreateMappingRequest) => {
    try {
      await mappingService.createMapping(fileId, values);
      message.success('Mapping added successfully');
      setModalVisible(false);
      form.resetFields();
      void fetchMappings();
    } catch (error) {
      message.error('Failed to add mapping');
    }
  };

  const handleDeleteMapping = (mappingId: number) => {
    Modal.confirm({
      title: 'Delete Mapping',
      content: 'Are you sure you want to delete this mapping?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await mappingService.deleteMapping(fileId, mappingId);
          message.success('Mapping deleted successfully');
          void fetchMappings();
        } catch (error) {
          message.error('Failed to delete mapping');
        }
      },
    });
  };

  const handleAnalyze = async () => {
    if (mappings.length === 0) {
      message.warning('Please add at least one mapping before analysis');
      return;
    }

    setAnalyzing(true);
    try {
      const result = await analysisService.analyzeFile(fileId);
      message.success('Analysis completed successfully');
      navigate(`/reports/${result.fileId}`);
    } catch (error) {
      message.error('Failed to analyze file');
    } finally {
      setAnalyzing(false);
    }
  };

  const columns = [
    {
      title: 'Source Column',
      dataIndex: 'sourceColumn',
      key: 'sourceColumn',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Target Field',
      dataIndex: 'targetField',
      key: 'targetField',
      render: (text: string) => <Tag color="green">{text}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: FileColumnMapping) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteMapping(record.id)}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/files')}
                style={{ marginRight: '16px' }}
              />
              Column Mapping Configuration
            </div>
            <Space>
              <Button
                type="default"
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
              >
                Add Mapping
              </Button>
              <Button
                type="primary"
                icon={<ExperimentOutlined />}
                loading={analyzing}
                onClick={handleAnalyze}
                disabled={mappings.length === 0}
              >
                Analyze File
              </Button>
            </Space>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={mappings}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>

      <Modal
        title="Add Column Mapping"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleAddMapping} layout="vertical">
          <Form.Item
            name="sourceColumn"
            label="Source Column"
            rules={[{ required: true, message: 'Please enter source column name' }]}
          >
            <Input placeholder="e.g., customer_name" />
          </Form.Item>
          <Form.Item
            name="targetField"
            label="Target Field"
            rules={[{ required: true, message: 'Please enter target field name' }]}
          >
            <Input placeholder="e.g., customerName" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FileMappingPage;
