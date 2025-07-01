
import { useEffect } from 'react';
import { Form, Input, Button, Space, message } from 'antd';
import { customersService } from '../../../services/customersService';
import { useAuth } from '../../../contexts/AuthContext';

const CustomerForm = ({ customer, viewMode = false, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const { canCreate, canUpdate } = useAuth();

  useEffect(() => {
    if (customer) {
      form.setFieldsValue(customer);
    } else {
      form.resetFields();
    }
  }, [customer, form]);

  const handleSubmit = async (values) => {
    try {
      if (customer) {
        // Güncelleme
        if (!canUpdate()) {
          message.error('Güncelleme yetkiniz bulunmamaktadır.');
          return;
        }
        await customersService.update(customer.id, values);
        message.success('Müşteri başarıyla güncellendi');
      } else {
        // Yeni ekleme
        if (!canCreate()) {
          message.error('Ekleme yetkiniz bulunmamaktadır.');
          return;
        }
        await customersService.create(values);
        message.success('Müşteri başarıyla eklendi');
      }
      onSuccess?.();
    } catch (error) {
      message.error(error.message || 'İşlem sırasında hata oluştu');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      disabled={viewMode}
    >
      <Form.Item
        label="Ad Soyad"
        name="name"
        rules={[
          { required: true, message: 'Ad soyad zorunludur' },
          { min: 2, message: 'Ad soyad en az 2 karakter olmalıdır' }
        ]}
      >
        <Input placeholder="Müşteri adı soyadı" />
      </Form.Item>

      <Form.Item
        label="E-posta"
        name="email"
        rules={[
          { required: true, message: 'E-posta zorunludur' },
          { type: 'email', message: 'Geçerli bir e-posta adresi giriniz' }
        ]}
      >
        <Input placeholder="ornek@email.com" />
      </Form.Item>

      <Form.Item
        label="Telefon"
        name="phone"
        rules={[
          { required: true, message: 'Telefon numarası zorunludur' },
          { pattern: /^[\+]?[\d\s\-\(\)]+$/, message: 'Geçerli bir telefon numarası giriniz' }
        ]}
      >
        <Input placeholder="+90 555 123 45 67" />
      </Form.Item>

      <Form.Item
        label="Adres"
        name="address"
        rules={[
          { required: true, message: 'Adres zorunludur' },
          { min: 10, message: 'Adres en az 10 karakter olmalıdır' }
        ]}
      >
        <Input.TextArea 
          rows={3} 
          placeholder="Müşteri adresi"
          showCount
          maxLength={200}
        />
      </Form.Item>

      {!viewMode && (
        <Form.Item style={{ marginTop: 24 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              {customer ? 'Güncelle' : 'Kaydet'}
            </Button>
            <Button onClick={onCancel}>
              İptal
            </Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  );
};

export default CustomerForm;