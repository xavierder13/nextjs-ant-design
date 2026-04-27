"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth, AuthProvider } from "@/context/AuthContext";
import { 
  ConfigProvider,
  Layout,
  Menu, 
  Avatar, 
  Typography, 
  Dropdown, 
  MenuProps, 
  Button,
  Divider,
  Badge,
  Space,
  Breadcrumb,
} from "antd";
import {
  DashboardOutlined,
  BarcodeOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  MailOutlined,
  DatabaseOutlined,
  SyncOutlined,
  ShopOutlined,
  DollarOutlined,
  FileOutlined,
  LogoutOutlined,
  MenuOutlined,
  BellOutlined,
  DownOutlined,
  CheckCircleOutlined,
  AuditOutlined,
  SolutionOutlined,
  StarOutlined
} from "@ant-design/icons";
import { usePathname } from "next/navigation";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface Props {
  children?: React.ReactNode;
}

// ─── Page title map — add routes as you build them ───────────────────────────
const titleMap: Record<string, { title: string; breadcrumb: string[] }> = {
  "/dashboard":                         { title: "Dashboard",            breadcrumb: ["Home", "Dashboard"] },
  "/hr-payroll/dashboard":              { title: "HR Dashboard",         breadcrumb: ["Human Resource", "Dashboard"] },
  "/employee-master-data":              { title: "Employee Master Data", breadcrumb: ["Human Resource", "Employee Master Data"] },
  "/kpi-templates":                     { title: "KPI Template",         breadcrumb: ["KPI Management", "KPI Templates"] },
  "/recruitment/applicant-list":        { title: "Job Applicants",       breadcrumb: ["Human Resource", "Recruitment", "Job Applicants"] },
  "/recruitment/screening-list":        { title: "Screening",            breadcrumb: ["Human Resource", "Recruitment", "Screening"] },
  "/recruitment/initial-interview-list":{ title: "Initial Interview",    breadcrumb: ["Human Resource", "Recruitment", "Initial Interview"] },
  "/recruitment/iq-test-list":          { title: "Exam",                 breadcrumb: ["Human Resource", "Recruitment", "Exam"] },
  "/recruitment/final-interview-list":  { title: "Final Interview",      breadcrumb: ["Human Resource", "Recruitment", "Final Interview"] },
  "/recruitment/orientation-list":      { title: "Orientation",          breadcrumb: ["Human Resource", "Recruitment", "Orientation"] },
};

function usePageMeta() {
  const pathname = usePathname();
  return titleMap[pathname] ?? { title: "", breadcrumb: ["Home"] };
}

