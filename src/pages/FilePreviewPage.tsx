import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Card, Button, message, Spin } from 'antd';
import { ArrowLeftOutlined, ExperimentOutlined } from '@ant-design/icons';
import { fileService } from '../services/fileService';
import type { FilePreview } from '../types/file';

const FilePreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [preview, setPreview] = useState<FilePreview | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      void fetchPreview(parseInt(id, 10));
    }
  }, [id]);

  const fetchPreview = async (fileId: number) => {
    setLoading(true);
    try {
      const data = await fileService.previewFile(fileId);
      setPreview(data);
    } catch (error) {
      message.error('Failed to load file preview');
    } finally {
      setLoading(false);
    }
  };

  const columns = preview?.columns.map((col) => ({
    title: col,
    dataIndex: col,
    key: col,
    ellipsis: true,
  })) || [];

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
              File Preview
            </div>
            <Button
              type="primary"
              icon={<ExperimentOutlined />}
              onClick={() => navigate(`/files/${id}/mapping`)}
            >
              Configure Mapping
            </Button>
          </div>
        }
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <Spin size="large" />
          </div>
        ) : preview ? (
          <>
            <div style={{ marginBottom: '16px' }}>
              <p>
                <strong>Total Rows:</strong> {preview.totalRows}
              </p>
              <p>
                <strong>Preview Rows:</strong> {preview.previewRows}
              </p>
              <p>
                <strong>Columns:</strong> {preview.columns.length}
              </p>
            </div>
            <Table
              columns={columns}
              dataSource={preview.rows.map((row, idx) => ({ ...row, key: idx }))}
              pagination={false}
              scroll={{ x: 'max-content' }}
              size="small"
            />
          </>
        ) : (
          <p>No preview available</p>
        )}
      </Card>
    </div>
  );
};

export default FilePreviewPage;
