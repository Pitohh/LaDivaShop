import { supabase } from '../lib/supabase';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const ordersService = {
  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data.map(order => ({
      id: order.id,
      userId: order.user_id,
      status: order.status,
      totalAmount: order.total_amount,
      items: order.items,
      shippingAddress: order.shipping_address,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      notes: order.notes,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    }));
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('orders')
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
      userId: data.user_id,
      status: data.status,
      totalAmount: data.total_amount,
      items: data.items,
      shippingAddress: data.shipping_address,
      paymentMethod: data.payment_method,
      paymentStatus: data.payment_status,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data.map(order => ({
      id: order.id,
      userId: order.user_id,
      status: order.status,
      totalAmount: order.total_amount,
      items: order.items,
      shippingAddress: order.shipping_address,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      notes: order.notes,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    }));
  },

  async create(order: Partial<Order>) {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: session.user.id,
        status: order.status || 'pending',
        total_amount: order.totalAmount,
        items: order.items,
        shipping_address: order.shippingAddress,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus || 'pending',
        notes: order.notes,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async updateStatus(id: string, status: string, paymentStatus?: string) {
    const updateData: any = { status };
    if (paymentStatus) {
      updateData.payment_status = paymentStatus;
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
};
