import React, { useState, useEffect } from 'react';
import { Wallet, PlusCircle, ArrowUpRight, ArrowDownLeft, RefreshCw, ShieldCheck, CreditCard, Share2, Copy, Check } from 'lucide-react';
import { getMyWallet, addWalletFunds, claimReferralCode } from '../services/walletWishlistApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Axios from '../utils/Axios';

export default function WalletPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [referralInput, setReferralInput] = useState('');
  const [referralLoading, setReferralLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const res = await getMyWallet();
      if (res?.success) {
        setWalletData(res.data);
      }
    } catch (err) {
      console.error("Error fetching wallet:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/signin?redirect=/wallet');
    } else {
      fetchWallet();
    }
  }, [user]);

  const handleTopUp = async (e) => {
    e.preventDefault();
    const num = Number(topUpAmount);
    if (!num || num <= 0) {
      setMsg({ text: 'Please enter a valid amount', type: 'error' });
      return;
    }

    try {
      setTopUpLoading(true);
      setMsg({ text: '', type: '' });

      // 💳 1. Attempt Real Razorpay Payment Gateway Trigger
      try {
        const orderRes = await Axios.post('/razorpay/createRazorpayOrder', {
          amount: Math.round(num),
          userId: user?._id || user?.id,
          purpose: 'WALLET_TOPUP'
        });

        if (orderRes.data?.success && window.Razorpay) {
          const options = {
            key: orderRes.data.key_id,
            amount: orderRes.data.amount,
            currency: 'INR',
            order_id: orderRes.data.order_id,
            name: 'Wallet Top-Up',
            description: `Adding ₹${num} to Retailer Wallet`,
            handler: async function (response) {
              try {
                // Verify payment & credit wallet
                const verifyRes = await Axios.post('/razorpay/verifyPayment', {
                  payment_id: response.razorpay_payment_id,
                  order_id: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                  paymentId: orderRes.data.paymentId
                });

                if (verifyRes.data?.success) {
                  const creditRes = await addWalletFunds(
                    num,
                    'Wallet Top-Up via Razorpay Gateway',
                    orderRes.data.paymentId,
                    'RAZORPAY',
                    response.razorpay_order_id,
                    response.razorpay_payment_id,
                    response.razorpay_signature
                  );
                  if (creditRes?.success) {
                    setWalletData(creditRes.data);
                    setTopUpAmount('');
                    setMsg({ text: `Successfully credited ₹${num} via Razorpay!`, type: 'success' });
                  }
                }
              } catch (verifyErr) {
                setMsg({ text: 'Payment verification failed. Please contact support.', type: 'error' });
              } finally {
                setTopUpLoading(false);
              }
            },
            prefill: {
              name: user?.userName || '',
              email: user?.email || '',
              contact: user?.phoneNumber || ''
            },
            theme: { color: '#dc2626' }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
          return;
        }
      } catch (rzpErr) {
        setMsg({ text: rzpErr?.response?.data?.message || 'Razorpay Gateway error. Please try again.', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to add funds', type: 'error' });
    } finally {
      setTopUpLoading(false);
    }
  };

  const handleClaimReferral = async (e) => {
    e.preventDefault();
    if (!referralInput.trim()) return;
    try {
      setReferralLoading(true);
      setMsg({ text: '', type: '' });
      const res = await claimReferralCode(referralInput.trim());
      if (res?.success) {
        setWalletData(res.data);
        setReferralInput('');
        setMsg({ text: res.message, type: 'success' });
      }
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Invalid or already used referral code', type: 'error' });
    } finally {
      setReferralLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (walletData?.referralCode) {
      navigator.clipboard.writeText(walletData.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-12 flex justify-center items-center bg-brand-bg">
        <div className="flex items-center gap-3 text-primary-600 font-semibold">
          <RefreshCw className="animate-spin" size={24} />
          Loading Business Wallet...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 bg-brand-bg">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-accent-800 via-accent-700 to-accent-600 text-white rounded-3xl p-8 shadow-xl mb-8 border border-accent-300/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-500/20 text-secondary-200 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-primary-500/30">
                <ShieldCheck size={14} /> BULKO BUSINESS WALLET
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">My Wallet & Referral Earnings</h1>
              <p className="text-white/70 text-sm mt-1">Instant Razorpay Top-Up & ₹250 Fixed Reward per Friend Referral.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 min-w-[220px]">
              <span className="text-xs text-gray-300 font-medium uppercase tracking-wider block mb-1">Available Balance</span>
              <div className="text-3xl font-bold text-emerald-400 flex items-center gap-1">
                ₹{walletData?.balance?.toLocaleString() || 0}
              </div>
            </div>
          </div>
        </div>

        {msg.text && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {msg.text}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Left Column: Top-up & Refer */}
          <div className="space-y-6">
            
            {/* Razorpay Top-up Form */}
            <div className="bg-brand-bg p-6 rounded-2xl shadow-sm border border-secondary-200">
              <h2 className="text-base font-bold text-brand-text mb-3 flex items-center gap-2">
                <PlusCircle className="text-primary-600" size={18} /> Top-Up via Razorpay
              </h2>
              <form onSubmit={handleTopUp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-text/70 mb-1.5">Enter Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-brand-text/60 font-semibold text-sm">₹</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 2000"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 rounded-xl border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold text-brand-text text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {[500, 2000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt.toString())}
                      className="flex-1 py-1 bg-secondary-50 hover:bg-primary-50 text-brand-text hover:text-primary-700 rounded-lg text-xs font-semibold border border-secondary-200 transition"
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={topUpLoading}
                  className="w-full py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm rounded-xl shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {topUpLoading ? <RefreshCw className="animate-spin" size={16} /> : <CreditCard size={16} />}
                  Pay via Razorpay
                </button>
              </form>
            </div>

            {/* Refer & Earn Widget */}
            <div className="bg-gradient-to-br from-accent-800 to-accent-700 text-white p-6 rounded-2xl shadow-sm border border-accent-600">
              <h2 className="text-base font-bold mb-1 flex items-center gap-2 text-secondary-300">
                <Share2 size={18} /> Refer & Earn ₹250
              </h2>
              <p className="text-xs text-gray-300 mb-4">Share your code. When a friend signs up & claims it, both get ₹250 wallet credit!</p>

              <div className="bg-accent-800 p-3 rounded-xl border border-accent-600 flex items-center justify-between mb-4">
                <span className="font-mono font-bold tracking-wider text-secondary-300 text-sm">
                  {walletData?.referralCode || 'BULKO...'}
                </span>
                <button
                  onClick={copyReferralCode}
                  className="p-1.5 bg-accent-700 hover:bg-accent-600 text-white rounded-lg transition"
                  title="Copy Referral Code"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
              </div>

              {/* Redeem Friend's Code */}
              <form onSubmit={handleClaimReferral} className="space-y-2">
                <label className="block text-[11px] text-brand-text/50 uppercase font-semibold">Have a Referral Code?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Code"
                    value={referralInput}
                    onChange={(e) => setReferralInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-accent-800 border border-accent-600 text-white text-xs uppercase focus:outline-none focus:border-secondary-400 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={referralLoading}
                    className="px-4 py-1.5 bg-secondary-400 hover:bg-secondary-500 text-accent-800 font-bold text-xs rounded-lg transition disabled:opacity-50"
                  >
                    Claim
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Right Column: Detailed Transactions Ledger */}
          <div className="md:col-span-2 bg-brand-bg p-6 rounded-2xl shadow-sm border border-secondary-200">
            <h2 className="text-lg font-bold text-brand-text mb-4 flex items-center gap-2">
              <Wallet className="text-accent-600" size={20} /> Detailed Payment & Deduction Ledger
            </h2>

            {walletData?.transactions?.length === 0 ? (
              <div className="text-center py-12 text-brand-text/60">
                No wallet transactions recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-secondary-100 max-h-[460px] overflow-y-auto pr-1">
                {walletData?.transactions?.map((tx, idx) => (
                  <div key={idx} className="py-3.5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl mt-0.5 ${tx.type === 'CREDIT' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {tx.type === 'CREDIT' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-brand-text">{tx.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            tx.source === 'RAZORPAY' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            tx.source === 'REFERRAL' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            tx.source === 'ORDER_PAYMENT' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                            'bg-gray-100 text-brand-text'
                          }`}>
                            {tx.source}
                          </span>

                          {tx.paymentId && (
                            <span className="text-[11px] font-mono text-brand-text/50">
                              Ref: {tx.paymentId}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-brand-text/50 mt-1">
                          {new Date(tx.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <span className={`text-sm font-extrabold whitespace-nowrap ${tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