// ─── Menu data ────────────────────────────────────────────────────────────────
const menuData: any[] = [
  { key: "dashboard", title: "Dashboard", link: "/dashboard", icon: <DashboardOutlined /> },
  { type: "divider" },
  {
    key: "human-resource",
    type: "group",
    label: "Human Resource",
    children: [
      { 
        key: "employee-master-data", 
        title: "Employee Master Data",  
        icon: <UserOutlined />,  
        link: "/employee-master-data", 
        permissions: ["employee-master-data-list"] },
      {
        key: "recruitment",
        title: "Recruitment",
        icon: <TeamOutlined />,
        children: [
          { key: "job-applicants",      title: "Job Applicants",    link: "/recruitment/applicant-list",         permissions: ["careers-applicant-list"] },
          { key: "screening",           title: "Screening",         link: "/recruitment/screening-list",         permissions: ["careers-screening-list"] },
          { key: "initial-interview",   title: "Initial Interview", link: "/recruitment/initial-interview-list", permissions: ["careers-initial-interview-list"] },
          { key: "exam",                title: "Exam",              link: "/recruitment/iq-test-list",           permissions: ["careers-iq-test-list"] },
          { key: "final-interview",     title: "Final Interview",   link: "/recruitment/final-interview-list",   permissions: ["careers-final-interview-list"] },
          { key: "orientation",         title: "Orientation",       link: "/recruitment/orientation-list",       permissions: ["careers-orientation-list"] },
        ],
      },
    ],
  },
  { type: "divider" },
  {
    key: "kpi",
    type: "group",
    label: "KPI Management",
    children: [
      { 
        key: "kpi-templates", 
        title: "KPI Template",       
        icon: <SolutionOutlined />,   
        link: "/kpi-templates",  
        permissions: ["role-list", "role-create"] 
      },
      { 
        key: "employee-evaluations", 
        title: "Employee Evaluation", 
        icon: <StarOutlined />,
        link: "/employee-evaluations", 
        permissions: ["permission-list", "permission-create"] 
      },
    ],
  },
  { type: "divider" },
  {
    key: "setup-group",
    type: "group",
    label: "Set Up & Authorizations",
    children: [
      {
        key: "user-management",
        title: "User Management",
        icon: <UserOutlined />,
        children: [
          { key: "user-list",   title: "User Accounts", link: "/users",       permissions: ["user-list"] },
          { key: "user-create", title: "Create New",    link: "/user/create", permissions: ["user-create"] },
        ],
      },
      { key: "roles",       title: "Role",       icon: <TeamOutlined />,   link: "/role/index",  permissions: ["role-list", "role-create"] },
      { key: "permissions", title: "Permission", icon: <SettingOutlined />,link: "/permissions", permissions: ["permission-list", "permission-create"] },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getMenuState(menuItems: any[], path: string) {
  let activeKey = "";
  let openKeys: string[] = [];

  const traverse = (items: any[], parents: string[] = []): boolean => {
    for (const item of items) {
      if (!item || item.type === "divider") continue;
      if (item.link && (path === item.link || path.startsWith(item.link + "/"))) {
        activeKey = item.key;
        openKeys = [...parents];
        return true;
      }
      if (item.children && traverse(item.children, [...parents, item.key])) return true;
    }
    return false;
  };

  traverse(menuItems);
  return { activeKey, openKeys };
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function ProtectedLayout({ children }: Props) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#389e0d",
          colorLink: "#389e0d",
          colorLinkHover: "#1a4d0f",
        },
      }}
    >
      <AuthProvider>
        <LayoutContent>{children}</LayoutContent>
      </AuthProvider>
    </ConfigProvider>
  );
}

