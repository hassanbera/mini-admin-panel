
import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const customersService = {
  // Tüm müşterileri getir
  getAll: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/customers`);
      return response.data;
    } catch (error) {
      throw new Error('Müşteriler yüklenirken hata oluştu');
    }
  },

  // Belirli müşteriyi getir
  getById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/customers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Müşteri bilgisi yüklenirken hata oluştu');
    }
  },

  // Yeni müşteri oluştur
  create: async (customerData) => {
    try {
      const response = await axios.post(`${BASE_URL}/customers`, customerData);
      return response.data;
    } catch (error) {
      throw new Error('Müşteri oluşturulurken hata oluştu');
    }
  },

  // Müşteri güncelle
  update: async (id, customerData) => {
    try {
      const response = await axios.put(`${BASE_URL}/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      throw new Error('Müşteri güncellenirken hata oluştu');
    }
  },

  // Müşteri sil
  delete: async (id) => {
    try {
      await axios.delete(`${BASE_URL}/customers/${id}`);
      return true;
    } catch (error) {
      throw new Error('Müşteri silinirken hata oluştu');
    }
  }
};