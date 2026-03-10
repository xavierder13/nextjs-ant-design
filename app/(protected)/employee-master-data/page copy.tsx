"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

import {
  Card,
  Table,
  Input,
  Button,
  Space,
  Popconfirm,
  message,
  Select,
  Divider,
  Row,
  Col,
  Typography,
  Grid,
  Checkbox,
  Pagination,
  Tooltip
} from "antd";

import {
  ReloadOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import "@/app/globals.css";

const { useBreakpoint } = Grid;

const headers = [
  {
    title: "Branch",
    dataIndex: "branch",
    value: "branch.name",
    sorter: true,
    render: (branch: any) => branch?.name || "-"
  },
  {
    title: "Company",
    dataIndex: "branch",
    value: "branch.company.name",
    sorter: true,
    render: (branch: any) => branch?.company?.name || "-"
  },
  { title: "Emp. Code", dataIndex: "employee_code", value: "employee_code" },
  { title: "Lastname", dataIndex: "last_name", value: "last_name" },
  { title: "Firstname", dataIndex: "first_name", value: "first_name" },
  { title: "Middlename", dataIndex: "middle_name", value: "middle_name" },
  { title: "Birthday", dataIndex: "dob", value: "dob" },
  { title: "Address", dataIndex: "address", value: "address" },
  { title: "Contact #", dataIndex: "contact", value: "contact" },
  { title: "Email", dataIndex: "email", value: "email" },
  { title: "Job Description", dataIndex: "position.name", value: "position.name" },
  { title: "Rank", dataIndex: "position.rank.name", value: "position.rank.name" },
  {
    title: "Department",
    dataIndex: "department",
    value: "department.name",
    render: (department: any) => department?.name || "-"
  },
  {
    title: "Division",
    dataIndex: "department",
    value: "department.division.name",
    render: (department: any) => department?.division?.name || "-"
  },
  { title: "Date Employed", dataIndex: "date_employed", value: "date_employed" },
  { title: "Gender", dataIndex: "gender", value: "gender" },
  { title: "Civil Status", dataIndex: "civil_status", value: "civil_status" },
  { title: "TIN #", dataIndex: "tin_no", value: "tin_no" },
  { title: "Pag-IBIG #", dataIndex: "pagibig_no", value: "pagibig_no" },
  { title: "PhilHealth #", dataIndex: "philhealth_no", value: "philhealth_no" },
  { title: "SSS #", dataIndex: "sss_no", value: "sss_no" }
];

const defaultHeaders = headers.slice(0, 8);

// Top of your file
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 200, 300, 500];

