// services/orderService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const orderService = {
  // Tüm siparişleri getir
  getAll: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/orders`);
      return response.data;
    } catch (error) {
      throw new Error('Siparişler yüklenirken hata oluştu');
    }
  },

  // Belirli siparişi getir
  getById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Sipariş bilgisi yüklenirken hata oluştu');
    }
  },

  // Yeni sipariş oluştur
  create: async (orderData) => {
    try {
      const response = await axios.post(`${BASE_URL}/orders`, orderData);
      return response.data;
    } catch (error) {
      throw new Error('Sipariş oluşturulurken hata oluştu');
    }
  },

  // Sipariş güncelle
  update: async (id, orderData) => {
    try {
      const response = await axios.put(`${BASE_URL}/orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      throw new Error('Sipariş güncellenirken hata oluştu');
    }
  },

  // Sipariş sil
  delete: async (id) => {
    try {
      await axios.delete(`${BASE_URL}/orders/${id}`);
      return true;
    } catch (error) {
      throw new Error('Sipariş silinirken hata oluştu');
    }
  },

  // Müşteri adını almak için
  getCustomerName: async (customerId) => {
    try {
      const response = await axios.get(`${BASE_URL}/customers/${customerId}`);
      return response.data.name;
    } catch (error) {
      return 'Bilinmeyen Müşteri';
    }
  }
};