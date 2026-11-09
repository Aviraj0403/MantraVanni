import React, { useRef, useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Printer, Download, Truck } from "lucide-react";
import logo from "../image/Logo.webp";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Axios from "../utils/Axios"; // Import Axios for fetching fallback

export default function Invoice() {
  const { orderId } = useParams(); // Get the dynamic orderId from the URL
  const invoiceRef = useRef();
  const location = useLocation(); // Get the state passed via navigate

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getOrderDetails = async () => {
      // 1. Check if order data was passed via location state (immediate display)
      if (location.state?.order) {
        setOrderData(location.state.order);
        setLoading(false);
        return;
      }

      // 2. Fetch from backend if state is missing (on refresh or direct access)
      try {
        setLoading(true);
        const response = await Axios.get(`/orders/getOrderById/${orderId}`);
        if (response.data.success) {
          setOrderData(response.data.order);
        } else {
          setError(response.data.message || "Order not found");
        }
      } catch (err) {
        console.error("Error fetching invoice data:", err);
        setError("Failed to load invoice details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getOrderDetails();
  }, [orderId, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-primary-600 font-bold animate-pulse">Generating Invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Printer size={32} />
          </div>
          <h2 className="text-xl font-bold text-brand-text mb-2">Invoice Not Found</h2>
          <p className="text-gray-500 mb-6">{error || "We couldn't retrieve the invoice details for this order."}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  // NORMALIZE DATA
  const idToDisplay = orderData._id || orderData.id || orderId;
  const itemsList = orderData.items || [];

  // Normalized Customer/Shipping Info
  const displayAddress = orderData.shippingAddress || {};
  const displayCustomerName = displayAddress.name || "Customer";
  const displayEmail = displayAddress.email || orderData.user?.email || "N/A";
  const displayPhone = displayAddress.phoneNumber || "N/A";
  const displayStreet = displayAddress.street || "N/A";

  // Normalized Shipping
  const shippingInfo = orderData.shipping || {};
  const shippingComputed = typeof shippingInfo === 'object'
    ? (shippingInfo.charges !== undefined ? Number(shippingInfo.charges) : 80)
    : Number(shippingInfo || 80);

  // Normalized Coupon
  const couponDiscount = Number(orderData.discountAmount || (orderData.appliedCoupon?.discountAmount) || 0);
  const couponCode = orderData.discountCode || orderData.appliedCoupon?.code || "None";

  // Normalized Totals
  const displaySubtotal = Number(orderData.subtotal || itemsList.reduce((acc, item) => acc + (item.selectedVariant?.price * item.quantity), 0) || 0);
  const displayFinal = Number(orderData.totalAmount || orderData.finalAmount || (displaySubtotal + shippingComputed - couponDiscount));

  const displayPaymentMethod = orderData.paymentMethod || "N/A";
  const displayPaymentStatus = orderData.paymentStatus || orderData.orderStatus || "N/A";

  // PDF DOWNLOAD FUNCTION
  const handleDownload = async () => {
    const input = invoiceRef.current;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save(`Invoice-${idToDisplay}.pdf`);
  };

  // PRINT FUNCTION
  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `Invoice-${idToDisplay}`;
    window.print();
    document.title = originalTitle;
  };

  return (
    <div className="min-h-screen bg-primary-50 p-4 md:p-6 flex justify-center items-start relative">
      {/* WATERMARK */}
      <img
        src={logo}
        alt="Watermark Logo"
        className="absolute top-1/2 left-1/2 w-[90%] md:w-3/4 max-w-xl opacity-3 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-11 select-none"
      />

      {/* INVOICE CONTAINER */}
      <div
        ref={invoiceRef}
        className="bg-white shadow-xl rounded-2xl p-4 md:p-8 w-full max-w-4xl border border-primary-200 relative z-10"
      >
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
          {/* Logo + Brand */}
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
            <img src={logo} alt="Logo" className="w-20 md:w-24" />
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-primary-600">
                Nisha Sagar
              </h1>
              <p className="text-gray-500 text-xs md:text-sm">
                Premium Cosmetics & Beauty Products
              </p>
            </div>
          </div>

          {/* DOWNLOAD + PRINT BUTTONS */}
          <div className="flex gap-2 w-full md:w-auto justify-center print:hidden">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 md:gap-2 bg-primary-500 hover:bg-primary-600 text-white px-3 md:px-4 py-2 rounded-lg shadow text-xs md:text-sm transition"
            >
              <Download size={14} className="md:w-4" /> Download
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1 md:gap-2 bg-gray-100 hover:bg-gray-200 text-brand-text px-3 md:px-4 py-2 rounded-lg shadow text-xs md:text-sm transition"
            >
              <Printer size={14} className="md:w-4" /> Print
            </button>
          </div>
        </div>

        {/* INVOICE INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 text-xs md:text-sm text-brand-text border-b border-primary-200 pb-4">
          <div className="space-y-2">
            <p><strong>Invoice #: </strong>{idToDisplay}</p>
            <p><strong>Date: </strong>{orderData.placedAt ? new Date(orderData.placedAt).toLocaleDateString() : new Date().toLocaleDateString()}</p>
            <p><strong>Payment Method: </strong>{displayPaymentMethod}</p>
            <p>
              <strong>Order Status: </strong>
              <span className={`font-semibold ${displayPaymentStatus === "Pending" ? "text-yellow-500" : "text-green-500"}`}>
                {displayPaymentStatus}
              </span>
            </p>
            <p><strong>Shipping Method: </strong>Standard Delivery</p>
            <p><strong>Coupon Applied: </strong>{couponCode}</p>
          </div>

          <div className="space-y-2">
            <p><strong>Billed To:</strong> {displayCustomerName}</p>
            <p>{displayEmail}</p>
            <p>{displayPhone}</p>
            <p>{displayStreet}</p>
            <p><strong>Shipping To:</strong> {displayStreet}</p>
            <p>{displayPhone}</p>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-xs md:text-sm border-collapse border border-primary-100">
            <thead>
              <tr className="bg-primary-50 text-brand-text">
                <th className="py-2 px-3">Item</th>
                <th className="py-2 px-3 text-center">Qty</th>
                <th className="py-2 px-3 text-right">Price</th>
                <th className="py-2 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {itemsList.map((item, index) => {
                const itemName = item.product?.name || item.name || item.selectedVariant?.name || "Premium Product";
                const itemSize = item.selectedVariant?.size || item.size || "N/A";
                const itemColor = item.selectedVariant?.color || item.color || "Standard";
                const itemPrice = Number(item.selectedVariant?.price || item.price || 0);
                const itemQty = Number(item.quantity || 0);

                return (
                  <tr key={index} className="border-b border-primary-100">
                    <td className="py-2 px-3">
                      <div className="font-semibold">{itemName}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-tighter">
                        Size: {itemSize} | Color: {itemColor}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">{itemQty}</td>
                    <td className="py-2 px-3 text-right">₹{itemPrice.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right">₹{(itemPrice * itemQty).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* TOTALS SECTION */}
        <div className="mt-6 flex flex-col items-end text-brand-text font-semibold text-xs md:text-sm space-y-1">
          <p>Subtotal: ₹{displaySubtotal.toFixed(2)}</p>
          {couponDiscount > 0 && (
            <p className="text-green-600">Coupon ({couponCode}): -₹{couponDiscount.toFixed(2)}</p>
          )}
          <p>Shipping: ₹{shippingComputed.toFixed(2)}</p>

          <div className="self-start md:self-center py-4">
            <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary-700 px-4 py-2 rounded-lg">
              <Truck size={16} />
              <span className="text-sm font-medium">Your order will be delivered within 3-5 business days.</span>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2 border-t border-primary-100 w-full justify-end">
            <span className="text-gray-500 uppercase tracking-widest text-[10px] font-black">Grand Total</span>
            <span className="text-2xl text-primary-600 font-black">
              ₹{displayFinal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-6 border-t border-primary-200 pt-3 text-xs md:text-sm text-gray-500 space-y-1">
          <p><strong>Note:</strong> Thank you for shopping with Nisha Sagar.</p>
          <p>
            For any queries, contact{" "}
            <span className="text-primary-600 font-semibold">
              nishasagar8510@gmail.com
            </span>
          </p>
        </div>

        <p className="text-center text-gray-400 text-[10px] md:text-xs mt-4">
          ❤️ Made with love by Nisha Sagar
        </p>
      </div>
    </div>
  );
}
