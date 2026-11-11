import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AlertTriangle, Info } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "../utils/toast";
import axios from "../utils/Axios";
import { clearCartThunk } from "../features/cart/cartThunk";
import { useCartActions } from "../hooks/useCartActions";
import AddressSidebar from "./AddressSidebar";
import { quoteOrder, toOrderItems } from "../services/orderAPi";
import { getPublicSettings } from "../services/settingsApi";
import { formatINR } from "../utils/money";
import {
  savePendingPayment,
  getPendingPayment,
  clearPendingPayment,
  markPaymentCaptured,
} from "../utils/paymentStorage";
import usePageMeta from "../hooks/usePageMeta";

const asRupees = (n) => Math.round(Number(n || 0) * 100) / 100;

export default function CheckoutPage() {
  usePageMeta({ title: "Checkout | MantraVanni", description: "Complete your order securely.", noindex: true });

  const { user } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { removeFromCart, updateQuantity } = useCartActions();

  // The cart in the store is the source of truth; only the coupon code and the cart-page estimate
  // come through router state (both are advisory - the server re-prices everything).
  const cartItems = useSelector((state) => state.cart.items);
  const cartEstimate = Number(location.state?.grandTotal);
  const discountCode = location.state?.appliedCoupon?.code || null;

  // Flag to stop recovery from firing while the payment handler is already running
  const isHandlingPayment = useRef(false);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [isCODEnabled, setIsCODEnabled] = useState(true);
  const [isWalletEnabled, setIsWalletEnabled] = useState(true);

  // Server quote state
  const [quote, setQuote] = useState(null);
  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState(null);
  const handleStockConflictRef = useRef(null);
  const [stockConflict, setStockConflict] = useState(null); // [{productId,name,available}] from a 409
  const [priceNotice, setPriceNotice] = useState(null);
  const quoteSeq = useRef(0);

  const orderItems = useMemo(() => toOrderItems(cartItems), [cartItems]);

  const shippingAddressPayload = useMemo(() => {
    if (!selectedAddress) return undefined;
    return {
      label: selectedAddress.label || selectedAddress.type || "Home",
      name: selectedAddress.name || user?.userName || "Customer",
      email: user?.email,
      phoneNumber: selectedAddress.phoneNumber,
      street: selectedAddress.street || selectedAddress.flat || "",
      city: selectedAddress.city,
      state: selectedAddress.state,
      postalCode: selectedAddress.pincode || selectedAddress.postalCode,
      country: selectedAddress.country || "India",
      location: selectedAddress.location || { type: "Point", coordinates: [0, 0] },
    };
  }, [selectedAddress, user]);

  /* ---------------- server quote ---------------- */
  const refreshQuote = useCallback(async () => {
    if (!isAuthenticated || orderItems.length === 0) {
      setQuote(null);
      return null;
    }
    const seq = ++quoteSeq.current;
    setIsQuoting(true);
    setQuoteError(null);
    try {
      const result = await quoteOrder({
        items: orderItems,
        discountCode,
        shippingAddress: shippingAddressPayload,
      });
      if (seq !== quoteSeq.current) return null; // a newer request superseded this one
      setQuote(result);
      return result;
    } catch (err) {
      if (seq !== quoteSeq.current) return null;
      setQuote(null);
      const qs = err?.response?.status;
      setQuoteError(
        qs && qs < 500 && err.response.data?.message
          ? err.response.data.message
          : "We could not confirm the latest prices. Please check your connection and try again."
      );
      return null;
    } finally {
      if (seq === quoteSeq.current) setIsQuoting(false);
    }
  }, [isAuthenticated, orderItems, discountCode, shippingAddressPayload]);

  useEffect(() => {
    refreshQuote();
  }, [refreshQuote]);

  // "Prices updated" notice when the server total differs from what the cart page showed.
  useEffect(() => {
    if (!quote || !Number.isFinite(cartEstimate)) return;
    if (Math.abs(asRupees(quote.total) - asRupees(cartEstimate)) >= 0.01) {
      setPriceNotice(
        `Prices were updated. Your total is now ${formatINR(quote.total)} (it was ${formatINR(cartEstimate)} in your cart).`
      );
    } else {
      setPriceNotice(null);
    }
  }, [quote, cartEstimate]);

  const issues = quote?.issues || [];
  const lineName = useCallback(
    (productId) =>
      quote?.lines?.find((l) => String(l.productId) === String(productId))?.name ||
      cartItems.find((i) => String(i.id) === String(productId))?.name ||
      "An item",
    [quote, cartItems]
  );
  const hasBlockingIssues = issues.length > 0 || (stockConflict && stockConflict.length > 0);

  /* ---------------- settings / addresses ---------------- */
  useEffect(() => {
    let active = true;
    getPublicSettings().then((s) => {
      if (!active || !s) return;
      if (typeof s.isCODEnabled === "boolean") setIsCODEnabled(s.isCODEnabled);
      if (typeof s.walletEnabled === "boolean") setIsWalletEnabled(s.walletEnabled);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isCODEnabled && paymentMethod === "COD") setPaymentMethod("Razorpay");
    if (!isWalletEnabled && paymentMethod === "Wallet") setPaymentMethod("Razorpay");
  }, [isCODEnabled, isWalletEnabled, paymentMethod]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get("/users/getaddresses", { withCredentials: true });
        setAddresses(data.data || []);
      } catch {
        toast.error("Failed to load addresses");
      }
    };
    fetchAddresses();
  }, [isAuthenticated, isSidebarOpen]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find((a) => a.isDefault);
      setSelectedAddress(defaultAddr || addresses[0]);
    }
  }, [addresses, selectedAddress]);

  const refreshAddresses = () => setIsSidebarOpen(false);

  /* ---------------- recovery of an interrupted online payment (this tab, < 15 min) ---------------- */
  const finishWithOrder = useCallback(
    (order) => {
      clearPendingPayment();
      dispatch(clearCartThunk());
      const orderId = order?.id || order?._id;
      if (!orderId) {
        toast.error("Order placed, but we could not open it. Please check your orders in your profile.");
        navigate("/profile");
      } else {
        toast.success("Order placed successfully!");
        navigate(`/invoice/${orderId}`, { state: { order } });
      }
      setIsPlacingOrder(false);
    },
    [dispatch, navigate]
  );

  const recoverPendingPayment = useCallback(
    async (pending) => {
      try {
        const cartData = pending.cart || {};
        if (!cartData.items || cartData.items.length === 0) {
          clearPendingPayment();
          toast.error("Cart data not found. Please contact support with your payment reference.");
          return;
        }
        const { data } = await axios.post(
          "/razorpay/create-order-after-payment",
          {
            paymentId: pending.payment.paymentId,
            items: cartData.items,
            shippingAddress: cartData.shippingAddress,
            discountCode: cartData.discountCode,
          },
          { withCredentials: true }
        );
        if (data.success) {
          toast.success("Order recovered successfully!");
          const o = data.order || {};
          finishWithOrder({ ...o, id: o.id || o._id || data.orderId });
        }
      } catch (err) {
        const res = err?.response;
        if (res?.status === 402 && res.data?.code === "PAYMENT_NOT_PAID") {
          clearPendingPayment();
          return;
        }
        if (res?.status === 409 && res.data?.code === "OUT_OF_STOCK") {
          clearPendingPayment();
          handleStockConflictRef.current?.(res.data.items, !!res.data.refunded);
          return;
        }
        toast.error("Auto-recovery failed. Please contact support with your payment reference.");
      }
    },
    [finishWithOrder]
  );

  useEffect(() => {
    if (!isAuthenticated || isHandlingPayment.current) return;
    const pending = getPendingPayment(); // drops entries older than 15 minutes
    // Only a payment that was actually captured (Razorpay success handler ran) is mid-flight.
    if (pending?.payment?.paymentId && pending.payment.captured) recoverPendingPayment(pending);
  }, [isAuthenticated, recoverPendingPayment]);

  /* ---------------- stock conflict helpers ---------------- */
  const handleStockConflict = (items, refunded, paidAmount) => {
    setStockConflict(Array.isArray(items) ? items : []);
    if (refunded !== undefined) {
      const amt = Number.isFinite(paidAmount) ? ` of ${formatINR(paidAmount)}` : "";
      toast.error(
        `Some items just went out of stock. Your payment${amt} ${refunded ? "was refunded automatically" : "will be refunded"}.`,
        { autoClose: 9000 }
      );
    } else {
      toast.error("Some items are no longer available in the requested quantity.");
    }
    refreshQuote();
  };
  handleStockConflictRef.current = handleStockConflict;

  const removeUnavailableItems = async () => {
    const fromQuote = (pid) => quote?.lines?.find((l) => String(l.productId) === String(pid))?.available;
    const list = stockConflict?.length
      ? stockConflict
      : issues.map((i) => ({ productId: i.productId, available: i.available ?? fromQuote(i.productId) ?? 0 }));
    for (const c of list) {
      const avail = Math.max(0, Number(c.available) || 0);
      let remaining = avail;
      const affected = cartItems.filter((i) => String(i.id) === String(c.productId));
      for (const item of affected) {
        const keep = Math.min(item.quantity, remaining);
        remaining -= keep;
        if (keep <= 0) {
          await removeFromCart(item.id, item.size, item.color);
        } else if (keep < item.quantity) {
          await updateQuantity(item.id, item.size, item.color, keep);
        }
      }
    }
    setStockConflict(null);
    toast.success("Your cart was updated.");
    refreshQuote();
  };

  /* ---------------- placing the order ---------------- */
  const buildPayload = () => ({
    items: orderItems,
    shippingAddress: shippingAddressPayload,
    discountCode: discountCode || null,
  });

  const handleOrderError = (err, fallback) => {
    const res = err?.response;
    if (res?.status === 409 && res.data?.code === "OUT_OF_STOCK") {
      handleStockConflict(res.data.items);
      return;
    }
    toast.error(res && res.status < 500 && res.data?.message ? res.data.message : fallback);
  };

  const placeOrder = async () => {
    if (!isAuthenticated) {
      toast.warn("Please login first");
      return navigate("/signin?redirect=/checkout");
    }
    if (!selectedAddress) {
      return toast.warn("Please select a delivery address");
    }
    if (isQuoting) {
      return toast.info("Confirming latest prices. Please wait...");
    }

    setIsPlacingOrder(true);
    // Re-quote right before paying so what the customer sees is what the server will charge.
    const shownTotal = quote?.total;
    const fresh = await refreshQuote();
    if (!fresh) {
      setIsPlacingOrder(false);
      return toast.error("Could not confirm the latest prices. Please try again.");
    }
    if ((fresh.issues || []).length > 0) {
      setIsPlacingOrder(false);
      return toast.error("Please resolve the highlighted items before paying.");
    }
    if (shownTotal != null && Math.abs(asRupees(fresh.total) - asRupees(shownTotal)) >= 0.01) {
      setIsPlacingOrder(false);
      return toast.info(`Prices updated. New total: ${formatINR(fresh.total)}. Please review and pay again.`);
    }

    const payload = buildPayload();
    if (paymentMethod === "Razorpay") initiateRazorpay(payload);
    else if (paymentMethod === "Wallet") initiateWalletPayment(payload);
    else if (paymentMethod === "COD") initiateCOD(payload);
    else setIsPlacingOrder(false);
  };

  const initiateWalletPayment = async (payload) => {
    try {
      // Wallet payment is part of order creation; the server debits the wallet atomically.
      const { data } = await axios.post(
        "/orders/createOrder",
        { ...payload, paymentMethod: "WALLET" },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success("Order placed successfully using your wallet!");
        dispatch(clearCartThunk());
        const orderId = data.order.id || data.order._id;
        navigate(`/invoice/${orderId}`, { state: { order: data.order } });
      } else {
        throw new Error(data.message || "Failed to create order");
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404 || status === 405 || status === 410 || status === 501) {
        toast.error("Wallet payment is currently unavailable. Please choose another payment method.");
      } else if (status === 402) {
        toast.error(err.response?.status < 500 && err.response?.data?.message ? err.response.data.message : "Could not pay with wallet. Please try again.");
      } else {
        handleOrderError(err, "Failed to pay via wallet. Please check your balance and try again.");
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const initiateCOD = async (payload) => {
    try {
      const { data } = await axios.post(
        "/orders/createOrder",
        { ...payload, paymentMethod: "COD" },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success("Order placed successfully (COD)!");
        dispatch(clearCartThunk());
        const orderId = data.order.id || data.order._id;
        navigate(`/invoice/${orderId}`, { state: { order: data.order } });
      } else {
        throw new Error(data.message || "Failed to place COD order");
      }
    } catch (err) {
      handleOrderError(err, "Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const initiateRazorpay = async (payload) => {
    try {
      // The server computes the amount; only items, discount code and address are sent.
      const { data } = await axios.post("/razorpay/createRazorpayOrder", payload, { withCredentials: true });

      if (!data.success) {
        throw new Error(data.message || "Failed to create payment order");
      }

      const chargedRupees = Number(data.amount) / 100;
      if (Number.isFinite(chargedRupees) && quote && Math.abs(chargedRupees - asRupees(quote.total)) >= 1) {
        toast.info(`Final amount to pay: ${formatINR(chargedRupees)}`);
      }

      // Short-lived (sessionStorage, 15 min) so an interrupted payment can be recovered in this tab.
      savePendingPayment(
        { paymentId: data.paymentId, razorpayOrderId: data.order_id },
        { items: payload.items, shippingAddress: payload.shippingAddress, discountCode: payload.discountCode }
      );

      const pollPaymentStatus = (paymentId) =>
        new Promise((resolve) => {
          let attempts = 0;
          const maxAttempts = 15;
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
                finishWithOrder({ _id: status.payment.orderId, id: status.payment.orderId });
                resolve();
                return;
              }
            } catch {
              /* keep polling until maxAttempts */
            }
            if (attempts >= maxAttempts) {
              clearInterval(interval);
              toast.info("Order is being processed. It will appear in your profile shortly.");
              setIsPlacingOrder(false);
              clearPendingPayment();
              dispatch(clearCartThunk());
              navigate("/profile");
              resolve();
            }
          }, 2000);
        });

      isHandlingPayment.current = false;
      const options = {
        key: data.key_id,
        amount: data.amount, // paise, computed by the server
        currency: "INR",
        order_id: data.order_id,
        name: "MantraVanni",
        description: "Complete your purchase",
        timeout: 600,
        handler: async (response) => {
          isHandlingPayment.current = true;
          markPaymentCaptured();
          try {
            const verifyResponse = await axios.post(
              "/razorpay/verifyPayment",
              {
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                signature: response.razorpay_signature,
                paymentId: data.paymentId,
              },
              { withCredentials: true, timeout: 15000 }
            );
            if (!verifyResponse.data.success) {
              throw new Error("Payment verification failed");
            }

            toast.info("Payment successful. Confirming your order...");

            try {
              const orderResponse = await axios.post(
                "/razorpay/create-order-after-payment",
                {
                  paymentId: data.paymentId,
                  items: payload.items,
                  shippingAddress: payload.shippingAddress,
                  discountCode: payload.discountCode,
                },
                { withCredentials: true, timeout: 15000 }
              );

              if (orderResponse.status === 202) {
                await pollPaymentStatus(data.paymentId);
                return;
              }
              if (orderResponse.data.success) {
                const resolved = orderResponse.data.order || {};
                const orderId = orderResponse.data.orderId || resolved._id || resolved.id;
                if (!orderId) throw new Error("Order was created but ID was not received.");
                finishWithOrder({ ...resolved, _id: orderId, id: orderId });
                return;
              }
              await pollPaymentStatus(data.paymentId);
            } catch (postErr) {
              const pr = postErr?.response;
              if (pr?.status === 409 && pr.data?.code === "OUT_OF_STOCK") {
                clearPendingPayment();
                handleStockConflict(pr.data.items, !!pr.data.refunded, chargedRupees);
                setIsPlacingOrder(false);
                return;
              }
              await pollPaymentStatus(data.paymentId);
            }
          } catch {
            // Verification / confirmation failed after money may have moved: try recovery once.
            setTimeout(async () => {
              const pending = getPendingPayment();
              if (pending?.payment?.paymentId) await recoverPendingPayment(pending);
            }, 2000);
            setIsPlacingOrder(false);
          }
        },
        modal: {
          ondismiss: () => {
            // Closing the window before paying: nothing was captured, so drop the pending payment.
            // (If the success handler already ran it has set captured and its own flow owns cleanup.)
            if (!isHandlingPayment.current) clearPendingPayment();
            toast.info("Payment cancelled. If payment was completed, we'll recover it automatically.", {
              autoClose: 5000,
            });
            setIsPlacingOrder(false);
          },
          escape: false,
          confirm_close: true,
        },
        prefill: {
          name: user?.userName || "Customer",
          email: user?.email,
          contact: selectedAddress?.phoneNumber,
        },
        theme: { color: "#D35400" },
        retry: { enabled: false },
        send_sms_hash: true,
        remember_customer: false,
      };

      if (!window.Razorpay) throw new Error("Payment gateway could not be loaded. Please refresh and try again.");
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response) => {
        let errorMsg = "Payment failed. Please try again.";
        if (response?.error?.reason === "payment_timed_out") {
          errorMsg = "Payment timed out. The payment window expired after 10 minutes.";
        } else if (response?.error?.description) {
          errorMsg = response.error.description;
        }
        toast.error(errorMsg, { autoClose: 8000 });
        clearPendingPayment();
        setIsPlacingOrder(false);
      });

      rzp.open();
    } catch (err) {
      clearPendingPayment();
      handleOrderError(err, "Payment gateway error. Please try again.");
      setIsPlacingOrder(false);
    }
  };

  /* ---------------- render ---------------- */
  const payDisabled =
    isPlacingOrder || isQuoting || !quote || hasBlockingIssues || !selectedAddress || cartItems.length === 0;

  const payLabel = isPlacingOrder
    ? "Processing..."
    : paymentMethod === "Razorpay"
    ? "Complete Payment"
    : paymentMethod === "Wallet"
    ? "Pay with Wallet"
    : "Place Order (COD)";

  const methodCls = (active) =>
    `flex-1 border-2 rounded-xl p-4 cursor-pointer transition flex items-center gap-3 focus-within:ring-2 focus-within:ring-primary-400 ${
      active ? "border-primary-500 bg-primary-50 shadow-sm" : "border-secondary-200 hover:bg-secondary-50"
    }`;

  const summaryLines = quote?.lines?.length
    ? quote.lines
    : cartItems.map((i) => ({
        productId: i.id,
        name: i.name,
        size: i.size,
        quantity: i.quantity,
        lineTotal: null,
      }));

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] bg-brand-bg flex flex-col items-center justify-center p-8 text-center">
        <h1 className="font-serif text-2xl font-bold text-brand-text">Your cart is empty</h1>
        <p className="mt-2 text-sm text-gray-600">Add something meaningful to your cart to check out.</p>
        <Link to="/new-products" className="mt-5 rounded-xl bg-primary-500 px-6 py-3 text-sm font-bold text-white hover:bg-primary-600">
          Explore products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg flex justify-center items-start p-4 sm:p-8">
      <AddressSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        refreshAddresses={refreshAddresses}
        userName={user?.userName || ""}
        email={user?.email || ""}
      />

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-brand-bg shadow-md border border-secondary-200 rounded-2xl p-6 sm:p-8">
          <h1 className="font-serif text-xl font-bold text-brand-text mb-6 text-center">Shipping Information</h1>

          <fieldset className="space-y-4 mb-6">
            <legend className="sr-only">Delivery address</legend>
            {addresses.length > 0 ? (
              addresses.map((addr) => (
                <label
                  key={addr._id}
                  className={`block border-2 rounded-xl p-4 cursor-pointer transition focus-within:ring-2 focus-within:ring-primary-400 ${
                    selectedAddress?._id === addr._id
                      ? "border-primary-500 bg-primary-50"
                      : "border-secondary-200 hover:bg-secondary-50"
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
                        {addr.isDefault && <span className="text-sm text-gray-500 ml-2">(Default)</span>}
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
          </fieldset>

          <div className="text-center mb-8">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="bg-primary-500 text-white font-semibold px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-primary-600 shadow-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              + Add New Address
            </button>
          </div>

          <h2 className="text-center font-serif font-bold text-lg mb-4 text-brand-text">Select Payment Method</h2>

          <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-3 mb-4 text-sm text-brand-text">
            <p className="font-medium mb-1">Important</p>
            <p>Complete payment within 10 minutes to avoid timeout.</p>
          </div>

          <fieldset className="space-y-4">
            <legend className="sr-only">Payment method</legend>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <label className={methodCls(paymentMethod === "Razorpay")}>
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

              {isWalletEnabled && (
                <label className={methodCls(paymentMethod === "Wallet")}>
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === "Wallet"}
                    onChange={() => setPaymentMethod("Wallet")}
                    className="text-primary-500"
                  />
                  <div>
                    <p className="font-semibold text-brand-text">Wallet</p>
                    <p className="text-xs text-gray-500">Pay instantly from your MantraVanni wallet balance</p>
                  </div>
                </label>
              )}

              {isCODEnabled && (
                <label className={methodCls(paymentMethod === "COD")}>
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

            <p className="text-center text-xs text-gray-500">
              By placing an order you agree to our{" "}
              <Link to="/terms-and-conditions" className="underline text-primary-600">Terms &amp; Conditions</Link>,{" "}
              <Link to="/privacy-policy" className="underline text-primary-600">Privacy Policy</Link> and{" "}
              <Link to="/cancellation-refund-policy" className="underline text-primary-600">Cancellation &amp; Refund Policy</Link>.
            </p>

            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={placeOrder}
                disabled={payDisabled}
                className="w-full sm:w-auto bg-primary-500 text-white font-extrabold px-10 py-3.5 rounded-xl hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                {payLabel}
              </button>
            </div>
          </fieldset>
        </div>

        <div className="bg-brand-bg shadow-md border border-secondary-200 rounded-2xl p-6 sm:p-8">
          <h2 className="font-serif text-xl font-bold text-brand-text mb-6 text-center">Order Summary</h2>

          {/* Live region: price changes and stock problems are announced to assistive tech */}
          <div aria-live="polite" role="status" className="space-y-3 mb-4">
            {isQuoting && <p className="text-xs text-gray-500">Confirming latest prices...</p>}
            {quoteError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <p>{quoteError}</p>
                <button type="button" onClick={refreshQuote} className="mt-1 font-semibold underline">Try again</button>
              </div>
            )}
            {priceNotice && (
              <div className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                <Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                <p>{priceNotice}</p>
              </div>
            )}
            {(issues.length > 0 || (stockConflict && stockConflict.length > 0)) && (
              <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800" role="alert">
                <p className="flex items-center gap-2 font-semibold">
                  <AlertTriangle size={16} aria-hidden="true" /> Some items need your attention
                </p>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  {issues.map((i, idx) => (
                    <li key={`${i.productId}-${idx}`}>
                      <strong>{lineName(i.productId)}:</strong> {i.message || i.code}
                    </li>
                  ))}
                  {(stockConflict || []).map((c, idx) => (
                    <li key={`c-${c.productId}-${idx}`}>
                      <strong>{c.name || lineName(c.productId)}:</strong>{" "}
                      {Number(c.available) > 0 ? `only ${c.available} left in stock` : "out of stock"}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={removeUnavailableItems}
                  className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                >
                  Remove unavailable items
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {summaryLines.map((line, idx) => (
              <div key={`${line.productId}-${line.size}-${idx}`} className="flex justify-between gap-3 text-brand-text">
                <span>
                  {line.name} {line.size ? `(${line.size})` : ""} × {line.quantity}
                  {line.available === false && <span className="ml-2 text-xs font-bold text-red-600">Out of stock</span>}
                </span>
                <span className="font-medium whitespace-nowrap">{line.lineTotal != null ? formatINR(line.lineTotal) : "—"}</span>
              </div>
            ))}

            <div className="border-t border-dashed border-secondary-200 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">{quote ? formatINR(quote.subtotal) : "—"}</span>
              </div>
              {quote && Number(quote.discount) > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount{discountCode ? ` (${discountCode})` : ""}</span>
                  <span>-{formatINR(quote.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-brand-text">
                <span>Shipping</span>
                <span>{quote ? (Number(quote.shipping) > 0 ? formatINR(quote.shipping) : "Free") : "—"}</span>
              </div>
              {!selectedAddress && (
                <p className="text-xs text-gray-500">Select a delivery address to confirm shipping.</p>
              )}
              <div className="flex justify-between text-xl font-bold text-brand-text mt-4 border-t border-dashed border-secondary-200 pt-4">
                <span>Total Payable</span>
                <span className="text-primary-600">{quote ? formatINR(quote.total) : "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
