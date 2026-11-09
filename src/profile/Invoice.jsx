import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Printer, Download } from "lucide-react";
import logo from "../image/Logo.webp";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Axios from "../utils/Axios"; // Axios for fetching order data

export default function Invoice() {
  const { orderId } = useParams();
  const invoiceRef = useRef();
  const [order, setOrder] = useState(null); // State to hold order data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch the order details based on the orderId
    const fetchOrderDetails = async () => {
      try {
        const response = await Axios.get(`/orders/getOrderById/${orderId}`);
        setOrder(response.data.order);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  if (!order) return <div className="p-6">Order not found</div>;

  // Extracting order details for rendering
  const customer = {
    name: order.shippingAddress.name,
    email: order.user.email,
    phone: order.shippingAddress.phoneNumber,
    address: order.shippingAddress.street,
  };

  const shippingAddress = {
    name: order.shippingAddress.name,
    address: order.shippingAddress.street,
    phone: order.shippingAddress.phoneNumber,
  };

  const items = order.items.map(item => ({
    name: item.product.name,
    size: item.selectedVariant.size,
    color: item.selectedVariant.color,
    qty: item.quantity,
    price: item.selectedVariant.price,
  }));

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const couponDiscount = order.discountAmount || 0;
    const finalAmount = subtotal - couponDiscount;
     // No GST as per new policy
     // Prefer backend shipping when available; otherwise use static ₹80
     const shipping = order.shipping?.charges !== undefined ? order.shipping.charges : 80;
     // Prefer backend totalAmount when available; otherwise compute
     const total = order.totalAmount !== undefined ? order.totalAmount : (subtotal - couponDiscount);

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

    pdf.save(`Invoice-${orderId}.pdf`);
  };

  // PRINT FUNCTION
  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `Invoice-${orderId}`;
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
            <p><strong>Invoice #: </strong>{orderId}</p>
            <p><strong>Date: </strong>{new Date(order.placedAt).toLocaleDateString()}</p>
            <p><strong>Payment Method: </strong>{order.paymentMethod}</p>
            <p>
              <strong>Order Status: </strong>
              <span className={`text-${order.orderStatus === "Pending" ? "gray" : order.orderStatus === "Shipped" ? "green" : "red"}-500 font-semibold`}>
                {order.orderStatus}
              </span>
            </p>
            <p><strong>Shipping Method: </strong>Standard Delivery</p>
            <p><strong>Coupon Applied: </strong>{order.discountCode}</p>
          </div>

          <div className="space-y-2">
            <p><strong>Billed To:</strong> {customer.name}</p>
            <p>{customer.email}</p>
            <p>{customer.phone}</p>
            <p>{customer.address}</p>
            <p><strong>Shipping To:</strong> {shippingAddress.address}</p>
            <p>{shippingAddress.phone}</p>
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
              {items.map((item, index) => (
                // console.log("Invoice Item:", item) ||
                <tr key={index} className="border-b border-primary-100">
                  <td className="py-2 px-3">{/* Display name, size, and color with fallback for missing values */}
                  {item.name } - ({item?.size}/{item?.color}) </td>
                  <td className="py-2 px-3 text-center">{item.qty}</td>
                  <td className="py-2 px-3 text-right">₹{item.price}</td>
                  <td className="py-2 px-3 text-right">₹{item.price * item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTALS SECTION */}
        <div className="mt-6 flex flex-col items-end text-brand-text font-semibold text-xs md:text-sm space-y-1">
          {/* <p>Subtotal: ₹{subtotal.toFixed(2)}</p> */}
          <p>Coupon Discount: -₹{couponDiscount.toFixed(2)}</p>
          {/* <p>Shipping: {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</p>
           */}
           <p>Shipping: ₹{shipping.toFixed(2)}</p>
                    {/* <p>Shipping: {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</p> */}
          {/* <p className="border-t pt-2 text-lg font-bold">Total: ₹{total.toFixed(2)} </p> */}
                  <p className="border-t pt-2 text-lg font-bold">Total: ₹{total.toFixed(2)}</p>
        </div>

      </div>
    </div>
  );
}
