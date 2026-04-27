"use client";

import { useForm, Controller } from "react-hook-form";
import { Form, Input, Button, Typography, Alert } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const { Title, Text } = Typography;

interface Props {
  loading: boolean;
  isInvalid: boolean;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  onSubmit: (data: any) => void;
}

export default function LoginView({
  loading,
  isInvalid,
  showPassword,
  setShowPassword,
  onSubmit,
}: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({ mode: "onChange" });

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#f6ffed",
      }}
    >
      {/* ── Left panel — image / GIF ──────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          background: "#389e0d",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
          gap: 24,
          // Hide on small screens via inline media query workaround:
          // wrap in a CSS class in globals.css for full responsiveness
        }}
        className="login-left-panel"
      >
        {/* 
          Replace src with your GIF or illustration path.
          e.g. src="/assets/login-animation.gif"
               src="/assets/dashboard-preview.png"
        */}
        <img
          src="/img/login/login2.jpg"
          alt="Welcome illustration"
          style={{
            width: "100%",
            maxWidth: 1080,
            borderRadius: 16,
            objectFit: "contain",
          }}
          // Fallback: hide broken image icon gracefully
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />

        <div style={{ textAlign: "center", color: "#fff" }}>
          <Title level={3} style={{ color: "#fff", margin: 0 }}>
            Welcome Back
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 24 }}>
            Human Resource Information System
          </Text>
        </div>

        {/* Decorative dots */}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: i === 1 ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === 1 ? "#fff" : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────────────────────── */}
      <div
        style={{
          width: 440,
          flexShrink: 0,
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "48px 48px",
          boxShadow: "-2px 0 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* Logo / brand mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "#389e0d",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Replace with your <img src="/logo.png" /> */}
            <Text style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>HR</Text>
          </div>
          <div>
            <Text style={{ fontWeight: 600, fontSize: 15, color: "#1a4d0f", display: "block", lineHeight: 1.2 }}>
              ADDESSA Corporation
            </Text>
            <Text style={{ fontSize: 11, color: "#8c8c8c" }}>Human Resource Information System</Text>
          </div>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: 28 }}>
          <Title level={3} style={{ margin: 0, color: "#1a4d0f" }}>
            Sign in
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Enter your credentials to continue
          </Text>
        </div>

        {/* Error alert */}
        {isInvalid && (
          <Alert
            type="error"
            message="Invalid email or password. Please try again."
            showIcon
            style={{ marginBottom: 20, borderRadius: 8 }}
          />
        )}

        {/* Form */}
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} requiredMark={false}>
          <Form.Item
            label={<Text style={{ fontSize: 13, fontWeight: 500 }}>Email address</Text>}
            validateStatus={errors.email ? "error" : ""}
            help={errors.email?.message?.toString()}
          >
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  size="large"
                  placeholder="you@company.com"
                  onBlur={() => trigger("email")}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("email");
                  }}
                  style={{ borderRadius: 8 }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <Text style={{ fontSize: 13, fontWeight: 500 }}>Password</Text>
                {/* Optional: add forgot password link here */}
                {/* <a href="/forgot-password" style={{ fontSize: 12, color: "#389e0d" }}>Forgot password?</a> */}
              </div>
            }
            validateStatus={errors.password ? "error" : ""}
            help={errors.password?.message?.toString()}
          >
            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  size="large"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ borderRadius: 8 }}
                />
              )}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={{ borderRadius: 8, height: 44, fontWeight: 500 }}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>

        {/* Footer note */}
        <Text
          type="secondary"
          style={{ fontSize: 12, textAlign: "center", marginTop: 24 }}
        >
          Having trouble? Contact your system administrator.
        </Text>
      </div>
    </div>
  );
}