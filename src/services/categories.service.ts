import { api } from '../lib/api';

export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    try {
      const categories = await api.get('/categories');
      return categories;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch categories');
    }
  },

  async getById(id: string): Promise<Category | null> {
    try {
      const category = await api.get(`/categories/${id}`);
      return category;
    } catch (error) {
      console.error('Get category by ID error:', error);
      return null;
    }
  },

  async create(category: Partial<Category>): Promise<Category> {
    try {
      const newCategory = await api.post('/categories', category);
      return newCategory;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create category');
    }
  },

  async update(id: string, category: Partial<Category>): Promise<Category> {
    try {
      const updatedCategory = await api.put(`/categories/${id}`, category);
      return updatedCategory;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update category');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/categories/${id}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete category');
    }
  },
};
