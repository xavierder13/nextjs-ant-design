"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Input, 
  Space, 
  Button, 
  Grid, 
  Divider, 
  Form,
  Breadcrumb,
} from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import Link from "next/link";

import ColumnSelector from "./components/ColumnSelector";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeCardMobile from "./components/EmployeeCardMobile";
import PaginationControls from "./components/PaginationControls";
import Modal from "./components/EmployeeModal";
import EmployeeTabs from "./components/EmployeeTabs";

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
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 200, 300, 500];

export default function EmployeeListPage() {
  const [searchForm] = Form.useForm();

  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isSmallScreen = !screens.sm;

  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [search, setSearch] = useState("");
  const [selectedHeaders, setSelectedHeaders] = useState<any[]>(defaultHeaders);
  const [modal, setModal] = useState<boolean>(false);
  const [editedIndex, setEditedIndex] = useState<number>(-1);
  const [modalTitle, setModalTitle] = useState<string>("New Employee");

  const fetchEmployees = async (page = 1, pageSize = 10, searchValue = "") => {
    setLoading(true);
    try {
      const data = {
        page,
        items_per_page: pageSize,
        search: searchValue,
        table_headers: selectedHeaders.map((h) => ({ text: h.title, value: h.value }))
      };
      const res = await api.post("/api/employee_master_data/index", data);
      setEmployees(res.data.employees.data);
      setPagination({
        current: res.data.employees.current_page,
        pageSize: res.data.employees.per_page,
        total: res.data.employees.total
      });
    } finally { setLoading(false); }
  };

  const searchData = async () => {
    const values = await searchForm.getFieldsValue();
     const searchValue = values.search || "";
    setSearch(searchValue); // optional (for UI state)
    fetchEmployees(1, pagination.pageSize, searchValue); // ✅ pass directly
  }
 
  const saveData = () => {
    console.log('saved data')
  }

  const editData = async (data: any) => {
    const index = employees.indexOf(data);
    setEditedIndex(index);
    setModalTitle("Edit Employee");
    setModal(true);
  }

  const deleteData = () => {
    fetchEmployees();
  }

  const closeModal = () => {
    setModal(false);
  }

  useEffect(() => { fetchEmployees(); }, [selectedHeaders]);

  return (
    <>
      <Breadcrumb
        style={{ margin: "16px 0", marginTop: 0 }}
        items={[
          {
            title: <Link href="/">Home</Link>, // <-- clickable
          },
          {
            title: "Employee Master Data",
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
                      onPressEnter={searchData}
                    />
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={6}>
              <Space>
                <Button type="primary" icon={<SearchOutlined />} onClick={() => searchData()}>Search</Button>
                <Button icon={<ReloadOutlined />} onClick={() => fetchEmployees()}>Refresh</Button>
              </Space>
            </Col>
          </Row>
        }
      >
        <Space style={{ marginBottom: 16 }}>
          <ColumnSelector headers={headers} selectedHeaders={selectedHeaders} onChange={setSelectedHeaders} />
        </Space>

        {!isMobile && (
          <EmployeeTable
            employees={employees}
            columns={selectedHeaders.map((h) => ({ title: h.title, dataIndex: h.dataIndex, render: h.render }))}
            loading={loading}
            pagination={pagination}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            editData={editData}
            onDelete={deleteData}  // can add delete logic
            onChangePagination={(page, pageSize) => fetchEmployees(page, pageSize)}
          />
        )}

        {isMobile && (
          <>
            <EmployeeCardMobile
              employees={employees}
              selectedHeaders={selectedHeaders}
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
              onDelete={deleteData}  // can add delete logic
              editData={editData}
            />
            <PaginationControls
              pagination={pagination}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              isSmallScreen={isSmallScreen}
              onChange={(page, pageSize) => fetchEmployees(page, pageSize)}
            />
          </>
        )}
      </Card>
      <Modal
        visible={modal}
        title={modalTitle}
        onCancel={closeModal}
        onSave={saveData}
      >
        <EmployeeTabs/>
      </Modal>
    </>
  );
}