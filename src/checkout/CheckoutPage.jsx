import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "../utils/Axios";
import { useDispatch } from "react-redux";
import { clearCartThunk } from "../features/cart/cartThunk";
import AddressSidebar from "./AddressSidebar";
import { checkPincodeServiceability, calculateShippingCharges } from "../services/shippingApi";

export default function CheckoutPage() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // ✅ Flag to prevent useEffect recovery from firing when payment handler is already running
  const isHandlingPayment = useRef(false);

  const {
    cartItems = [],
    totalAmount = 0,
    totalQuantity = 0,
    grandTotal = 0,
    appliedCoupon = null,
    finalAmount = grandTotal,
  } = location.state || {};

  const displayShipping = (finalAmount && finalAmount > 10) ? 80 : 0;

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    isValidating: false,
    charges: displayShipping,
    isServiceable: true,
    estimatedDelivery: '5-7 business days',
    error: null
  });

  const [paymentMethod, setPaymentMethod] = useState("Razorpay"); // Default to Online Payment
  const [isCODEnabled, setIsCODEnabled] = useState(true); // Default to enabled until settings load

  // ✅ CHECK PENDING PAYMENTS ON LOAD
  //   useEffect(() => {
  //     const checkPendingPayments = async () => {
  //       const pendingPayment = localStorage.getItem('pendingPaymentData');
  //       if (pendingPayment && isAuthenticated) {
  //         try {
  //           const data = JSON.parse(pendingPayment);
  //           const timeDiff = Date.now() - new Date(data.timestamp).getTime();

  //           if (timeDiff < 15 * 60 * 1000) {
  //             console.log("🔍 Found pending payment, checking status...");

  //             // const { data: statusData } = await axios.post('/razorpay/check-payment-status', {
  //             //   paymentId: data.paymentId
  //             // }, { withCredentials: true });

  // const { data } = await axios.post(
  //   "/razorpay/check-payment-status",
  //   { paymentId: pendingData.paymentId },
  //   { withCredentials: true }
  // );

  // if (data.success && data.payment.hasOrder) {
  //   finalizeSuccess({ _id: data.payment.orderId });
  // }

  //             if (statusData.success) {
  //               if (statusData.payment.hasOrder) {
  //                 toast.success("Previous order found!");
  //                 localStorage.removeItem('pendingPaymentData');
  //                 localStorage.removeItem('pendingCartData');
  //                 setTimeout(() => navigate(`/invoice/${statusData.payment.orderId}`), 1500);
  //               } else if (statusData.payment.isOrphaned) {
  //                 toast.info("Recovering your previous payment...");
  //                 await recoverPendingPayment(data);
  //               }
  //             }
  //           } else {
  //             localStorage.removeItem('pendingPaymentData');
  //             localStorage.removeItem('pendingCartData');
  //           }
  //         } catch (err) {
  //           console.error("Error checking pending payment:", err);
  //         }
  //       }
  //     };

  //     checkPendingPayments();
  //   }, [isAuthenticated, navigate]);
  useEffect(() => {
    if (!isAuthenticated) return;
    // ✅ Skip recovery if payment handler is already running in this session
    if (isHandlingPayment.current) return;

    const pending = localStorage.getItem('pendingPaymentData');
    if (!pending) return;

    const data = JSON.parse(pending);
    const age = Date.now() - new Date(data.timestamp).getTime();
    if (age > 15 * 60 * 1000) {
      localStorage.removeItem('pendingPaymentData');
      localStorage.removeItem('pendingCartData');
      return;
    }

    console.log("⚡ Recovering pending payment from previous session...");
    recoverPendingPayment(data);
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get("/settings");
        if (data.success) {
          setIsCODEnabled(data.settings.isCODEnabled);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get("/users/getaddresses", { withCredentials: true });
        setAddresses(data.data || []);
      } catch (err) {
        toast.error("Failed to load addresses");
      }
    };
    fetchAddresses();
  }, [isAuthenticated, isSidebarOpen]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find(a => a.isDefault);
      setSelectedAddress(defaultAddr || addresses[0]);
    }
  }, [addresses]);

  // Validate shipping when address is selected
  useEffect(() => {
    if (selectedAddress && selectedAddress.pincode && cartItems.length > 0) {
      validateShipping(selectedAddress.pincode);
    }
  }, [selectedAddress, cartItems, paymentMethod]);

  // Function to validate shipping for selected address
  const validateShipping = async (pincode) => {
    if (!pincode || pincode.length !== 6) return;

    setShippingInfo(prev => ({ ...prev, isValidating: true, error: null }));

    // Calculate shipping charges
    try {
      const shippingPayload = {
        items: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity,
          selectedVariant: {
            price: item.price
          }
        })),
        delivery_pincode: pincode,
        payment_method: paymentMethod
      };

      const { data: shippingData } = await calculateShippingCharges(shippingPayload);

      if (shippingData.success) {
        setShippingInfo({
          isValidating: false,
          charges: shippingData.shipping_charges,
          isServiceable: true,
          estimatedDelivery: '3-5 business days',
          error: null
        });
      } else {
        setShippingInfo({
          isValidating: false,
          charges: displayShipping,
          isServiceable: true,
          estimatedDelivery: '3-5 business days',
          error: null
        });
      }
    } catch (shippingError) {
      setShippingInfo({
        isValidating: false,
        charges: displayShipping,
        isServiceable: true,
        estimatedDelivery: '3-5 business days',
        error: null
      });
    }

  };

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //   script.async = true;
  //   document.body.appendChild(script);
  //   return () => document.body.removeChild(script);
  // }, []);

  const refreshAddresses = () => setIsSidebarOpen(false);

  // ✅ RECOVER PENDING PAYMENT
  const recoverPendingPayment = async (pendingData) => {
    try {
      const cartData = JSON.parse(localStorage.getItem('pendingCartData') || '{}');

      if (!cartData.items || cartData.items.length === 0) {
        toast.error("Cart data not found. Please contact support.");
        return;
      }

      const { data } = await axios.post("/razorpay/create-order-after-payment", {
        paymentId: pendingData.paymentId,
        items: cartData.items,
        shippingAddress: cartData.shippingAddress,
        discountCode: cartData.discountCode,
        totalAmount: cartData.totalAmount
      }, { withCredentials: true });

      if (data.success) {
        toast.success("Order recovered successfully!");
        localStorage.removeItem('pendingPaymentData');
        localStorage.removeItem('pendingCartData');
        await dispatch(clearCartThunk());
        // ✅ Use id (virtual) not _id — toJSON transform on backend deletes _id
        const recoveredId = data.order?.id || data.order?._id || data.orderId;
        navigate(`/invoice/${recoveredId}`, { state: { order: data.order } });
      }
    } catch (err) {
      console.error("Recovery failed:", err);
      toast.error("Auto-recovery failed. Please contact support with Payment ID.");
    }
  };

  const placeOrder = async (paymentMethod = "COD") => {
    if (!isAuthenticated) {
      toast.warn("Please login first");
      return navigate("/signin");
    }
    if (!selectedAddress) {
      return toast.warn("Please select a delivery address");
    }

    // Validate shipping before placing order
    if (!shippingInfo.isServiceable) {
      toast.error("Delivery not available to the selected address. Please choose a different address.");
      return;
    }

    if (shippingInfo.isValidating) {
      toast.info("Validating delivery address. Please wait...");
      return;
    }

    setIsPlacingOrder(true);

    const orderPayload = {
      items: cartItems.map(item => ({
        product: item.id,
        selectedVariant: {
          size: item.size,
          price: Number(item.price),
          color: item.color || "standard"
        },
        quantity: item.quantity
      })),
      shippingAddress: {
        label: selectedAddress.label || selectedAddress.type || "Home",
        name: selectedAddress.name || user.userName || "Customer",
        email: user.email,
        phoneNumber: selectedAddress.phoneNumber,
        street: selectedAddress.street || selectedAddress.flat || "",
        city: selectedAddress.city,
        state: selectedAddress.state,
        postalCode: selectedAddress.pincode || selectedAddress.postalCode,
        country: selectedAddress.country || "India",
        location: selectedAddress.location || { type: "Point", coordinates: [0, 0] },
      },
      discountCode: appliedCoupon?.code || null,
    };

    const uiTotalPayable = (Number(grandTotal) - displayShipping + shippingInfo.charges);

    if (paymentMethod === "Razorpay") {
      initiateRazorpay({
        ...orderPayload,
        totalAmount: uiTotalPayable
      });
    } else if (paymentMethod === "Wallet") {
      initiateWalletPayment({
        ...orderPayload,
        totalAmount: uiTotalPayable
      });
    } else if (paymentMethod === "COD") {
      initiateCOD({
        ...orderPayload,
        totalAmount: uiTotalPayable,
        paymentMethod: "COD"
      });
    } else {
      setIsPlacingOrder(false);
    }
  };

  const initiateWalletPayment = async (orderPayload) => {
    try {
      console.log("💳 Initiating Business Wallet order...");
      
      // Pay using Wallet API first
      const walletRes = await axios.post("/wallet/pay", {
        amount: orderPayload.totalAmount,
        description: `Bulko Order Payment for ${cartItems.length} items`
      }, { withCredentials: true });

      if (!walletRes.data?.success) {
        throw new Error(walletRes.data?.message || "Failed to process Wallet payment");
      }

      // Create Order
      const { data } = await axios.post("/orders/createOrder", {
        ...orderPayload,
        paymentMethod: "WALLET",
        paymentStatus: "PAID"
      }, { withCredentials: true });

      if (data.success) {
        toast.success("Order placed successfully using Business Wallet!");
        dispatch(clearCartThunk());
        const orderId = data.order.id || data.order._id;
        navigate(`/invoice/${orderId}`, { state: { order: data.order } });
      } else {
        throw new Error(data.message || "Failed to create order");
      }
    } catch (err) {
      console.error("❌ Wallet order error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to pay via Wallet. Please check balance.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const initiateCOD = async (orderPayload) => {
    try {
      console.log("📦 Initiating COD order...");
      
      const { data } = await axios.post("/orders/createOrder", {
        ...orderPayload,
        paymentMethod: "COD",
      }, { withCredentials: true });

      if (data.success) {
        toast.success("Order placed successfully (COD)!");
        dispatch(clearCartThunk());
        
        const orderId = data.order.id || data.order._id;
        navigate(`/invoice/${orderId}`, { state: { order: data.order } });
      } else {
        throw new Error(data.message || "Failed to place COD order");
      }
    } catch (err) {
      console.error("❌ COD order error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const initiateRazorpay = async (orderPayload) => {
    try {
      console.log("💳 Initiating Razorpay payment...");

      // ✅ Save cart data BEFORE payment
      localStorage.setItem('pendingCartData', JSON.stringify({
        items: orderPayload.items,
        shippingAddress: orderPayload.shippingAddress,
        discountCode: orderPayload.discountCode,
        totalAmount: orderPayload.totalAmount, // This is the final price user pays
        timestamp: new Date().toISOString()
      }));

      // Send the full payable amount (already includes shipping) — backend must NOT add shipping again
      const { data } = await axios.post("/razorpay/createRazorpayOrder", {
        amount: Math.round(Number(orderPayload.totalAmount)),
        userId: user.id,
        items: orderPayload.items,
        shippingAddress: orderPayload.shippingAddress,
        discountCode: orderPayload.discountCode,
        totalAmount: orderPayload.totalAmount, // Final inclusive total
        shippingCharges: shippingInfo.charges // ✅ NEW: Pass shipping charges explicitly
      }, { withCredentials: true });

      if (!data.success) {
        throw new Error("Failed to create payment order");
      }

      // ✅ Save payment tracking
      const pendingPaymentEntry = {
        paymentId: data.paymentId,
        razorpayOrderId: data.order_id,
        amount: Math.round(grandTotal),
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('pendingPaymentData', JSON.stringify(pendingPaymentEntry));

      console.log("✅ Payment record created:", data.paymentId);

      const options = {
        key: data.key_id,
        amount: data.amount, // Already in paise from backend
        currency: "INR",
        order_id: data.order_id,
        name: "Nisha Sagar",
        description: "Complete your purchase",
        timeout: 600, // ✅ NEW: 10 minute timeout
        handler: async (response) => {
          console.log("Payment successful, processing...");

          try {
            // ✅ Signal that THIS session is handling the payment — stop useEffect recovery from firing
            isHandlingPayment.current = true;

            // Step 1: Verify payment signature
            console.log("Verifying payment signature...");
            const verifyResponse = await axios.post("/razorpay/verifyPayment", {
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
              paymentId: data.paymentId,
            }, { withCredentials: true, timeout: 15000 });

            if (!verifyResponse.data.success) {
              throw new Error("Payment verification failed");
            }
            console.log("Payment verified");

            // Step 2: Try to create order immediately
            console.log("Creating order...");
            toast.info("Payment successful. Confirming your order...", { autoClose: false });

            // Helper for polling if webhook is creating the order or direct call fails
            const pollPaymentStatus = async (paymentId) => {
              return new Promise((resolve) => {
                let attempts = 0;
                const maxAttempts = 15; // 30 seconds max
                const interval = setInterval(async () => {
                  attempts++;
                  try {
                    const { data: status } = await axios.post(
                      "/razorpay/check-payment-status",
                      { paymentId },
                      { withCredentials: true }
                    );

                    if (status.success && status.payment.hasOrder) {
                      clearInterval(interval);
                      finalizeSuccess({ _id: status.payment.orderId });
                      resolve();
                    } else if (attempts >= maxAttempts) {
                      clearInterval(interval);
                      toast.info("Order is being processed. It will appear in your profile shortly.");
                      setIsPlacingOrder(false);
                      localStorage.removeItem('pendingPaymentData');
                      localStorage.removeItem('pendingCartData');
                      dispatch(clearCartThunk());
                      navigate(`/profile`);
                      resolve();
                    }
                  } catch (e) {
                    if (attempts >= maxAttempts) {
                      clearInterval(interval);
                      resolve();
                    }
                  }
                }, 2000);
              });
            };

            try {
              const orderResponse = await axios.post("/razorpay/create-order-after-payment", {
                paymentId: data.paymentId,
                items: orderPayload.items,
                shippingAddress: orderPayload.shippingAddress,
                discountCode: orderPayload.discountCode,
                totalAmount: orderPayload.totalAmount
              }, { withCredentials: true, timeout: 15000 });

              // If order created or already exists
              if (orderResponse.data.success && (orderResponse.status === 200 || orderResponse.status === 201)) {
                // Support both flat orderId and nested order._id/id
                const resolvedOrder = orderResponse.data.order || {};
                const orderId = orderResponse.data.orderId || resolvedOrder._id || resolvedOrder.id;
                
                if (!orderId) {
                  console.error("❌ No order ID found in response:", orderResponse.data);
                  throw new Error("Order was created but ID was not received.");
                }

                console.log("Order confirmed:", orderId);
                // Ensure the object passed to finalizeSuccess has the ID
                finalizeSuccess({ ...resolvedOrder, _id: orderId, id: orderId });
                return;
              }

              // If processing by webhook (202 Accepted)
              if (orderResponse.status === 202) {
                console.log("Order is being processed by webhook. Waiting...");
                await pollPaymentStatus(data.paymentId);
                return;
              }
            } catch (err) {
              console.error("Direct order creation failed, falling back to polling.", err);
              await pollPaymentStatus(data.paymentId);
              return;
            }

          } catch (error) {
            console.error("Error after payment:", error);

            // Auto-recovery fallback for unexpected errors during verification
            setTimeout(async () => {
              const pendingData = JSON.parse(localStorage.getItem('pendingPaymentData') || '{}');
              if (pendingData.paymentId) {
                await recoverPendingPayment(pendingData);
              }
            }, 2000);

            setIsPlacingOrder(false);
          }

          // Helper function to avoid code duplication
          function finalizeSuccess(order) {
            localStorage.removeItem('pendingPaymentData');
            localStorage.removeItem('pendingCartData');
            dispatch(clearCartThunk());
            toast.success("Order placed successfully!");
            
            // ✅ Prioritize id (Mongoose virtual) then _id
            const orderId = order.id || order._id;
            
            if (!orderId) {
                console.error("❌ cannot navigate: orderId is undefined", order);
                toast.error("Process completed but could not find order ID. Please check your profile.");
                navigate("/profile");
                setIsPlacingOrder(false);
                return;
            }

            navigate(`/invoice/${orderId}`, { state: { order } });
            setIsPlacingOrder(false);
          }
        },
        modal: {
          ondismiss: () => {
            // ✅ NEW: Better messaging for timeouts
            toast.info(
              "Payment cancelled. If payment was completed, we'll recover it automatically.",
              { autoClose: 5000 }
            );
            setIsPlacingOrder(false);
          },
          // ✅ NEW: Handle timeout specifically
          escape: false,
          confirm_close: true
        },
        prefill: {
          name: user.userName || "Customer",
          email: user.email,
          contact: selectedAddress.phoneNumber,
        },
        theme: { color: "#ec4899" },
        retry: {
          enabled: false
        },
        // ✅ NEW: Additional options
        send_sms_hash: true,
        remember_customer: false
      };

      const rzp = new window.Razorpay(options);

      // ✅ Handle payment failure
      rzp.on('payment.failed', function (response) {
        console.error('❌ Payment failed:', response.error);

        // ✅ NEW: Better error messages
        let errorMsg = "Payment failed. Please try again.";

        if (response.error.reason === 'payment_timed_out') {
          errorMsg = "Payment timed out. The payment window expired after 10 minutes.";
        } else if (response.error.description) {
          errorMsg = response.error.description;
        }

        toast.error(errorMsg, { autoClose: 8000 });

        localStorage.removeItem('pendingPaymentData');
        localStorage.removeItem('pendingCartData');

        setIsPlacingOrder(false);
      });

      rzp.open();

    } catch (err) {
      console.error("❌ Razorpay initiation error:", err);
      toast.error("Payment gateway error. Please try again.");

      localStorage.removeItem('pendingPaymentData');
      localStorage.removeItem('pendingCartData');

      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 flex justify-center items-start p-4 sm:p-8">
      <AddressSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        refreshAddresses={refreshAddresses}
        userName={user?.userName || ""}
        email={user?.email || ""}
      />

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-brand-text mb-6 text-center">
            Shipping Information
          </h2>

          <div className="space-y-4 mb-6">
            {addresses.length > 0 ? (
              addresses.map(addr => (
                <label
                  key={addr._id}
                  className={`block border-2 rounded-xl p-4 cursor-pointer transition ${selectedAddress?._id === addr._id
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress?._id === addr._id}
                      onChange={() => setSelectedAddress(addr)}
                      className="mt-1 text-primary-500"
                    />
                    <div>
                      <p className="font-semibold text-brand-text">
                        {addr.label || addr.type} ({addr.phoneNumber})
                        {addr.isDefault && (
                          <span className="text-sm text-gray-500 ml-2">(Default)</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        {addr.street || addr.flat}, {addr.city}, {addr.state} - {addr.pincode || addr.postalCode}
                      </p>
                    </div>
                  </div>
                </label>
              ))
            ) : (
              <p className="text-center text-gray-500">No saved addresses</p>
            )}
          </div>

          <div className="text-center mb-8">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="bg-primary-500 text-white font-semibold px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-primary-600 shadow-md transition"
            >
              + Add New Address
            </button>
          </div>

          <h3 className="text-center font-semibold mb-4">Payment Method</h3>

          {/* ✅ NEW: Payment info alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-brand-text">
            <p className="font-medium mb-1">⏰ Important:</p>
            <p>Complete payment within 10 minutes to avoid timeout.</p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {/* Online Payment Option */}
              <label 
                className={`flex-1 border-2 rounded-xl p-4 cursor-pointer transition flex items-center gap-3 ${
                  paymentMethod === "Razorpay" ? "border-primary-500 bg-primary-50" : "border-gray-200"
                }`}
              >
                <input 
                  type="radio" 
                  name="payment_method" 
                  checked={paymentMethod === "Razorpay"}
                  onChange={() => setPaymentMethod("Razorpay")}
                  className="text-primary-500"
                />
                <div>
                  <p className="font-semibold text-brand-text">Pay Online</p>
                  <p className="text-xs text-gray-500">Fast & Secure (Cards, UPI, NetBanking)</p>
                </div>
              </label>

              {/* Wallet Option */}
              <label 
                className={`flex-1 border-2 rounded-xl p-4 cursor-pointer transition flex items-center gap-3 ${
                  paymentMethod === "Wallet" ? "border-emerald-600 bg-emerald-50" : "border-gray-200"
                }`}
              >
                <input 
                  type="radio" 
                  name="payment_method" 
                  checked={paymentMethod === "Wallet"}
                  onChange={() => setPaymentMethod("Wallet")}
                  className="text-emerald-600"
                />
                <div>
                  <p className="font-semibold text-brand-text flex items-center gap-1.5">
                    💳 Retailer Wallet
                  </p>
                  <p className="text-xs text-gray-500">Instant 1-Click Pay from your Bulko balance</p>
                </div>
              </label>

              {/* Cash on Delivery Option - CAN BE COMMENTED OUT IF NEEDED */}
              {isCODEnabled && (
                <label 
                  className={`flex-1 border-2 rounded-xl p-4 cursor-pointer transition flex items-center gap-3 ${
                    paymentMethod === "COD" ? "border-primary-500 bg-primary-50" : "border-gray-200"
                  }`}
                >
                  <input 
                    type="radio" 
                    name="payment_method" 
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="text-primary-500"
                  />
                  <div>
                    <p className="font-semibold text-brand-text">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay when you receive your order</p>
                  </div>
                </label>
              )}
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => placeOrder(paymentMethod)}
                disabled={isPlacingOrder || !shippingInfo.isServiceable || shippingInfo.isValidating}
                className="w-full sm:w-auto bg-primary-500 text-white font-bold px-10 py-4 rounded-xl hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg"
              >
                {isPlacingOrder ? "Processing..." : paymentMethod === "Razorpay" ? "Complete Payment" : paymentMethod === "Wallet" ? "Pay with Business Wallet" : "Place Order (COD)"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-brand-text mb-6 text-center">
            Order Summary
          </h2>
          <div className="space-y-3">
            {cartItems.map(item => (
              <div key={item.id + item.size + item.color} className="flex justify-between text-brand-text">
                <span>
                  {item.name} ({item.size ? `${item.size}` : "N/A"}
                  {item.color ? `, ${item.color}` : ""}) × {item.quantity}
                </span>
                <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span className="font-semibold">{totalQuantity}</span>
              </div>

              {/* Dynamic Shipping Information */}
              <div className="flex justify-between text-brand-text">
                <div className="flex items-center gap-2">
                  <span>Shipping:</span>
                  {shippingInfo.isValidating && (
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary-500 border-t-transparent"></div>
                  )}
                </div>
                <span className={shippingInfo.isServiceable ? '' : 'text-red-500'}>
                  {shippingInfo.isServiceable ? `₹${shippingInfo.charges.toFixed(2)}` : 'Not available'}
                </span>
              </div>

              {/* Delivery Information */}
              {selectedAddress && selectedAddress.pincode && (
                <div className="text-sm text-gray-600 mt-2">
                  <div className="flex justify-between">
                    <span>Delivery to {selectedAddress.pincode}:</span>
                    <span className={shippingInfo.isServiceable ? 'text-green-600' : 'text-red-500'}>
                      {shippingInfo.estimatedDelivery}
                    </span>
                  </div>
                  {shippingInfo.error && (
                    <div className="text-primary-600 text-xs mt-1">
                      {shippingInfo.error}
                    </div>
                  )}
                </div>
              )}

              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon: {appliedCoupon.code}</span>
                  <span>{appliedCoupon.discountPercentage}%</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-brand-text mt-4 border-t pt-4">
                <span>Total Payable:</span>
                <span className="text-primary-600">
                  ₹{(Number(grandTotal) - displayShipping + shippingInfo.charges).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
