import React, { useState } from "react";
import { Search, Package, AlertCircle, RefreshCw, Activity, MapPin, Truck, Phone } from "lucide-react";
import Axios from "../utils/Axios";
import OrderTrackingCard from "../components/Order/OrderTrackingCard";

const TrackOrder = () => {
  const [searchType, setSearchType] = useState("orderId"); // orderId or awb
  const [searchValue, setSearchValue] = useState("");
  const [order, setOrder] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem("gk_tracking_history");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchValue.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);
    setTrackingData(null);

    try {
      let response;
      if (searchType === "orderId") {
        response = await Axios.get(`/shipping/order/${searchValue}`);
      } else {
        response = await Axios.get(`/shipping/track/${searchValue}`);
      }

      if (response.data) {
        setOrder(response.data.order);
        setTrackingData(response.data.tracking);

        // Add to history
        const newHistory = [
          { id: searchValue, type: searchType, timestamp: Date.now() },
          ...searchHistory.filter(h => h.id !== searchValue)
        ].slice(0, 3);
        setSearchHistory(newHistory);
        localStorage.setItem("gk_tracking_history", JSON.stringify(newHistory));
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Tracking information not found. Please check your AWB code and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("gk_tracking_history");
  };

  const clearSearch = () => {
    setSearchValue("");
    setOrder(null);
    setTrackingData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-50 via-white to-primary-50/30 py-12 sm:py-20 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-600 text-xs font-black uppercase tracking-widest mb-6 border border-primary-100">
            <Package size={14} />
            <span>Quantum Logistics V4</span>
          </div>
          <h1 className="text-3xl sm:text-6xl font-black text-brand-text mb-4 tracking-tighter">
            Track Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-red-600">Beast</span> Order
          </h1>
          <p className="text-gray-500 text-sm sm:text-lg font-medium max-w-xl mx-auto leading-relaxed">
            Real-time fleet telemetry for elite customers. Enter your tracking signature below.
          </p>
        </div>

        {/* Search Container */}
        <div className={`mb-12 transition-all duration-700 ${order ? 'scale-95 opacity-50 blur-sm' : 'scale-100'}`}>
          <div className="bg-white/70 backdrop-blur-2xl p-8 sm:p-10 rounded-[3rem] shadow-2xl shadow-primary-200/20 border border-white/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>

            <form onSubmit={handleSearch} className="space-y-8 relative z-10">
              <div className="flex bg-gray-100/50 p-1.5 rounded-2xl w-fit mx-auto sm:mx-0">
                <button
                  type="button"
                  onClick={() => setSearchType("orderId")}
                  className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${searchType === "orderId"
                    ? "bg-white text-brand-text shadow-xl shadow-primary-100"
                    : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  Order Protocol
                </button>
                <button
                  type="button"
                  onClick={() => setSearchType("awb")}
                  className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${searchType === "awb"
                    ? "bg-white text-brand-text shadow-xl shadow-primary-100"
                    : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  AWB Telemetry
                </button>
              </div>

              <div className="relative group">
                <input
                  type="text"
                  placeholder={
                    searchType === "orderId"
                      ? "Enter Global Order ID (e.g. 64b1...)"
                      : "Enter AWB Signature (e.g. 1432...)"
                  }
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full bg-white/50 border-2 border-transparent focus:border-primary-200 focus:bg-white px-8 py-5 rounded-[2rem] text-lg font-bold text-brand-text placeholder:text-gray-300 outline-none transition-all shadow-inner"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-3 top-3 bottom-3 px-10 bg-gray-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-primary-600 transition-all disabled:opacity-50 active:scale-95 shadow-xl"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={16} />
                  ) : (
                    "INITIALIZE"
                  )}
                </button>
              </div>

              {searchHistory.length > 0 && (
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100/50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent Signals:</p>
                  {searchHistory.map((h, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSearchValue(h.id);
                        setSearchType(h.type);
                      }}
                      className="px-4 py-2 bg-gray-50 hover:bg-white hover:shadow-lg rounded-xl text-[10px] font-bold text-gray-600 border border-gray-100 transition-all"
                    >
                      {h.id.slice(-8)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="text-[10px] font-black text-primary-500 uppercase tracking-widest hover:underline"
                  >
                    Reset
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Clear Action */}
        {(order || trackingData || error) && (
          <div className="flex justify-center mb-12">
            <button
              onClick={clearSearch}
              className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-primary-600 transition-colors uppercase tracking-widest"
            >
              <RefreshCw size={14} className="rotate-45" />
              Clear Fleet Data
            </button>
          </div>
        )}

        {/* Error Visualization */}
        {error && (
          <div className="mb-12 p-6 bg-red-50/50 backdrop-blur-sm border border-red-100 rounded-[2rem] flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 flex-shrink-0">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-red-900 font-black text-sm uppercase tracking-tight">Access Denied</p>
              <p className="text-red-600/80 text-sm font-bold">{error}</p>
            </div>
          </div>
        )}

        {/* Results Area */}
        <div className="min-h-[200px] transition-all duration-1000">
          {loading && !order && !trackingData && (
            <div className="text-center py-20 animate-pulse">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 border-8 border-primary-50 border-t-purple-500 rounded-full animate-spin"></div>
                <Package className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-200 w-8 h-8" />
              </div>
              <p className="text-gray-400 font-black text-sm uppercase tracking-[0.3em]">Decoding Telemetry...</p>
            </div>
          )}

          {order && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <OrderTrackingCard order={order} />
            </div>
          )}

          {trackingData && !order && (
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white p-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100">
                <div className="p-4 bg-primary-50 rounded-2xl text-primary-600">
                  <Activity size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-brand-text tracking-tight">Telemetry Log</h2>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Raw Tracking Payload</p>
                </div>
              </div>

              {trackingData.tracking_data ? (
                <div className="space-y-6">
                  {trackingData.tracking_data.track_status?.map((track, index) => (
                    <div key={index} className="flex gap-6 group">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full border-4 border-white bg-primary-500 shadow-lg shadow-primary-200 group-hover:scale-125 transition-transform"></div>
                        <div className="w-0.5 h-full bg-gray-100 group-last:hidden mt-2"></div>
                      </div>
                      <div className="flex-1 pb-10">
                        <div className="bg-gray-50/50 rounded-3xl p-6 group-hover:bg-white transition-all group-hover:shadow-xl group-hover:shadow-primary-100/50 group-hover:-translate-y-1">
                          <p className="font-black text-brand-text text-lg mb-2">{track.activity || track.current_status}</p>
                          {track.location && (
                            <p className="text-sm font-bold text-gray-500 flex items-center gap-2 mb-3">
                              <MapPin size={14} className="text-primary-400" />
                              {track.location}
                            </p>
                          )}
                          <div className="inline-block px-3 py-1 bg-white rounded-lg text-[10px] font-black text-gray-400 shadow-sm border border-gray-100">
                            {track.date ? new Date(track.date).toLocaleString("en-IN") : "LIVE UPDATING"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No Active Telemetry</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Help */}
        <div className="mt-20 p-1 bg-gradient-to-br from-primary-500/10 via-transparent to-red-500/10 rounded-[3rem]">
          <div className="bg-white/90 backdrop-blur-xl rounded-[2.9rem] p-10 sm:p-14 border border-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-20">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6">
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-2xl font-black text-brand-text tracking-tight">Where is my Order ID?</h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  Every order at GK-Store is assigned a unique tracking signature. You can find this hex-code in your confirmation email or order dashboard.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                  <Truck size={24} />
                </div>
                <h3 className="text-2xl font-black text-brand-text tracking-tight">Need Support?</h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  Our logistics concierge is available 24/7 to assist with complex deliveries.
                  <a href="/contact-us" className="block mt-4 text-primary-600 font-black uppercase tracking-widest text-xs hover:tracking-[0.2em] transition-all italic underline decoration-primary-200 underline-offset-8">
                    Open Support Ticket →
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
