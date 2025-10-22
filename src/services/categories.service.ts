import { supabase } from '../lib/supabase';

export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const categoriesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      throw new Error(error.message);
    }

    return data.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      isActive: category.is_active,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
    }));
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async create(category: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: category.name,
        description: category.description || '',
        is_active: category.isActive !== undefined ? category.isActive : true,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async update(id: string, category: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: category.name,
        description: category.description,
        is_active: category.isActive,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  },
};
