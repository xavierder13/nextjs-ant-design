"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

import { Table, Input, Button, Space, Popconfirm, message } from "antd";
import { ReloadOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function PermissionListPage() {

  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const [search, setSearch] = useState("");

  const fetchPermissions = async (
    page = pagination.current,
    pageSize = pagination.pageSize,
    searchValue = search,
    sortField?: string,
    sortOrder?: string
  ) => {

    setLoading(true);

    try {

      const res = await api.get("/api/permission/index", {
        params: {
          page,
          per_page: pageSize,
          search: searchValue,
          sort_field: sortField,
          sort_order: sortOrder
        }
      });

      console.log(res);

      setPermissions(res.data.permissions.data);

      setPagination({
        current: res.data.permissions.current_page,
        pageSize: res.data.permissions.per_page,
        total: res.data.permissions.total
      });

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

  const handleDelete = async (id: number) => {

    try {
      await api.delete(`/api/permission/delete/${id}`);
      message.success("Permission deleted");

      fetchPermissions();

    } catch (err) {
      message.error("Delete failed");
    }

  };

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

          <Button
            type="primary"
            icon={<EditOutlined />}
          />

          <Popconfirm
            title="Delete this permission?"
            onConfirm={() => handleDelete(record.id)}
          >

            <Button
              danger
              icon={<DeleteOutlined />}
            />

          </Popconfirm>

        </Space>
      )
    }
  ];

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {

    fetchPermissions(
      pagination.current,
      pagination.pageSize,
      search,
      sorter.field,
      sorter.order === "ascend" ? "asc" : "desc"
    );

  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      console.log("Selected:", selectedRowKeys);
    }
  };

  return (
    <div>

      <h1>Permission List</h1>

      {/* Top Controls */}
      <Space style={{ marginBottom: 16 }}>

        <Input
          placeholder="Search permission..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          type="primary"
          onClick={() => fetchPermissions(1)}
        >
          Search
        </Button>

        <Button
          icon={<ReloadOutlined />}
          onClick={() => fetchPermissions()}
        >
          Refresh
        </Button>

      </Space>
     
      <Table
        rowKey="id"
        columns={columns}
        dataSource={permissions}
        loading={loading}
        rowSelection={rowSelection}

        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total
        }}

        onChange={handleTableChange}
      />

    </div>
  );
}