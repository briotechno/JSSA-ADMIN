import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { cardAPI } from "../../utils/api";
import {
  Plus,
  Search,
  CreditCard,
  User,
  Calendar,
  Phone,
  ChevronRight,
  Loader2,
  Filter,
  X
} from "lucide-react";
import { useAuth } from "../../auth/AuthProvider";

const GREEN = "#3AB000";

import EmployeePlaceholder from "./EmployeePlaceholder";

const CardManagement = () => {
  const navigate = useNavigate();
  const { identifier } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(750);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [walletHistory, setWalletHistory] = useState(() => {
    const saved = localStorage.getItem("jssa_wallet_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem("jssa_wallet_balance");
    return saved !== null ? parseInt(saved) : 750;
  });

  // Developer/SuperAdmin Check
  const isDeveloper = identifier?.toLowerCase().trim() === 'vaghelamahipat1998@gmail.com' || identifier?.toLowerCase().trim() === 'admin@jssabhiyan.com';

  const handleRecharge = () => {
    const newBalance = walletBalance + selectedAmount;
    setWalletBalance(newBalance);
    localStorage.setItem("jssa_wallet_balance", newBalance);
    
    // Add to history
    const newHistory = [
      {
        id: Date.now(),
        type: 'RECHARGE',
        amount: selectedAmount,
        date: new Date().toISOString(),
        description: 'Wallet Recharge'
      },
      ...walletHistory
    ];
    setWalletHistory(newHistory);
    localStorage.setItem("jssa_wallet_history", JSON.stringify(newHistory));

    setIsRechargeModalOpen(false);
  };

  const fetchCards = async (page = 1) => {
    if (!isDeveloper) return; // Don't fetch if not developer
    try {
      setLoading(true);
      const res = await cardAPI.list({ search, page, limit: 10 });
      if (res.success) {
        setCards(res.data.cards);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [search, isDeveloper]);

  // If not the developer, show placeholder
  if (!isDeveloper) {
    return <EmployeePlaceholder title="Cards" />;
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Card Management</h1>
            <p className="text-[10px] font-black text-[#3AB000] uppercase tracking-[0.2em] mt-1">Issue & Manage Member Cards</p>
          </div>

          <div className="flex items-center justify-end gap-3 flex-1">
            {/* Right-to-Left Sliding Search */}
            <div className={`hidden md:block transition-all duration-500 ease-in-out overflow-hidden ${showFilter ? "flex-1 max-w-md opacity-100" : "max-w-0 opacity-0"}`}>
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3AB000]" size={18} />
                <input
                  type="text"
                  placeholder="Search members by name, ID or mobile..."
                  className="w-full pl-11 pr-4 py-3 bg-white border-2 border-[#3AB000] rounded-none text-sm font-black text-gray-900 outline-none transition-all placeholder:text-gray-300"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus={showFilter}
                />
              </div>
            </div>

            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center justify-center gap-2 px-6 py-3.5 font-bold transition-all border-2 rounded-none text-sm tracking-wide ${showFilter
                ? "bg-[#3AB000] text-white border-[#3AB000]"
                : "bg-white text-[#3AB000] border-[#3AB000]"
                }`}
            >
              <Filter size={18} />
              Filter
            </button>
            <button
              onClick={() => navigate("/employee/cards/add")}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#3AB000] text-white rounded-none font-bold border-2 border-[#3AB000] hover:bg-[#2d8a00] transition-all text-sm tracking-wide whitespace-nowrap"
            >
              <Plus size={20} />
              Add New Card
            </button>
          </div>

          {/* Mobile Search Input */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ${showFilter ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3AB000]" size={18} />
              <input
                type="text"
                placeholder="Search members..."
                className="w-full pl-11 pr-4 py-3 bg-white border-2 border-[#3AB000] rounded-none text-sm font-black text-gray-900 outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-none border-2 border-[#3AB000]/30 border-l-8 border-l-[#3AB000] flex items-center gap-5 transition-all hover:bg-green-50/30">
            <div className="p-4 bg-green-50 text-[#3AB000] rounded-none border border-[#3AB000]/10">
              <CreditCard size={28} />
            </div>
            <div>
              <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Total Issued Cards</p>
              <p className="text-3xl font-black text-gray-900 leading-none mt-1">{pagination.total}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-none border-2 border-[#3AB000] border-l-8 border-l-[#3AB000] flex items-center justify-between transition-all hover:bg-green-50/30">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-[#3AB000] text-white rounded-none">
                <span className="text-xl font-black">₹</span>
              </div>
              <div>
                <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Wallet Balance</p>
                <p className="text-3xl font-black text-[#3AB000] leading-none mt-1">₹{walletBalance}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setIsRechargeModalOpen(true)}
                className="px-6 py-2 bg-[#3AB000] text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#2d8a00] transition-all border border-[#2d8a00]"
              >
                Recharge
              </button>
              <button 
                onClick={() => setIsHistoryModalOpen(true)}
                className="px-6 py-2 bg-white text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-gray-900 transition-all border border-gray-200"
              >
                History
              </button>
            </div>
          </div>
        </div>

        {/* Recharge Modal */}
        {isRechargeModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-none border-t-[10px] border-[#3AB000] shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
              <div className="p-10">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 leading-none tracking-tight">ADD MONEY</h2>
                    <p className="text-[11px] font-black text-[#3AB000] uppercase tracking-[0.2em] mt-2">Wallet Recharge System</p>
                  </div>
                  <div className="p-4 bg-green-50 text-[#3AB000] border border-green-100">
                    <CreditCard size={28} />
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="text-[12px] font-black text-gray-400 uppercase tracking-[0.15em] block mb-4">Select Recharge Amount</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[750, 1500, 3000, 4500, 7500, 15000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setSelectedAmount(amt)}
                          className={`py-4 px-2 font-black text-base border-2 transition-all rounded-none ${
                            selectedAmount === amt 
                            ? "bg-[#3AB000] border-[#3AB000] text-white shadow-lg shadow-green-100" 
                            : "bg-white border-gray-100 text-gray-500 hover:border-[#3AB000]/30"
                          }`}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50/80 p-6 border-2 border-dashed border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Current Balance</span>
                      <span className="text-base font-black text-gray-900 tracking-tight">₹{walletBalance}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Adding Amount</span>
                      <span className="text-base font-black text-[#3AB000] tracking-tight">+ ₹{selectedAmount}</span>
                    </div>
                    <div className="mt-5 pt-5 border-t-2 border-gray-200 flex justify-between items-center">
                      <span className="text-[13px] font-black text-gray-900 uppercase tracking-widest">Final Balance</span>
                      <span className="text-2xl font-black text-gray-900 tracking-tighter">₹{walletBalance + selectedAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-10">
                  <button 
                    onClick={() => setIsRechargeModalOpen(false)}
                    className="py-5 font-black text-[11px] uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all border-2 border-transparent"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleRecharge}
                    className="py-5 bg-[#3AB000] text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#2d8a00] shadow-xl shadow-green-200 transition-all border-2 border-[#2d8a00]"
                  >
                    Confirm & Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Modal */}
        {isHistoryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-none border-t-[10px] border-[#3AB000] shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 leading-none tracking-tight">TRANSACTION HISTORY</h2>
                  <p className="text-[10px] font-black text-[#3AB000] uppercase tracking-widest mt-1">Wallet usage logs</p>
                </div>
                <button 
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="p-2 hover:bg-gray-100 transition-all"
                >
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-0">
                {walletHistory.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-gray-50 z-10">
                      <tr className="border-b border-gray-100">
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {walletHistory.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50/50">
                          <td className="px-8 py-4">
                            <p className="text-xs font-black text-gray-900">{new Date(log.date).toLocaleDateString()}</p>
                            <p className="text-[10px] font-bold text-gray-400">{new Date(log.date).toLocaleTimeString()}</p>
                          </td>
                          <td className="px-8 py-4">
                            <span className={`text-[10px] font-black px-2 py-0.5 mr-2 ${log.type === 'RECHARGE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {log.type}
                            </span>
                            <span className="text-xs font-bold text-gray-600">{log.description}</span>
                          </td>
                          <td className={`px-8 py-4 text-right font-black text-sm ${log.type === 'RECHARGE' ? 'text-green-600' : 'text-red-600'}`}>
                            {log.type === 'RECHARGE' ? '+' : '-'} ₹{log.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-20 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No transactions found</p>
                  </div>
                )}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
                <button 
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="px-10 py-3 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-all border border-gray-900"
                >
                  Close History
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cards Table */}
        <div className="bg-white rounded-none border-2 border-[#3AB000] overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-[#3AB000]" />
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Fetching member records...</p>
            </div>
          ) : cards.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#3AB000] text-white">
                    <th className="px-8 py-5 text-sm font-bold tracking-wide whitespace-nowrap">Cardholder Name</th>
                    <th className="px-8 py-5 text-sm font-bold tracking-wide text-center whitespace-nowrap">Card ID</th>
                    <th className="px-8 py-5 text-sm font-bold tracking-wide whitespace-nowrap">Mobile</th>
                    <th className="px-8 py-5 text-sm font-bold tracking-wide whitespace-nowrap">Issue Date</th>
                    <th className="px-8 py-5 text-sm font-bold tracking-wide whitespace-nowrap">Status</th>
                    <th className="px-8 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {cards.map((card) => (
                    <tr key={card._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-none bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-100">
                            {card.photo ? (
                              <img src={card.photo} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <User size={20} className="text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-[15px] font-black text-gray-900">{card.cardholderName}</p>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{card.gender} • Age {card.age}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="text-[11px] font-black text-[#3AB000] bg-green-50 px-3 py-1.5 rounded-none border-2 border-green-100/50">
                          {card.cardId}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm font-black text-gray-700">
                        {card.mobileNumber}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-[13px] text-gray-500 font-bold">
                          <Calendar size={16} />
                          {new Date(card.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[11px] font-black px-3 py-1.5 rounded-none border-2 ${card.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                          }`}>
                          {card.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => navigate(`/employee/cards/view/${card._id}`)}
                          className="text-gray-400 hover:text-[#3AB000] transition-colors p-2 hover:bg-green-50"
                        >
                          <ChevronRight size={22} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-none flex items-center justify-center text-gray-300">
                <CreditCard size={32} />
              </div>
              <div>
                <p className="font-bold text-gray-900">No Cards Issued Yet</p>
                <p className="text-xs text-gray-400 mt-1">Start by creating a new identity card.</p>
              </div>
              <button
                onClick={() => navigate("/employee/cards/add")}
                className="mt-2 px-6 py-2.5 bg-[#3AB000] text-white rounded-none font-bold text-sm border border-[#2d8a00]"
              >
                Create New Card
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => fetchCards(i + 1)}
                className={`w-10 h-10 rounded-none font-bold text-sm transition-all ${pagination.page === i + 1
                  ? 'bg-[#3AB000] text-white border border-[#2d8a00]'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CardManagement;
