"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { api } from "@/lib/axios";

import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Table, 
  Input, 
  Button, 
  Space, 
  Popconfirm, 
  message, 
  Tooltip,
  Breadcrumb,
  Form,
  Modal,
} from "antd";
import Link from "next/link";
import { 
  ReloadOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CloseOutlined 
} from "@ant-design/icons";

export default function PermissionListPage() {
  const [formData] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<String>("New Permission");
  const [editedIndex, setEditedIndex] = useState<int>(-1);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: true
    },
    {
      title: "Permission Name",
      dataIndex: "name",
      sorter: true
    },
    {
      title: "Guard",
      dataIndex: "guard_name",
      sorter: true
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Edit">
            <Button color="green" variant="outlined" icon={<EditOutlined />} onClick={() => editData(record)} />
          </Tooltip>
          <Popconfirm title="Delete employee?" onConfirm={() => onDelete(record.id)}>
            <Tooltip title="Delete">
              <Button danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const fetchPermissions = async () => {

    setLoading(true);

    try {

      const res = await api.get("/api/permission/index");

      setPermissions(res.data.permissions);

    } catch (err) {
      console.error(err);
      message.error("Failed to fetch permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const searchValue = Form.useWatch("search", searchForm); // tracked value
  const filteredPermissions = useMemo(() => {
    if (!searchValue) return permissions;
    return permissions.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [permissions, searchValue]); // now useMemo reacts instantly
 
  const editData = (data: any) => {
    const index = permissions.indexOf(data);
    setEditedIndex(index);
    setModalTitle("Edit Permission");
    setModal(true); // open modal first
  };

  // effect to populate form after modal opens
  useEffect(() => {
    if (modal && editedIndex !== -1 && permissions[editedIndex]) {
      // use a small timeout to ensure Modal and Form are mounted
      setTimeout(() => {
        formData.setFieldsValue({
          ...permissions[editedIndex],
        });
      });
    }
  }, [modal, editedIndex, permissions, formData]);

  const onSave = () => {

    console.log('saved');
    
  }

  const onCancel = () => {
    setModal(false);
    console.log('cancelled');
    
  }


  const onDelete = async (id: number) => {

    try {
      await api.delete(`/api/permission/delete/${id}`);
      message.success("Permission deleted");

      fetchPermissions();

    } catch (err) {
      message.error("Delete failed");
    }

  };

  return (
    <>
      <Breadcrumb
        style={{ margin: "16px 0", marginTop: 0 }}
        items={[
          {
            title: <Link href="/">Home</Link>, // <-- clickable
          },
          {
            title: "Permission List",
          },
        ]}
      />
      <Card
        title={
          <Row gutter={[8, 8]}>
            <Col xs={24} md={6}>
              <Typography.Title level={4} style={{ margin: 0 }}>
                Employee Master Data
              </Typography.Title>
            </Col>

            <Col xs={24} md={8}>
              <Form form={searchForm}>
                <Form.Item name="search" style={{marginBottom: 0}}>
                   <Input
                      placeholder="Search..."
                      prefix={<SearchOutlined />}
                    />
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={6}>
              <Space>
                <Button icon={<ReloadOutlined />} onClick={() => fetchPermissions()}>Refresh</Button>
              </Space>
            </Col>
          </Row>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredPermissions}
          loading={loading}
        />
      </Card>

      <Modal
        open={modal}
        title={modalTitle}
        onCancel={onCancel}
        destroyOnHidden
        footer={[
          <Button key="cancel" onClick={onCancel}>Cancel</Button>,
          <Button key="save" type="primary" onClick={onSave}>Save</Button>
        ]}
      >
        <Form
          form={formData}
          layout="vertical"
          initialValues={permissions[editedIndex]}
        >
          <Form.Item
            label="Permission"
            name="name"
            rules={[{ required: true, message: "Permission is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Guard Name"
            name="guard_name"
            rules={[{ required: true, message: "Guard Name is required" }]}
          >
            <Input />
          </Form.Item>

          {/* Add other fields here */}
        </Form>
      </Modal>
      
    </>
  );
}