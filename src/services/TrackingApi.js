import Axios from "../utils/Axios";

class TrackingApi {
  // Get order details by ID
  static async getOrderById(orderId) {
    try {
      const response = await Axios.get(`/orders/getOrderById/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }

  // Track order by AWB code
  static async trackByAwb(awbCode) {
    try {
      const response = await Axios.get(`/shipping/track/${awbCode}`);
      return response.data;
    } catch (error) {
      console.error("Error tracking order:", error);
      throw error;
    }
  }

  // Get user orders
  static async getUserOrders(userId) {
    try {
      const response = await Axios.get(`/orders/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user orders:", error);
      throw error;
    }
  }

  // Get real-time tracking updates
  static async getTrackingUpdates(orderId) {
    try {
      const response = await Axios.get(`/orders/${orderId}/tracking`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tracking updates:", error);
      throw error;
    }
  }

  // Update order status (admin only)
  static async updateOrderStatus(orderId, status) {
    try {
      const response = await Axios.put(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  }

  // Get Shiprocket tracking details
  static async getShiprocketTracking(shipmentId) {
    try {
      const response = await Axios.get(`/shipping/shiprocket/track/${shipmentId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Shiprocket tracking:", error);
      throw error;
    }
  }

  // Cancel order
  static async cancelOrder(orderId, reason) {
    try {
      const response = await Axios.put(`/orders/${orderId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      console.error("Error cancelling order:", error);
      throw error;
    }
  }

  // Request return/exchange
  static async requestReturn(orderId, items, reason) {
    try {
      const response = await Axios.post(`/orders/${orderId}/return`, {
        items,
        reason
      });
      return response.data;
    } catch (error) {
      console.error("Error requesting return:", error);
      throw error;
    }
  }
}

export default TrackingApi;
