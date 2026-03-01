"use client";

import { useForm, Controller } from "react-hook-form";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Alert,
  Space,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";

interface Props {
  loading: boolean;
  isInvalid: boolean;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  onSubmit: (data: any) => void;
}

const { Title } = Typography;

export default function LoginView({
  loading,
  isInvalid,
  showPassword,
  setShowPassword,
  onSubmit,
}: Props) {
  const { control, handleSubmit, formState: { errors }, trigger } = useForm({
    mode: "onChange", // validates on each change
  });

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      }}
    >
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          Login
        </Title>

        {isInvalid && (
          <Alert
            type="error"
            title="Invalid Credentials"
            style={{ marginBottom: 16 }}
          />
        )}

        <Form
          layout="vertical"
          onFinish={handleSubmit(onSubmit)}
        >
          <Form.Item
            label="Email"
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
                  onBlur={() => trigger("email")} // trigger validation on blur
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("email"); // validate on change
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Password"
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
                  type={showPassword ? "text" : "password"}
                  iconRender={visible =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}