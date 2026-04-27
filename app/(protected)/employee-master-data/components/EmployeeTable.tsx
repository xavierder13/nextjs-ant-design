"use client";

import { Table, Space, Button, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext";

interface EmployeeTableProps {
  employees: any[];
  columns: any[];
  loading: boolean;
  pagination: any;
  selectedRowKeys: number[];
  setSelectedRowKeys: (keys: number[]) => void;
  onDelete: (id: number) => void;
  editData: (data: any[]) => void;
  onChangePagination: (page: number, pageSize: number) => void;
}

export default function EmployeeTable({
  employees,
  columns,
  loading,
  pagination,
  selectedRowKeys,
  setSelectedRowKeys,
  onDelete,
  editData,
  onChangePagination
}: EmployeeTableProps) {

  const { hasPermission } = useAuth();

  const enhancedColumns = [
    ...columns,
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <Space>
          {// if has permission
            hasPermission('employee-master-data-edit') &&
            <Tooltip title="Edit">
              <Button color="green" variant="outlined" icon={<EditOutlined />} onClick={() => editData(record)} />
            </Tooltip>
          }

          {// if has permission
            hasPermission('employee-master-data-delete') &&
            <Popconfirm title="Delete employee?" onConfirm={() => onDelete(record.id)}>
              <Tooltip title="Delete">
                <Button danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          }
          
        </Space>
      )
    }
  ];

  return (
    <Table
      rowKey="id"
      columns={enhancedColumns}
      dataSource={employees}
      loading={loading}
      scroll={{ x: "max-content" }}
      rowSelection={{
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys as number[])
      }}
      pagination={{
        ...pagination,
        onChange: (page, pageSize) => onChangePagination(page, pageSize),
      }}
      size="small"
    />
  );
}