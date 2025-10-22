import { supabase } from '../lib/supabase';

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
  async getAll(filters?: ProductFilters) {
    let query = supabase
      .from('products')
      .select('*, categories(name)')
      .eq('is_active', true);

    if (filters?.category && filters.category !== 'Tous') {
      query = query.eq('categories.name', filters.category);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters?.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters?.inStock) {
      query = query.gt('stock', 0);
    }

    if (filters?.isNew) {
      query = query.eq('is_new', true);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.original_price,
      categoryId: product.category_id,
      stock: product.stock,
      rating: product.rating,
      reviewCount: product.review_count,
      images: product.images,
      features: product.features,
      specifications: product.specifications,
      isNew: product.is_new,
      isActive: product.is_active,
      sales: product.sales,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    }));
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('id', id)
      .eq('is_active', true)
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
      price: data.price,
      originalPrice: data.original_price,
      categoryId: data.category_id,
      stock: data.stock,
      rating: data.rating,
      reviewCount: data.review_count,
      images: data.images,
      features: data.features,
      specifications: data.specifications,
      isNew: data.is_new,
      isActive: data.is_active,
      sales: data.sales,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async create(product: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: product.name,
        description: product.description,
        price: product.price,
        original_price: product.originalPrice,
        category_id: product.categoryId,
        stock: product.stock || 0,
        images: product.images || [],
        features: product.features || [],
        specifications: product.specifications || {},
        is_new: product.isNew || false,
        is_active: product.isActive !== undefined ? product.isActive : true,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async update(id: string, product: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        price: product.price,
        original_price: product.originalPrice,
        category_id: product.categoryId,
        stock: product.stock,
        images: product.images,
        features: product.features,
        specifications: product.specifications,
        is_new: product.isNew,
        is_active: product.isActive,
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
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  },

  async updateStock(id: string, stock: number) {
    const { data, error } = await supabase
      .from('products')
      .update({ stock })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
};
