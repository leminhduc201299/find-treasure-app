import axios from 'axios';
import { CalculateRequest, CalculateResponse, TreasureMap } from '../types';

const API_URL = 'https://localhost:44344/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hàm chuẩn hóa tên dữ liệu từ API (PascalCase) sang frontend (camelCase)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeData = <T>(data: unknown): T => {
  if (!data) return data as T;
  
  if (Array.isArray(data)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map(item => normalizeData<any>(item)) as T;
  }
  
  if (typeof data === 'object' && data !== null) {
    const normalized: Record<string, unknown> = {};
    
    Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
      // Chuyển key từ PascalCase sang camelCase
      const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
      normalized[camelKey] = normalizeData<unknown>(value);
    });
    
    return normalized as T;
  }
  
  return data as T;
};

export const calculateTreasure = async (data: CalculateRequest): Promise<CalculateResponse> => {
  try {
    console.log('Sending data to API:', data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await api.post<any>('/calculate', data);
    console.log('Raw response from API:', response.data);
    
    // Chuẩn hóa dữ liệu từ PascalCase sang camelCase
    const normalizedData = normalizeData<CalculateResponse>(response.data);
    console.log('Normalized response:', normalizedData);
    
    return normalizedData;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

export const getHistory = async (): Promise<TreasureMap[]> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await api.get<any[]>('/calculate');
    console.log('Raw history response:', response.data);
    
    // Chuẩn hóa dữ liệu từ PascalCase sang camelCase
    const normalizedData = normalizeData<TreasureMap[]>(response.data);
    console.log('Normalized history:', normalizedData);
    
    return normalizedData;
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
};

export const getDetail = async (id: number): Promise<TreasureMap> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await api.get<any>(`/calculate/${id}`);
    console.log('Raw detail response:', response.data);
    
    // Chuẩn hóa dữ liệu từ PascalCase sang camelCase
    const normalizedData = normalizeData<TreasureMap>(response.data);
    console.log('Normalized detail:', normalizedData);
    
    return normalizedData;
  } catch (error) {
    console.error('Error fetching detail:', error);
    throw error;
  }
}; 