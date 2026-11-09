import { useState, useEffect, useCallback } from "react";
import TrackingApi from "../services/TrackingApi";

const useOrderTracking = (orderId) => {
  const [order, setOrder] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch order details
  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await TrackingApi.getOrderById(orderId);
      setOrder(response.order);
      
      // Auto-fetch tracking if AWB code exists
      if (response.order?.shipping?.shiprocket?.awb_code) {
        fetchTracking(response.order.shipping.shiprocket.awb_code);
      }
    } catch (err) {
      setError("Failed to fetch order details");
      console.error("Order fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  // Fetch tracking data
  const fetchTracking = useCallback(async (awbCode) => {
    if (!awbCode) return;
    
    setTrackingLoading(true);
    
    try {
      const response = await TrackingApi.trackByAwb(awbCode);
      setTrackingData(response);
    } catch (err) {
      console.error("Tracking fetch error:", err);
      // Don't set error for tracking failures as order details are more important
    } finally {
      setTrackingLoading(false);
    }
  }, []);

  // Refresh tracking data
  const refreshTracking = useCallback(() => {
    if (order?.shipping?.shiprocket?.awb_code) {
      fetchTracking(order.shipping.shiprocket.awb_code);
    }
  }, [order, fetchTracking]);

  // Auto-refresh tracking every 5 minutes
  useEffect(() => {
    if (!order?.shipping?.shiprocket?.awb_code) return;
    
    const interval = setInterval(() => {
      refreshTracking();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [refreshTracking, order]);

  // Initial fetch
  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return {
    order,
    trackingData,
    loading,
    trackingLoading,
    error,
    refetch: fetchOrder,
    refreshTracking
  };
};

export default useOrderTracking;
