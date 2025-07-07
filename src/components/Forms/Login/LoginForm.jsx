// src/components/Forms/Auth/LoginForm.jsx
import { Form, Input, Button, Alert } from "antd";
import { UserOutlined, LoginOutlined } from '@ant-design/icons';

/**
 * LoginForm Component
 * This component handles the presentation and logic of the login form itself.
 * It receives props for handling form submission, displaying errors, and showing loading state.
 *
 * @param {object} props - The component props.
 * @param {function} props.onFinish - Function to call when the form is submitted.
 * @param {string|null} props.error - Error message to display, or null if no error.
 * @param {boolean} props.loading - Boolean indicating if the form is currently submitting.
 */
const LoginForm = ({ onFinish, error, loading }) => {
  const [form] = Form.useForm();

  return (
    <>
      {/* Display error message if present */}
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '16px' }} />}

      {/* Ant Design Form for login */}
      <Form form={form} onFinish={onFinish} layout="vertical">
        {/* Email Input Field */}
        <Form.Item
          label="E-posta"
          name="email"
          rules={[{ required: true, message: 'Lütfen e-postanızı girin!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="E-posta" />
        </Form.Item>

        {/* Password Input Field */}
        <Form.Item
          label="Şifre"
          name="password"
          rules={[{ required: true, message: 'Lütfen şifrenizi girin!' }]}
        >
          <Input.Password prefix={<LoginOutlined />} placeholder="Şifre" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: '100%', borderRadius: '8px' }} // Added rounded corners
            loading={loading}
          >
            Giriş Yap
          </Button>
        </Form.Item>
      </Form>

    </>
  );
};

export default LoginForm;
