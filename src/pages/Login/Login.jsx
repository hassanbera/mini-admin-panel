import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Form, Input, Button, Alert } from "antd";
import style from "./styles"
import { UserOutlined, LoginOutlined } from '@ant-design/icons';

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
    <div style={style.loginContainerStyle}>
      <div style={style.loginBoxStyle}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#333' }}>Giriş Yap</h2>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '16px' }} />}
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            label="E-posta"
            name="email"
            rules={[{ required: true, message: 'Lütfen e-postanızı girin!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="E-posta" />
          </Form.Item>
          <Form.Item
            label="Şifre"
            name="password"
            rules={[{ required: true, message: 'Lütfen şifrenizi girin!' }]}
          >
            <Input.Password prefix={<LoginOutlined />} placeholder="Şifre" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
              Giriş Yap
            </Button>
          </Form.Item>
        </Form>
        <div style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
          <p>Admin: admin@example.com / 123456</p>
          <p>Viewer: viewer@example.com / 654321</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
