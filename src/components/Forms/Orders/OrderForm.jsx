// pages/Orders/OrderForm.jsx
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, message, Select, DatePicker, InputNumber } from 'antd';
import dayjs from 'dayjs';
import { orderService } from '../../../services/orderService';
import { customersService } from '../../../services/customersService';
import { useAuth } from '../../../contexts/AuthContext';
const { Option } = Select;

const OrderForm = ({ order, viewMode = false, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const { canCreate, canUpdate } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const statusOptions = [
    { value: 'Pending', label: 'Beklemede', color: 'orange' },
    { value: 'Completed', label: 'Tamamlandı', color: 'green' },
    { value: 'Cancelled', label: 'İptal Edildi', color: 'red' }
  ];

  useEffect(() => {
    fetchCustomers();
    if (order) {
      const formData = {
        ...order,
        orderDate: order.orderDate ? dayjs(order.orderDate) : null
      };
      form.setFieldsValue(formData);
    } else {
      form.resetFields();
    }
  }, [order, form]);

  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const data = await customersService.getAll();
      setCustomers(data);
    } catch (error) {
      message.error('Müşteriler yüklenirken hata oluştu');
    }
    setLoadingCustomers(false);
  };

  const handleSubmit = async (values) => {
    try {
      const orderData = {
        ...values,
        orderDate: values.orderDate ? values.orderDate.format('YYYY-MM-DD') : null
      };

      if (order) {
        // Güncelleme
        if (!canUpdate()) {
          message.error('Güncelleme yetkiniz bulunmamaktadır.');
          return;
        }
        await orderService.update(order.id, orderData);
        message.success('Sipariş başarıyla güncellendi');
      } else {
        // Yeni ekleme
        if (!canCreate()) {
          message.error('Ekleme yetkiniz bulunmamaktadır.');
          return;
        }
        await orderService.create(orderData);
        message.success('Sipariş başarıyla eklendi');
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
        label="Müşteri"
        name="customerId"
        rules={[
          { required: true, message: 'Müşteri seçimi zorunludur' }
        ]}
      >
        <Select
          placeholder="Müşteri seçiniz"
          loading={loadingCustomers}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {customers.map(customer => (
            <Option key={customer.id} value={customer.id}>
              {customer.name} - {customer.email}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Sipariş Tarihi"
        name="orderDate"
        rules={[
          { required: true, message: 'Sipariş tarihi zorunludur' }
        ]}
      >
        <DatePicker
          style={{ width: '100%' }}
          format="DD/MM/YYYY"
          placeholder="Sipariş tarihini seçiniz"
        />
      </Form.Item>

      <Form.Item
        label="Tutar (₺)"
        name="amount"
        rules={[
          { required: true, message: 'Tutar zorunludur' },
          { type: 'number', min: 0, message: 'Tutar 0\'dan büyük olmalıdır' }
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder="Sipariş tutarı"
          precision={2}
          min={0}
          formatter={value => `₺ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/₺\s?|(,*)/g, '')}
        />
      </Form.Item>

      <Form.Item
        label="Durum"
        name="status"
        rules={[
          { required: true, message: 'Durum seçimi zorunludur' }
        ]}
      >
        <Select placeholder="Sipariş durumunu seçiniz">
          {statusOptions.map(status => (
            <Option key={status.value} value={status.value}>
              {status.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {!viewMode && (
        <Form.Item style={{ marginTop: 24 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              {order ? 'Güncelle' : 'Kaydet'}
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

export default OrderForm;