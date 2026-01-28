import { supabase } from '../lib/supabase';

export interface Content {
  id: string;
  section: string;
  key: string;
  value: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export const contentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .order('section');

    if (error) {
      throw new Error(error.message);
    }

    return data.map(content => ({
      id: content.id,
      section: content.section,
      key: content.key,
      value: content.value,
      type: content.type,
      createdAt: content.created_at,
      updatedAt: content.updated_at,
    }));
  },

  async getBySection(section: string) {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('section', section);

    if (error) {
      throw new Error(error.message);
    }

    return data.map(content => ({
      id: content.id,
      section: content.section,
      key: content.key,
      value: content.value,
      type: content.type,
      createdAt: content.created_at,
      updatedAt: content.updated_at,
    }));
  },

  async getBySectionAndKey(section: string, key: string) {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('section', section)
      .eq('key', key)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      section: data.section,
      key: data.key,
      value: data.value,
      type: data.type,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async update(section: string, key: string, value: string) {
    const { data, error } = await supabase
      .from('content')
      .update({ value })
      .eq('section', section)
      .eq('key', key)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async create(content: Partial<Content>) {
    const { data, error } = await supabase
      .from('content')
      .insert({
        section: content.section,
        key: content.key,
        value: content.value,
        type: content.type || 'text',
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async delete(section: string, key: string) {
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('section', section)
      .eq('key', key);

    if (error) {
      throw new Error(error.message);
    }
  },
};
