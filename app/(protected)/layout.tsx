"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth, AuthProvider } from "@/context/AuthContext";
import { 
  Layout,
  Menu, 
  Avatar, 
  Typography, 
  Dropdown, 
  MenuProps, 
  Button , 
  Divider,
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
  MenuOutlined
} from "@ant-design/icons";
import { usePathname } from "next/navigation";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface Props {
  children?: React.ReactNode;
}

interface MenuItem {
  key: string;
  title: string;
  icon?: React.ReactNode; //optional '?'
  link?: string; //optional '?'
  children?: MenuItem[]; //optional '?'
  permission?: string; //optional '?'
}

// Example menu data with permissions
const menuData = [
  { key: "dashboard", title: "Dashboard", link: "/dashboard", icon: <FileOutlined /> },
  { type: 'divider' },
  {  
    key: 'inventory-group',
    type: 'group',
    label: 'Inventory / Purchasing',
    children: [
      {
        key: "inventory",
        title: "Inventory",
        icon: <BarcodeOutlined />,
        children: [
          { key: "product-list", title: "Product List", link: "/product/index", permissions: ["product-list"] },
          { key: "inventory-reconciliation", title: "Reconciliation", link: "/inventory/reconciliation", permissions: ["inventory-recon-list"] },
          { key: "scan-product", title: "Scan Product", link: "/scan_product", permissions: ["product-scan"] },
          { key: "scanned-product-list", title: "Scanned Product List", link: "/scanned_product_list", permissions: ["product-list-scanned"] },
          { key: "serial-number-details", title: "Serial Number Details", link: "/serial_number_details", permissions: ["serial-number-details"] },
          { key: "inventory-on-hand", title: "Inventory On Hand", link: "/inventory_on_hand", permissions: ["inventory-on-hand"] },
        ],
      },
      {
        key: "item-master",
        title: "Item Master Data",
        icon: <DatabaseOutlined />,
        children: [
          { key: "brand", title: "Brand", link: "/brand/index", permissions: ["brand-list", "brand-create"] },
          { key: "product-model", title: "Product Model", link: "/product_model/index", permissions: ["product-model-list", "product-model-create"] },
          { key: "product-category", title: "Product Category", link: "/product_category/index", permissions: ["product-category-list", "product-category-create"] },
        ],
      },
    ],
  },
  { type: 'divider' },
  // ================= HR / PAYROLL =================
  {
    key: 'hr-group',
    type: 'group',
    label: 'HR / Payroll',
    children: [
      {
        key: "hr-dashboard",
        title: "Dashboard",
        icon: <DashboardOutlined />,
        link: "/hr_payroll/dashboard",
        permissions: ["hr-payroll-dashboard"],
      },
      {
        key: "employee",
        title: "Employee",
        icon: <UserOutlined />,
        children: [
          { key: "employee-master-data", title: "Master Data", link: "/employee-master-data", permissions: ["employee-master-data-list"] },
          { key: "employee-reports", title: "Employee Reports", link: "/employee/list", permissions: ["employee-list"] },
        ],
      },
      {
        key: "recruitment",
        title: "Recruitment",
        icon: <TeamOutlined />,
        children: [
          { key: "job-applicants", title: "Job Applicants", link: "/recruitment/applicant-list", permissions: ["careers-applicant-list"] },
          { key: "screening", title: "Screening", link: "/recruitment/screening-list", permissions: ["careers-screening-list"] },
          { key: "initial-interview", title: "Initial Interview", link: "/recruitment/initial-interview-list", permissions: ["careers-initial-interview-list"] },
          { key: "exam", title: "Exam", link: "/recruitment/iq-test-list", permissions: ["careers-iq-test-list"] },
          { key: "final-interview", title: "Final Interview", link: "/recruitment/final-interview-list", permissions: ["careers-final-interview-list"] },
          { key: "orientation", title: "Orientation", link: "/recruitment/orientation-list", permissions: ["careers-orientation-list"] },
        ],
      },
    ],
  },
  { type: 'divider' },
  // ================= INFORMATION SYSTEM =================
  {
    key: 'info-system-group',
    type: 'group',
    label: 'Information System',
    children: [
      {
        key: "email",
        title: "Email",
        icon: <MailOutlined />,
        children: [
          { key: "email-request", title: "Requests", link: "/email/request", permissions: ["email-list", "email-create"] },
          { key: "email-verification", title: "For Verification", link: "/email/verification", permissions: ["email-list", "email-manage-edit"] },
          { key: "email-approval", title: "For Approval", link: "/email/approval", permissions: ["email-approve_deny", "email-manage-edit"] },
          { key: "email-approved", title: "Approved Requests", link: "/email/approved", permissions: ["email-list"] },
        ],
      },
    ],
  },
  { type: 'divider' },
  // ================= SETUP & AUTH =================
  {
    key: 'setup-group',
    type: 'group',
    label: 'Set Up & Authorizations',
    children: [
      {
        key: "user-management",
        title: "User Management",
        icon: <UserOutlined />,
        children: [
          { key: "user-list", title: "User Accounts", link: "/users", permissions: ["user-list"] },
          { key: "user-create", title: "Create New", link: "/user/create", permissions: ["user-create"] },
        ],
      },
      {
        key: "roles",
        title: "Role",
        icon: <TeamOutlined />,
        link: "/role/index",
        permissions: ["role-list", "role-create"],
      },
      {
        key: "permissions",
        title: "Permission",
        icon: <SettingOutlined />,
        link: "/permissions",
        permissions: ["permission-list", "permission-create"],
      },
    ],
  },
  { type: 'divider' },
  // ================= SAP =================
  {
    key: 'sap-group',
    type: 'group',
    label: 'SAP Business One',
    children: [
      {
        key: "sap-financials",
        title: "Financials",
        icon: <DollarOutlined />,
        children: [
          { key: "sap-account-balance", title: "Account Balance", link: "/sap_business_one/account_balance", permissions: ["sap-account-balance"] },
          { key: "sap-journal-entry", title: "Journal Entry", link: "/sap_business_one/journal_entry", permissions: ["sap-journal-entry"] },
        ],
      },
      {
        key: "sap-database",
        title: "SAP Database",
        icon: <DatabaseOutlined />,
        link: "/sap_database/index",
        permissions: ["sap-database-list", "sap-database-create"],
      },
      {
        key: "sync-item-master",
        title: "Sync Item Master Data",
        icon: <SyncOutlined />,
        method: "confirmSyncItemMasterData",
        permissions: ["sap-database-list", "sap-database-create"],
      },
    ],
  },
];

