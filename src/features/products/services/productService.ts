// Product service - API-ready with mock data fallback
// import axios from 'axios';
// const API_URL = '/api/products';

import type { Product } from '@/types/common';

// export const getProducts = () => axios.get<Product[]>(API_URL);
// export const getProduct = (id: string) => axios.get<Product>(`${API_URL}/${id}`);
// export const createProduct = (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'deleted'>) => axios.post<Product>(API_URL, data);
// export const updateProduct = (id: string, data: Partial<Product>) => axios.put<Product>(`${API_URL}/${id}`, data);
// export const deleteProduct = (id: string) => axios.delete(`${API_URL}/${id}`);

// Currently using DataContext for state management with mock data.
// To switch to API: uncomment the above and replace DataContext calls in the page component.
export {};
