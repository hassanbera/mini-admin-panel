// pages/Customers/Customers.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Tag, Input, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import RoleGuard from '../../utils/RoleGuard';
import CustomerForm from '../../components/Forms/Customers/CustomerForm';
import { customersService } from '../../services/customersService';

const { Search } = Input;

const CustomersPage = () => {
  const { canCreate, canUpdate, canDelete, userRole, userName } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [searchText, setSearchText] = useState('');

  const columns = [
    {
      title: 'Ad Soyad',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Adres',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
      width: 250,
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="default"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record)}
          >
            Görüntüle
          </Button>
          
          <RoleGuard 
            permission="update"
            showTooltip={true}
            tooltipTitle="Düzenleme yetkisi sadece admin kullanıcıda bulunur."
          >
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
              disabled={!canUpdate()}
            >
              Düzenle
            </Button>
          </RoleGuard>
          
          <RoleGuard 
            permission="delete"
            showTooltip={true}
            tooltipTitle="Silme yetkisi sadece admin kullanıcıda bulunur."
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => handleDelete(record)}
              disabled={!canDelete()}
            >
              Sil
            </Button>
          </RoleGuard>
        </Space>
      ),
    },
  ];

  const handleView = (customer) => {
    setEditingCustomer(customer);
    setViewMode(true);
    setModalVisible(true);
  };

  const handleEdit = (customer) => {
    if (!canUpdate()) {
      message.warning('Düzenleme yetkisi sadece admin kullanıcıda bulunur.');
      return;
    }
    setEditingCustomer(customer);
    setViewMode(false);
    setModalVisible(true);
  };

  const handleDelete = (customer) => {
    if (!canDelete()) {
      message.warning('Silme yetkisi sadece admin kullanıcıda bulunur.');
      return;
    }

    Modal.confirm({
      title: 'Müşteriyi silmek istediğinizden emin misiniz?',
      content: `${customer.name} adlı müşteri silinecektir.`,
      okText: 'Evet',
      cancelText: 'Hayır',
      onOk: async () => {
        try {
          await customersService.delete(customer.id);
          message.success('Müşteri başarıyla silindi');
          fetchCustomers();
        } catch (error) {
          message.error('Müşteri silinirken hata oluştu');
        }
      },
    });
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(value.toLowerCase()) ||
        customer.email.toLowerCase().includes(value.toLowerCase()) ||
        customer.phone.includes(value) ||
        customer.address.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await customersService.getAll(); // Debugging line
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      message.error('Müşteriler yüklenirken hata oluştu');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ margin: 0, marginBottom: 8 }}>Müşteri Yönetimi</h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span>Kullanıcı: {userName}</span>
              <Tag color={userRole === 'admin' ? 'green' : 'blue'}>
                {userRole === 'admin' ? 'Yönetici' : 'Görüntüleyici'}
              </Tag>
            </div>
          </div>
          
          <RoleGuard 
            permission="create"
            showTooltip={true}
            tooltipTitle="Yeni müşteri ekleme yetkisi sadece admin kullanıcıda bulunur."
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                if (!canCreate()) {
                  message.warning('Yeni müşteri ekleme yetkisi sadece admin kullanıcıda bulunur.');
                  return;
                }
                setEditingCustomer(null);
                setViewMode(false);
                setModalVisible(true);
              }}
              disabled={!canCreate()}
            >
              Yeni Müşteri
            </Button>
          </RoleGuard>
        </div>

        {/* Arama */}
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Müşteri ara (ad, email, telefon, adres)"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ maxWidth: 400 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredCustomers}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} / ${total} müşteri`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      <Modal
        title={
          viewMode 
            ? 'Müşteri Detayları' 
            : editingCustomer 
              ? 'Müşteri Düzenle' 
              : 'Yeni Müşteri'
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setViewMode(false);
        }}
        footer={viewMode ? null : undefined}
        width={600}
      >
        <CustomerForm
          customer={editingCustomer}
          viewMode={viewMode}
          onSuccess={() => {
            setModalVisible(false);
            setViewMode(false);
            fetchCustomers();
          }}
          onCancel={() => {
            setModalVisible(false);
            setViewMode(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default CustomersPage;