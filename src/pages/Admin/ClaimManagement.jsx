import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { claimsAPI } from "../../utils/api";
import {
  ShieldCheck,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Eye,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  X,
  Filter,
  User,
  History
} from "lucide-react";
// Re-enabling sonner for premium feel if user has it, or using alert fallback

const GREEN = "#3AB000";
const GREEN_DARK = "#2d8a00";
const GREEN_LIGHT = "#e8f5e2";

const ClaimManagement = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Rejection Modal State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [remark, setRemark] = useState("");

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await claimsAPI.getAllClaims();
      if (res.success) {
        setClaims(res.data);
      }
    } catch (err) {
      alert("Failed to load claims");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this claim?")) return;

    try {
      setUpdating(true);
      const res = await claimsAPI.updateStatus(id, "approved", "Approved by Administrator");
      if (res.success) {
        alert("Claim approved successfully");
        fetchClaims();
      }
    } catch (err) {
      alert(err.message || "Approval failed");
    } finally {
      setUpdating(false);
    }
  };

  const openRejectModal = (claim) => {
    setSelectedClaim(claim);
    setRemark("");
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!remark) {
      alert("Please provide a reason for rejection");
      return;
    }

    try {
      setUpdating(true);
      const res = await claimsAPI.updateStatus(selectedClaim._id, "rejected", remark);
      if (res.success) {
        alert("Claim rejected with reason");
        setShowRejectModal(false);
        fetchClaims();
      }
    } catch (err) {
      alert(err.message || "Rejection failed");
    } finally {
      setUpdating(false);
    }
  };

  const filteredClaims = claims.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.userId?.phone?.includes(search) ||
      c.memberName?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: claims.length,
    pending: claims.filter(c => c.status === 'pending').length,
    approved: claims.filter(c => c.status === 'approved').length,
    rejected: claims.filter(c => c.status === 'rejected').length
  };

  return (
    <DashboardLayout>
      <div className="p-0 ml-0 md:ml-6 px-2 md:px-0 mt-4 space-y-4 h-full max-w-[99rem]">

        {/* Top Stats - Unified Style */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mr-4">
          {/* Total */}
          <div className="flex items-center justify-between bg-white border border-gray-200 px-6 py-5 rounded-none shadow-sm">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Requests</span>
              <span className="text-2xl font-black text-gray-800 leading-none">{loading ? '...' : stats.total}</span>
            </div>
            <div className="p-3 bg-gray-100 text-gray-500 rounded-full">
              <History className="w-5 h-5" />
            </div>
          </div>

          {/* Pending */}
          <div className="flex items-center justify-between bg-white border border-gray-200 px-6 py-5 rounded-none shadow-sm">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending Sync</span>
              <span className="text-2xl font-black text-amber-500 leading-none">{loading ? '...' : stats.pending}</span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-500 rounded-full">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Approved */}
          <div className="flex items-center justify-between bg-white border border-gray-200 px-6 py-5 rounded-none shadow-sm">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Authorized</span>
              <span className="text-2xl font-black text-[#3AB000] leading-none">{loading ? '...' : stats.approved}</span>
            </div>
            <div className="p-3 bg-green-50 text-[#3AB000] rounded-full">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          {/* Rejected */}
          <div className="flex items-center justify-between bg-white border border-gray-200 px-6 py-5 rounded-none shadow-sm">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Terminated</span>
              <span className="text-2xl font-black text-red-500 leading-none">{loading ? '...' : stats.rejected}</span>
            </div>
            <div className="p-3 bg-red-50 text-red-500 rounded-full">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Header Section - Filter Bar */}
        <div className="bg-white p-4 border border-gray-200 rounded-none shadow-sm space-y-4 mr-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-1">
              <h1 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-2 uppercase">
                <ShieldCheck className="w-6 h-6 text-[#3AB000]" />
                Claim Requests
              </h1>
            </div>

            <button
              onClick={fetchClaims}
              className="bg-black hover:bg-gray-800 text-white text-xs sm:text-sm px-5 h-10 font-medium rounded-none shadow-sm transition-all flex items-center gap-2 uppercase tracking-wide"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center border-t border-gray-100 pt-4">
            <div className="flex h-10 w-full md:w-auto flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search Member, Phone, Title..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:border-[#3AB000] text-xs sm:text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                className="h-10 border border-gray-300 rounded-none px-3 text-xs sm:text-sm font-medium text-gray-700 bg-white focus:outline-none shadow-sm min-w-[160px] cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Status: All Requests</option>
                <option value="pending">Status: Pending</option>
                <option value="approved">Status: Approved</option>
                <option value="rejected">Status: Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-none overflow-hidden border border-gray-200 shadow-sm mr-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-[#3AB000]">
                  <th className="px-6 py-4 font-black text-black text-[13px] uppercase tracking-wide">Member Identity</th>
                  <th className="px-6 py-4 font-black text-black text-[13px] uppercase tracking-wide">Claim Details</th>
                  <th className="px-6 py-4 font-black text-black text-[13px] uppercase tracking-wide text-center">Evidence</th>
                  <th className="px-6 py-4 font-black text-black text-[13px] uppercase tracking-wide text-center">Status</th>
                  <th className="px-6 py-4 font-black text-black text-[13px] uppercase tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="5" className="px-6 py-8"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                    </tr>
                  ))
                ) : filteredClaims.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <AlertCircle size={48} className="text-gray-200 mx-auto mb-4" />
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">No claims found</p>
                    </td>
                  </tr>
                ) : (
                  filteredClaims.map((claim) => (
                    <tr key={claim._id} className="hover:bg-[#e8f5e2] transition-colors border-b border-gray-100">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#0A3D00] text-white flex items-center justify-center font-black text-sm rounded-none">
                            {claim.memberName?.[0].toUpperCase() || "M"}
                          </div>
                          <div>
                            <p className="text-[14px] font-black text-gray-900 tracking-tight leading-none mb-1 uppercase">
                              {claim.memberName || "Unknown Member"}
                            </p>
                            <p className="text-[11px] font-bold text-gray-400 tracking-tighter">{claim.userId?.phone || claim.userId?.email || "No Contact"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="max-w-xs">
                          <p className="text-[13px] font-black text-gray-800 uppercase leading-none mb-1.5">{claim.title}</p>
                          <p className="text-[11px] font-medium text-gray-500 line-clamp-1">{claim.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <a
                          href={claim.evidence}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-widest hover:bg-[#3AB000] hover:text-white transition-all shadow-sm"
                        >
                          <Eye size={14} />
                          Inspect
                        </a>
                      </td>
                      <td className="px-6 py-5 text-center">
                        {claim.status === 'pending' && <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest bg-amber-50 px-2.5 py-1 border border-amber-100">Pending</span>}
                        {claim.status === 'approved' && <span className="text-green-600 text-[10px] font-black uppercase tracking-widest bg-green-50 px-2.5 py-1 border border-green-100">Authorized</span>}
                        {claim.status === 'rejected' && <span className="text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-50 px-2.5 py-1 border border-red-100">Terminated</span>}
                      </td>
                      <td className="px-6 py-5 text-right">
                        {claim.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(claim._id)}
                              disabled={updating}
                              className="p-2.5 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all border border-green-100 shadow-sm"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                            <button
                              onClick={() => openRejectModal(claim)}
                              disabled={updating}
                              className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100 shadow-sm"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Decision Final</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Rejection Modal - Styled like AdminTransactions Modal */}
      {showRejectModal && selectedClaim && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4">
          <div className="bg-white shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-red-600">
              <h2 className="text-white font-bold text-base flex items-center gap-2 uppercase tracking-wide">
                <AlertCircle className="w-5 h-5" /> Request Termination
              </h2>
              <button
                onClick={() => setShowRejectModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-1 text-center">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Member Name</label>
                <div className="text-sm font-black text-gray-800 uppercase">{selectedClaim.memberName || "Unknown Member"}</div>
                <div className="text-[11px] font-bold text-red-500 mt-1 uppercase bg-red-50 px-3 py-1 rounded w-fit mx-auto">Rejecting: {selectedClaim.title}</div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Official Rejection Remark</label>
                <textarea
                  rows="4"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter specific reason for rejection..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-red-500 outline-none transition-all font-bold text-gray-800 text-sm"
                />
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-amber-700 text-[10px] font-black uppercase tracking-wide leading-relaxed">
                Warning: This action is permanent and will be visible to the member immediately.
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-6 py-2.5 text-xs font-black text-gray-500 hover:text-gray-800 transition-colors uppercase tracking-widest border border-gray-200 bg-white"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={updating}
                className="bg-red-600 hover:bg-black text-white text-[11px] font-black px-6 py-2.5 rounded-sm transition-all uppercase tracking-widest shadow-md flex items-center gap-2"
              >
                {updating && <Loader2 size={14} className="animate-spin" />}
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ClaimManagement;
