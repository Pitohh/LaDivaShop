import { api } from '../lib/api';

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
  async getAll(): Promise<Order[]> {
    try {
      const orders = await api.get('/orders');
      return orders;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch orders');
    }
  },

  async getById(id: string): Promise<Order | null> {
    try {
      const order = await api.get(`/orders/${id}`);
      return order;
    } catch (error) {
      console.error('Get order by ID error:', error);
      return null;
    }
  },

  async create(order: Partial<Order>): Promise<Order> {
    try {
      const newOrder = await api.post('/orders', order);
      return newOrder;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create order');
    }
  },

  async updateStatus(id: string, status: string, paymentStatus?: string): Promise<Order> {
    try {
      const updateData: any = { status };
      if (paymentStatus) {
        updateData.paymentStatus = paymentStatus;
      }

      const updatedOrder = await api.put(`/orders/${id}`, updateData);
      return updatedOrder;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update order');
    }
  },

  async cancel(id: string): Promise<Order> {
    try {
      const canceledOrder = await api.post(`/orders/${id}/cancel`, {});
      return canceledOrder;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to cancel order');
    }
  },
};