export default function EmployeeListPage() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;


  // Determine size dynamically
  // xs / sm -> small
  // md / lg / xl -> default
  const isSmallScreen = !screens.sm; // true for xs and sm
  const paginationSize = isSmallScreen ? "small" : "default";

  console.log(paginationSize);
  

  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const [search, setSearch] = useState("");

  const [selectedHeaders, setSelectedHeaders] = useState<any[]>(defaultHeaders);

  const fetchEmployees = async (
    page = pagination.current,
    pageSize = pagination.pageSize,
    searchValue = search
  ) => {
    setLoading(true);

    try {
      const data = {
        page,
        items_per_page: pageSize,
        search: searchValue,
        table_headers: selectedHeaders.map((h) => ({
          text: h.title,
          value: h.value
        }))
      };

      const res = await api.post("/api/employee_master_data/index", data);

      setEmployees(res.data.employees.data);

      setPagination({
        current: res.data.employees.current_page,
        pageSize: res.data.employees.per_page,
        total: res.data.employees.total
      });

    } catch {
      message.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [selectedHeaders]);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/employee_master_data/delete/${id}`);
      message.success("Employee deleted");
      fetchEmployees();
    } catch {
      message.error("Delete failed");
    }
  };

  const columns = [
    ...selectedHeaders.map((h) => ({
      title: h.title,
      dataIndex: h.dataIndex,
      render: h.render
    })),
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Edit">
            <Button color="green" variant="outlined" icon={<EditOutlined />}/>
          </Tooltip>
          <Popconfirm
            title="Delete this employee?"
            onConfirm={() => handleDelete(record.id)}
          > 
          <Tooltip title="Delete">
            <Button danger icon={<DeleteOutlined />} />
          </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Card
      title={
        <Row gutter={[8, 8]}>
          <Col xs={24} md={6}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Employee Master Data
            </Typography.Title>
          </Col>

          <Col xs={24} md={8}>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>

          <Col xs={24} md={6}>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => fetchEmployees(1)}
              >
                Search
              </Button>

              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchEmployees()}
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      }
    >

      {/* COLUMN SELECT */}
      <Space style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Selected Columns</label>

          <Select
            mode="multiple"
            style={{ minWidth: 250 }}
            value={selectedHeaders.map((h) => h.value)}
            options={headers.map((h) => ({
              label: h.title,
              value: h.value
            }))}
            onChange={(values: string[]) => {

              if (values.length > 8) {
                message.warning("You can select up to 8 columns only.");
                return;
              }

              const newSelected = headers.filter((h) =>
                values.includes(h.value)
              );

              setSelectedHeaders(newSelected);
            }}
          />
        </div>
      </Space>

      {/* DESKTOP TABLE */}

      {!isMobile && (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={employees}
          loading={loading}
          pagination={pagination}
          scroll={{ x: "max-content" }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,                 // show dropdown
            pageSizeOptions: PAGE_SIZE_OPTIONS.map(String), // must be string
            showLessItems: isSmallScreen,          // compact pagination for mobile
            onChange: (page, pageSize) => {
              setPagination({ ...pagination, current: page, pageSize });
              fetchEmployees(page, pageSize);
            },
            onShowSizeChange: (current, size) => {
              setPagination({ ...pagination, current, pageSize: size });
              fetchEmployees(current, size);
            }
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys as number[])
          }}
        />
      )}

      {/* MOBILE CARD MODE */}

      {isMobile && (
        <div>

          {employees.map((emp) => (

            <Card
              key={emp.id}
              size="small"
              style={{ marginBottom: 12 }}
            >

              <Checkbox
                checked={selectedRowKeys.includes(emp.id)}
                onChange={(e) => {

                  if (e.target.checked) {
                    setSelectedRowKeys([...selectedRowKeys, emp.id]);
                  } else {
                    setSelectedRowKeys(
                      selectedRowKeys.filter((k) => k !== emp.id)
                    );
                  }

                }}
                style={{ marginBottom: 10 }}
              >
                Select
              </Checkbox>

              {selectedHeaders.map((col) => (

                <div key={col.value} style={{ marginBottom: 8 }}>

                  <Typography.Text strong>
                    {col.title}
                  </Typography.Text>

                  <div>
                    {col.render
                      ? col.render(emp[col.dataIndex])
                      : emp[col.dataIndex]}
                  </div>

                </div>

              ))}

              <Divider />
              <Space>
                <Tooltip title="Edit">
                  <Button color="green" variant="outlined" icon={<EditOutlined />}/>
                </Tooltip>
                <Popconfirm
                  title="Delete this employee?"
                  onConfirm={() => handleDelete(record.id)}
                > 
                <Tooltip title="Delete">
                  <Button danger icon={<DeleteOutlined />} />
                </Tooltip>
                </Popconfirm>
              </Space>
            </Card>

          ))}

          {/* FIXED PAGINATION FOR MOBILE */}
          <Row justify="center" align="middle" style={{ marginTop: 16 }}>
            <Col>
              {/* Only show custom pageSize select on small screens */}
              {isSmallScreen && (
                <Space style={{ marginBottom: 8 }}>
                  <span>Items per page:</span>
                  <Select
                    value={pagination.pageSize}
                    style={{ width: 100 }}
                    onChange={(size) => {
                      setPagination({ ...pagination, pageSize: size, current: 1 });
                      fetchEmployees(1, size);
                    }}
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <Select.Option key={size} value={size}>
                        {size}
                      </Select.Option>
                    ))}
                  </Select>
                </Space>
              )}

              {/* Main Pagination */}
              <Pagination
                size={isSmallScreen ? "small" : "default"}
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                showSizeChanger={!isSmallScreen} // hide default dropdown on small screens
                showLessItems={isSmallScreen} // compact pagination on small screens
                onChange={(page, pageSize) => {
                  setPagination({ ...pagination, current: page, pageSize });
                  fetchEmployees(page, pageSize);
                }}
                onShowSizeChange={(current, size) => {
                  setPagination({ ...pagination, pageSize: size, current });
                  fetchEmployees(current, size);
                }}
                style={{ textAlign: "center" }}
              />
            </Col>
          </Row>

        </div>
      )}

    </Card>
  );
}