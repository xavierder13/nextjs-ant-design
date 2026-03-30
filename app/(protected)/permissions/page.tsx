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
  Grid,
  Divider,
} from "antd";
import Link from "next/link";
import { 
  ReloadOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CloseOutlined 
} from "@ant-design/icons";

const { useBreakpoint } = Grid;

export default function PermissionListPage() {
  const [formData] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<String>("New Permission");
  const [editedIndex, setEditedIndex] = useState<int>(-1);

  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isSmallScreen = !screens.sm;

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

  const onSave = async (data: any) => {
    // const data = await formData.validateFields(); // ✅ get all form data + validate
      
    console.log("Form Values:", data);
    console.log('saved');

    setModal(false);

    // api.post('/api/permission/store', data).then(
    //   (response) => {
    //     console.log(response);
        
    //   },
    //   (error) => {
    //     console.log(error);
        
    //   }
    // )
    
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
                Permission List
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
        styles={{
          header: isMobile
            ? { paddingTop: 10, paddingBottom: 10 }
            : {}
        }}
      >
        {!isMobile && (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredPermissions}
            loading={loading}
            size="small"
          />
        )}

        {isMobile && (
          filteredPermissions.map((record) => (
            <Card key={record.id} size="small" style={{ marginBottom: 12 }}>
              
              {/* Fields */}
              {columns
                .filter(col => col.dataIndex) // ignore actions column here
                .map((col: any) => (
                  <div key={col.dataIndex} style={{ marginBottom: 8 }}>
                    <Typography.Text strong>{col.title}</Typography.Text>
                    <div>
                      {col.render
                        ? col.render(record[col.dataIndex], record)
                        : record[col.dataIndex]}
                    </div>
                  </div>
                ))}

              <Divider />

              {/* Actions */}
              <Space>
                <Tooltip title="Edit">
                  <Button
                    color="green"
                    variant="outlined"
                    icon={<EditOutlined />}
                    onClick={() => editData(record)}
                  />
                </Tooltip>

                <Popconfirm title="Delete?" onConfirm={() => onDelete(record.id)}>
                  <Tooltip title="Delete">
                    <Button danger icon={<DeleteOutlined />} />
                  </Tooltip>
                </Popconfirm>
              </Space>
            </Card>
          ))
        )}
        
      </Card>
        
      <Modal
        open={modal}
        title={modalTitle}
        onCancel={onCancel}
        destroyOnHidden
        footer={[
          <Button key="cancel" onClick={onCancel}>Cancel</Button>,
          // <Button key="save" type="primary" onClick={onSave}>Save</Button>
          <Button
            key="save"
            type="primary"
            onClick={() => formData.submit()} // ✅ triggers validation
          >
            Save
          </Button>
        ]}
      >
        <Form
          form={formData}
          layout="vertical"
          initialValues={permissions[editedIndex]}
          onFinish={onSave}
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