// ─── Inner layout ─────────────────────────────────────────────────────────────
function LayoutContent({ children }: Props) {
  const pathname = usePathname();
  const { user, hasPermission, logout, loading } = useAuth();
  const [collapsed, setCollapsed] = React.useState(false);
  const { title: pageTitle, breadcrumb } = usePageMeta();

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  const { activeKey, openKeys } = getMenuState(menuData, pathname);

  // ── Menu item generator ────────────────────────────────────────────────────
  const generateMenuItem = (item: any): any => {
    if (!item) return null;

    if (item.type === "divider") return { type: "divider" };

    if (item.type === "group") {
      const children = item.children?.map(generateMenuItem).filter(Boolean);
      if (!children?.length) return null;
      return {
        type: "group",
        key: item.key,
        label: (
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, color: "#1a4d0f" }}>
            {item.icon && React.isValidElement(item.icon)
              ? React.cloneElement(item.icon as React.ReactElement, { style: { color: "#1a4d0f" } })
              : item.icon}
            <span>{item.label}</span>
          </span>
        ),
        children,
      };
    }

    if (item.permission && !hasPermission(item.permission)) return null;
    if (item.permissions && !item.permissions.some((p: string) => hasPermission(p))) return null;

    if (item.children) {
      const children = item.children.map(generateMenuItem).filter(Boolean);
      if (!children.length) return null;
      return {
        key: item.key,
        icon: React.isValidElement(item.icon)
          ? React.cloneElement(item.icon as React.ReactElement, { style: { color: "#389e0d" } })
          : item.icon,
        label: item.title,
        children,
      };
    }

    const isActive = item.key === activeKey;
    return {
      key: item.key,
      label: item.link ? <Link href={item.link}>{item.title}</Link> : item.title,
      icon: React.isValidElement(item.icon)
        ? React.cloneElement(item.icon as React.ReactElement, {
            style: { color: isActive ? undefined : "#389e0d" },
          })
        : item.icon,
    };
  };

  // ── Avatar dropdown ────────────────────────────────────────────────────────
  const avatarMenu: MenuProps["items"] = [
    { key: "profile", label: "Profile", icon: <UserOutlined />,   onClick: () => {} },
    { type: "divider" },
    { key: "logout",  label: "Logout",  icon: <LogoutOutlined />, onClick: logout },
  ];

  // ── Breadcrumb items ───────────────────────────────────────────────────────
  const breadcrumbItems = breadcrumb.map((segment, i) => ({
    title:
      i < breadcrumb.length - 1 ? (
        <span style={{ color: "#8c8c8c" }}>{segment}</span>
      ) : (
        <span style={{ color: "#389e0d" }}>{segment}</span>
      ),
  }));

  return (
    <Layout style={{ minHeight: "100vh" }}>

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth={0}
        trigger={null}
        width={240}
        style={{ background: "#fff", boxShadow: "2px 0 8px rgba(56, 158, 13, 0.12)"  }}
      >
        <div style={{ padding: collapsed ? 8 : 16, textAlign: "center" }}>
          <Avatar src="/default-profile.png" size={collapsed ? 40 : 64} />
          {!collapsed && (
            <Title level={5} style={{ marginTop: 8, fontSize: 14 }}>
              {user.name}
            </Title>
          )}
        </div>

        <Divider style={{ marginTop: -10, marginBottom: 0, borderColor: "#00c3ff40" }} />

        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          defaultOpenKeys={openKeys}
          items={menuData.map(generateMenuItem).filter(Boolean)}
          style={{
            height: "calc(100vh - 112px)",
            overflowY: "auto",
            background: "#fff",
            border: "none",
          }}
        />
      </Sider>

      <Layout>

        {/* ── Header — Option B ────────────────────────────────────────────── */}
        <Header
          style={{
            height: 52,
            padding: "0 16px",
            background: "#fff",
            borderBottom: "2px solid #389e0d",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          {/* Left: hamburger + page title + breadcrumb */}
          <Space align="center" size={12}>
            <Button
              type="text"
              icon={<MenuOutlined style={{ color: "#389e0d" }} />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                background: "#f6ffed",
                border: "0.5px solid #d9f7be",
                borderRadius: 6,
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: -5
              }}
            />
            <div>
              <Text strong style={{ fontSize: 14, color: "#1a4d0f", display: "block", lineHeight: 1.3 }}>
                {pageTitle}
              </Text>
            </div>
          </Space>

          {/* Right: bell + user chip */}
          <Space align="center" size={10}>
            <Badge count={0} size="small">
              <Button
                type="text"
                icon={<BellOutlined style={{ color: "#389e0d", fontSize: 16 }} />}
                style={{
                  background: "#f6ffed",
                  border: "0.5px solid #d9f7be",
                  borderRadius: 6,
                  width: 34,
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </Badge>

            <Dropdown menu={{ items: avatarMenu }} placement="bottomRight" trigger={["click"]}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  padding: "4px 10px 4px 4px",
                  borderRadius: 8,
                  border: "0.5px solid #d9f7be",
                  background: "#fff",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f6ffed")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
              >
                <Avatar
                  src="/default-profile.png"
                  size={28}
                  style={{ background: "#d9f7be", color: "#276221", fontSize: 11, fontWeight: 600 }}
                />
                <div style={{ lineHeight: 1.3 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#1a4d0f" }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: "#8c8c8c" }}>{(user as any).role ?? "User"}</div>
                </div>
                <DownOutlined style={{ fontSize: 10, color: "#8c8c8c", marginLeft: 2 }} />
              </div>
            </Dropdown>
          </Space>
        </Header>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <Content
          style={{
            margin: 10,
            background: "#fff",
            padding: 24,
            borderRadius: 8,
            overflow: "auto",
            height: "calc(100vh - 52px - 20px)",
          }}
        >
          {children}
        </Content>

      </Layout>
    </Layout>
  );
}