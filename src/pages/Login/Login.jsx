import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Form, Input, Button, Alert } from "antd";
import { loginContainer } from "./styles";

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login, error, loading } = useAuth();

  const onFinish = async (values) => {
    const success = await login(values.email, values.password);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div style={loginContainer}>
      <h2>Giriş Yap</h2>
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="E-posta" name="email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Şifre" name="password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Giriş Yap
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
