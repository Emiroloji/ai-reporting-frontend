import React, { useState, useEffect } from 'react';
import { Button, Table, Upload, message, Modal, Space, Tag, Tooltip } from 'antd';
import { UploadOutlined, DeleteOutlined, DownloadOutlined, EyeOutlined, ExperimentOutlined } from '@ant-design/icons';
import { fileService } from '../services/fileService';
import type { UploadedFile } from '../types/file';

const FilesPage: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const data = await fileService.getMyFiles();
      setFiles(data);
    } catch (error) {
      message.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchFiles();
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      await fileService.upload(file);
      message.success('File uploaded successfully');
      void fetchFiles();
    } catch (error) {
      message.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (fileId: number) => {
    Modal.confirm({
      title: 'Delete File',
      content: 'Are you sure you want to delete this file?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await fileService.deleteFile(fileId);
          message.success('File deleted successfully');
          void fetchFiles();
        } catch (error) {
          message.error('Failed to delete file');
        }
      },
    });
  };

  const handleDownload = async (fileId: number, fileName: string) => {
    try {
      const blob = await fileService.downloadFile(fileId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      message.error('Failed to download file');
    }
  };

  const columns = [
    {
      title: 'File Name',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: 'Type',
      dataIndex: 'fileType',
      key: 'fileType',
      render: (type: string) => <Tag color="blue">{type.toUpperCase()}</Tag>,
    },
    {
      title: 'Size',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (size: number) => `${(size / 1024).toFixed(2)} KB`,
    },
    {
      title: 'Upload Date',
      dataIndex: 'uploadedAt',
      key: 'uploadedAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status?: string) => {
        const colors: Record<string, string> = {
          uploaded: 'default',
          processing: 'processing',
          analyzed: 'success',
          error: 'error',
        };
        return <Tag color={colors[status || 'uploaded']}>{status || 'uploaded'}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: UploadedFile) => (
        <Space>
          <Tooltip title="Preview">
            <Button
              type="link"
              icon={<EyeOutlined />}
              href={`/files/${record.id}/preview`}
            />
          </Tooltip>
          <Tooltip title="Configure Mapping">
            <Button
              type="link"
              icon={<ExperimentOutlined />}
              href={`/files/${record.id}/mapping`}
            />
          </Tooltip>
          <Tooltip title="Download">
            <Button
              type="link"
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record.id, record.fileName)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>My Files</h1>
        <Upload
          beforeUpload={(file) => {
            void handleUpload(file);
            return false;
          }}
          showUploadList={false}
          accept=".xlsx,.xls,.csv,.pdf"
        >
          <Button type="primary" icon={<UploadOutlined />} loading={uploading}>
            Upload File
          </Button>
        </Upload>
      </div>

      <Table
        columns={columns}
        dataSource={files}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default FilesPage;
