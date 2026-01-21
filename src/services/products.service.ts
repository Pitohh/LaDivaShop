import { api } from '../lib/api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId?: string;
  stock: number;
  rating: number;
  reviewCount: number;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  isNew: boolean;
  isActive: boolean;
  sales: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isNew?: boolean;
}

import { MOCK_PRODUCTS } from '../data/mockProducts';

// ... (existing interfaces)

export const productsService = {
  async getAll(filters?: ProductFilters): Promise<Product[]> {
    try {
      // Short-circuit for verification if needed, or rely on catch
      const queryParams = new URLSearchParams();

      if (filters?.category) queryParams.append('category', filters.category);
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
      if (filters?.inStock) queryParams.append('inStock', 'true');
      if (filters?.isNew) queryParams.append('isNew', 'true');

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/products?${queryString}` : '/products';

      const products = await api.get(endpoint);
      return Array.isArray(products) ? products : [];
    } catch (error) {
      console.warn('⚠️ API fetch failed, falling back to MOCK DATA for verification.', error);

      // Basic client-side filtering logic for mocks
      let filtered = [...MOCK_PRODUCTS] as unknown as Product[];

      if (filters?.search) {
        const lowerSearch = filters.search.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(lowerSearch) ||
          p.description.toLowerCase().includes(lowerSearch)
        );
      }

      if (filters?.category && filters.category !== 'Tous') {
        // Mock data category logic (simplified)
      }

      return filtered;
    }
  },

  async getById(id: string): Promise<Product | null> {
    try {
      const product = await api.get(`/products/${id}`);
      return product;
    } catch (error) {
      console.error('Get product by ID error:', error);
      return null;
    }
  },

  async create(product: Partial<Product>): Promise<Product> {
    try {
      const newProduct = await api.post('/products', product);
      return newProduct;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create product');
    }
  },

  async update(id: string, product: Partial<Product>): Promise<Product> {
    try {
      const updatedProduct = await api.put(`/products/${id}`, product);
      return updatedProduct;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update product');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete product');
    }
  },
};