// protected layout content based on permission and token
export default function ProtectedLayout({ children }: Props) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}

function LayoutContent({ children }: Props) {
  const pathname = usePathname();
  const { user, hasPermission, logout, loading } = useAuth();
  const [collapsed, setCollapsed] = React.useState(false);
  
  if (loading) return <p>Loading...</p>;
  if (!user) return null;

    // Build Menu Items with permissions
  const generateMenuItem = (item: any): any => {
    if (!item) return null;

    // Divider
    if (item.type === "divider") return { type: "divider" };

    // Group
    if (item.type === "group") {
      const children = item.children?.map(generateMenuItem).filter(Boolean);
      if (!children?.length) return null;

      const labelContent = (
        <span style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 8, 
          fontWeight: 600,       // bold
          color: "#0c3e6d"       // AntD dark blue
        }}>
          {item.icon && React.isValidElement(item.icon)
            ? React.cloneElement(item.icon, { style: { color: "#0c3e6d" } }) // match dark blue
            : item.icon}
          <span>{item.label}</span>
        </span>
      );

      return { type: "group", key: item.key, label: labelContent, children };
    }

    // Permission check
    if (item.permission && !hasPermission(item.permission)) return null;
    if (item.permissions && !item.permissions.some((p: string) => hasPermission(p))) return null;

    // Submenu
    if (item.children) {
      const children = item.children.map(generateMenuItem).filter(Boolean);
      if (!children.length) return null;

      return {
        key: item.key,
        icon: React.isValidElement(item.icon)
          ? React.cloneElement(item.icon, { style: { color: "#1890ff" } }) // primary color
          : item.icon,
        label: item.title,
        children,
      };
    }

    // Normal menu item with icon color control
    const isActive = item.key === activeKey;

    return {
      key: item.key,
      label: item.link ? <Link href={item.link}>{item.title}</Link> : item.title,
      icon: React.isValidElement(item.icon)
        ? React.cloneElement(item.icon as React.ReactElement, {
            style: { color: isActive ? undefined : "#1890ff" }, // primary color if inactive
          })
        : item.icon,
    };
  };

      
  // Determine active menu key based on pathname
  // const findActiveKey = () => {
  //   for (let item of menuData) {
  //     if (item.link && pathname.startsWith(item.link)) return item.key;
  //     if (item.children) {
  //       const child = item.children.find(c => pathname.startsWith(c.link!));
  //       if (child) return child.key;
  //     }
  //   }
  //   return "";
  // };

  // const findOpenKeys = () => {
  //   const openKeys: string[] = [];
  //   menuData.forEach(group => {
  //     if (group.children) {
  //       const activeChild = group.children.find(child => pathname.startsWith(child.link!));
  //       if (activeChild) openKeys.push(group.key);
  //     }
  //   });
  //   return openKeys;
  // };

  // Build dropdown items
  const avatarMenu: MenuProps["items"] = [
    {
      key: "profile",
      label: "Profile",
      icon: <LogoutOutlined />,
      onClick: logout,
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: logout,
    },
  ];

  // Determine active key and open keys recursively
  const getMenuState = (menuItems: any[], path: string) => {
    let activeKey = "";
    let openKeys: string[] = [];

    const traverse = (items: any[], parents: string[] = []) => {
      for (let item of items) {
        if (!item) continue;
        // Skip dividers
        if (item.type === "divider") continue;

        // If normal menu item with link matches path
        if (item.link && path.startsWith(item.link)) {
          activeKey = item.key;
          openKeys = [...parents]; // all parent keys should be open
          return true; // stop traversing
        }

        // If group or submenu with children, recurse
        if (item.children) {
          if (traverse(item.children, [...parents, item.key])) return true;
        }
      }
      return false;
    };

    traverse(menuItems);
    return { activeKey, openKeys };
  };

  const { activeKey, openKeys } = getMenuState(menuData, pathname);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth={0}
        trigger={null}
        width={240}
        style={{ background: "#fff" }} // <-- make sidebar white
      >
        <div style={{ padding: collapsed ? 8 : 16, textAlign: "center" }}>
          <Avatar src="/default-profile.png" size={collapsed ? 40 : 64} />
          {!collapsed && (
            <Title level={5} style={{ marginTop: 8, fontSize: 14 }}>
              {/* {user.name} */}
              xavierdEr
            </Title>
          )}
        </div>
        <Divider style={{ marginTop: -10, marginBottom: 0, borderColor: "rgba(0,195,255,0.25)" }} />
        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          defaultOpenKeys={openKeys}
          items={menuData.map(generateMenuItem).filter(Boolean)}
          style={{
            height: 'calc(100vh - 112px)',
            overflowY: 'auto',
            background: "#fff",
            border: "none",
          }}
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header
          style={{
            height: 40,
            padding: "0 16px",
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Button type="text" icon={<MenuOutlined />} onClick={() => setCollapsed(!collapsed)} />
          <Dropdown menu={{ items: avatarMenu }} placement="bottomRight">
            <Button type="text" style={{marginRight: "-10px"}}>
              <Avatar src="/default-profile.png" />
            </Button>
          </Dropdown>
        </Header>

        {/* Main Content */}
        <Content
          style={{
            margin: 10,
            background: "#fff",
            padding: 24,
            overflow: "auto",       // <-- make only content scrollable
            height: "calc(100vh - 40px - 20px)", // 100vh minus header height and margin
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}