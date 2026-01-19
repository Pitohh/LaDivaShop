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

export const productsService = {
  async getAll(filters?: ProductFilters): Promise<Product[]> {
    try {
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
      return products;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch products');
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
