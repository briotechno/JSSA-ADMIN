import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { createPaperAPI } from "../../utils/api";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Edit,
  X,
  Save,
  AlertCircle,
  Download,
  Trash2,
  Plus,
  ArrowRight,
  Bell,
  Mail,
  MessageSquare,
  Edit3,
  RefreshCw,
  Pause,
  Play,
  Square,
} from "lucide-react";
import { useBroadcast } from "../../context/BroadcastContext";

// ── Status Badge ──
const StatusBadge = ({ status }) => {
  const styles = {
    Pass: "text-[#3AB000] font-semibold",
    Fail: "text-red-500 font-semibold",
    Missed: "text-amber-500 font-semibold",
    Pending: "text-gray-400 font-semibold",
    Done: "text-[#3AB000] font-semibold",
  };
  return (
    <span className={`text-xs ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
};

// ── Loading Overlay ──
function LoadingOverlay({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4 min-w-[200px]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-[#3AB000] border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm font-bold text-gray-800 animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}

// ── Edit MOU Modal ──
function EditMOUModal({ isOpen, onClose, data, onUpdate }) {
  const [startDate, setStartDate] = useState(data?.testId?.mouStartDate || "");
  const [endDate, setEndDate] = useState(data?.testId?.mouEndDate || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setStartDate(data.testId?.mouStartDate || "");
      setEndDate(data.testId?.mouEndDate || "");
    }
  }, [data]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await createPaperAPI.update(data.testId._id, {
        mouStartDate: startDate,
        mouEndDate: endDate
      });
      if (res.success) {
        onUpdate();
        onClose();
      } else {
        alert(res.error || "Failed to update MOU dates");
      }
    } catch {
      alert("Error connecting to server");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 my-auto">
        {/* Header - Job Posting Style */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#3AB000]">
          <h2 className="text-white font-bold text-base flex items-center gap-2">
            ✏️ Edit MOU Period
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Read-only sections with Job Posting form style */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Candidate Name</label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-800 font-medium">
                {data?.applicationId?.candidateName}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Exam Title</label>
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600 leading-relaxed break-words">
                {data?.testId?.title}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">MOU Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#3AB000] focus:border-[#3AB000] outline-none transition-all shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">MOU End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#3AB000] focus:border-[#3AB000] outline-none transition-all shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Professional Action Bar */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-black hover:bg-[#3AB000] text-white text-sm font-medium px-8 py-2.5 rounded-sm transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Update Date"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BulkEditMOUModal({ isOpen, onClose, selectedCount, onSave }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(startDate, endDate);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 my-auto">
        <div className="flex items-center justify-between px-6 py-4 bg-[#3AB000]">
          <h2 className="text-white font-bold text-base flex items-center gap-2">
            ✏️ Bulk Edit MOU Periods ({selectedCount})
          </h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-blue-700 text-xs font-medium">
            Selected {selectedCount} candidates will have their MOU dates updated to the following:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">MOU Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#3AB000] focus:border-[#3AB000] outline-none transition-all shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">MOU End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#3AB000] focus:border-[#3AB000] outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !startDate || !endDate}
            className="bg-black hover:bg-[#3AB000] text-white text-sm font-medium px-8 py-2.5 rounded-sm transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isSaving ? "Updating..." : "Update All Selected"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MOU() {
  const [attempts, setAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [mouFrom, setMouFrom] = useState("");
  const [mouTo, setMouTo] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [notifProgress, setNotifProgress] = useState({ sent: 0, total: 0 });
  const [selectedMOU, setSelectedMOU] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttempts, setSelectedAttempts] = useState([]);
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notifChannels, setNotifChannels] = useState({ sms: true, email: false });
  const [isAllSelectedGlobally, setIsAllSelectedGlobally] = useState(false);
  const [globalTestIds, setGlobalTestIds] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", onConfirm: null });
  const [successModal, setSuccessModal] = useState({ open: false, sent: 0, failed: 0 });
  const [notifFilter, setNotifFilter] = useState("all");
  const { addJob } = useBroadcast();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    limit: 10,
  });

  const tabs = [
    { id: "all", label: "All" },
    // { id: "pass", label: "Pass" },
    { id: "pending", label: "Pending" },
    { id: "done", label: "Done" },
    { id: "missed", label: "Missed" },
  ];

  const loadMOUList = async (page = 1) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await createPaperAPI.getMOUList({
        page,
        limit: pagination.limit,
        status: activeTab,
        search: searchQuery,
        mouFrom,
        mouTo,
        notificationStatus: notifFilter
      });
      if (res.success) {
        console.log("MOU List Data:", res.data.attempts);
        setAttempts(res.data.attempts || []);
        setPagination(res.data.pagination);
        setCurrentPage(page);
      } else {
        setError(res.error || "Failed to load candidate list.");
      }
    } catch {
      setError("Failed to connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    setIsLoading(true);
    try {
      // Use the standard API helper (Robust & Authenticated)
      const blob = await createPaperAPI.exportMOUCSV({
        status: activeTab,
        search: searchQuery,
        mouFrom: mouFrom || "",
        mouTo: mouTo || "",
      });

      // Handle the file download from the received blob
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `MOU_List_${activeTab}_${new Date().toLocaleDateString("en-IN").replace(/\//g, "-")}.csv`
      );
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export. Please check if you have permission or data is too large.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMOUList(1);
    setSelectedAttempts([]);
    setIsAllSelectedGlobally(false);
  }, [activeTab, searchQuery, mouFrom, mouTo, notifFilter]);

  const handleUpdateStatus = async (attemptId, newStatus) => {
    if (window.confirm(`Mark this candidate as ${newStatus}?`)) {
      setIsUpdating(true);
      try {
        const res = await createPaperAPI.updateMOUStatus(attemptId, newStatus);
        if (res.success) {
          loadMOUList(currentPage);
        } else {
          alert(res.error || "Failed to update status");
        }
      } catch {
        alert("Server error during update");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const toggleSelectAll = async () => {
    if (selectedAttempts.length > 0) {
      // If anything is selected, clicking header should unselect everything
      setSelectedAttempts([]);
      setIsAllSelectedGlobally(false);
      setGlobalTestIds([]);
    } else {
      // If nothing is selected, select all globally
      setIsUpdating(true);
      try {
        const res = await createPaperAPI.getMOUGlobalIds({
          search: searchQuery,
          status: activeTab,
          mouFrom,
          mouTo
        });
        if (res.success) {
          const results = res.data.results || [];
          setSelectedAttempts(results.map(r => r.attemptId));
          setGlobalTestIds([...new Set(results.map(r => r.testId))]);
          setIsAllSelectedGlobally(true);
        }
      } catch {
        alert("Failed to fetch all IDs");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const toggleSelectRow = (id) => {
    setIsAllSelectedGlobally(false);
    setSelectedAttempts(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkUpdate = async (startDate, endDate) => {
    let uniqueTestIds = [];

    if (isAllSelectedGlobally && globalTestIds.length > 0) {
      uniqueTestIds = globalTestIds;
    } else {
      uniqueTestIds = [...new Set(
        attempts
          .filter(a => selectedAttempts.includes(a._id))
          .map(a => a.testId?._id)
          .filter(Boolean)
      )];
    }

    if (uniqueTestIds.length === 0) {
      alert("No valid exams found for selected candidates.");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await createPaperAPI.bulkUpdateMOU({
        testIds: uniqueTestIds,
        mouStartDate: startDate,
        mouEndDate: endDate
      });
      if (res.success) {
        loadMOUList(currentPage);
        setSelectedAttempts([]);
        setIsAllSelectedGlobally(false);
        setIsBulkUpdateModalOpen(false);
      } else {
        alert(res.error || "Bulk update failed");
      }
    } catch {
      alert("Server error during bulk update");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendNotifications = async () => {
    if (selectedAttempts.length === 0) {
      alert("Please select at least one candidate.");
      return;
    }

    setConfirmModal({
      open: true,
      title: "Confirm Broadcast",
      message: `Are you sure you want to send notifications to ${selectedAttempts.length} candidates? This will be processed in batches to ensure maximum delivery success.`,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, open: false }));
        await startBroadcast();
      }
    });
  };



  const startBroadcast = async () => {
    setIsUpdating(true);
    try {
      const res = await createPaperAPI.startMOUBroadcast(selectedAttempts, notifChannels);
      if (res.success) {
        addJob({
          _id: res.data.jobId,
          title: "MOU Notifications Campaign",
          totalCandidates: selectedAttempts.length,
          sentCount: 0,
          status: "processing",
          jobType: "mou"
        });
        
        setIsNotificationModalOpen(false);
        setSelectedAttempts([]);
      }
    } catch (err) {
      console.error("Broadcast error:", err);
      alert("Failed to start broadcast");
    } finally {
      setIsUpdating(false);
    }
  };



  return (
    <DashboardLayout>
      {(isLoading || isUpdating) && (
        <LoadingOverlay 
          message={isUpdating 
            ? `Broadcasting Notifications... ${notifProgress.sent}/${notifProgress.total} (${Math.round((notifProgress.sent / (notifProgress.total || 1)) * 100)}%)` 
            : "Loading dashboard..."
          } 
        />
      )}

      <div className="p-0 ml-0 md:ml-6 px-2 md:px-0 mt-4 h-full">
        <div className="bg-white p-4 border border-gray-200 rounded-none shadow-sm mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Left: Tabs & Search */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-1">
              {/* Status Tabs */}
              <div className="flex border border-gray-200 rounded-none overflow-hidden h-10">
                {["all", "Pending", "Done", "Missed"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 text-xs sm:text-sm font-medium transition-all uppercase tracking-wide ${
                      activeTab === tab 
                        ? "bg-[#248000] text-white" 
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="flex h-10 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search Candidate, App No..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:border-[#248000] text-xs sm:text-sm flex-1 md:w-64"
                />
                <button
                  onClick={() => loadMOUList(1)}
                  className="bg-[#248000] hover:bg-[#1a5e00] text-white text-xs sm:text-sm px-6 font-medium transition-colors uppercase tracking-wide"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Right: Filters & Export */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Notification Filter */}
              <select
                value={notifFilter}
                onChange={(e) => {
                  setNotifFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 border border-gray-300 rounded-none px-3 text-xs sm:text-sm font-medium text-gray-700 bg-white focus:outline-none shadow-sm min-w-[160px] cursor-pointer"
              >
                <option value="all">Notif: All</option>
                <option value="Sent">Notified ✅</option>
                <option value="Pending">Pending ⏳</option>
              </select>

              {/* Export Button */}
              <button
                onClick={handleExport}
                className="bg-black hover:bg-gray-800 text-white text-xs sm:text-sm px-5 h-10 font-medium rounded-none shadow-sm transition-all flex items-center gap-2 uppercase tracking-wide"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Secondary Row: Date Filters & Selection Actions */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Date Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 h-10 px-3 border border-gray-200 bg-gray-50/50">
                <span className="text-[10px] font-bold text-gray-400 uppercase">MOU Start</span>
                <input
                  type="date"
                  value={mouFrom}
                  onChange={(e) => {
                    setMouFrom(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent border-none focus:outline-none text-xs text-gray-700"
                />
              </div>
              <div className="flex items-center gap-2 h-10 px-3 border border-gray-200 bg-gray-50/50">
                <span className="text-[10px] font-bold text-gray-400 uppercase">MOU End</span>
                <input
                  type="date"
                  value={mouTo}
                  onChange={(e) => {
                    setMouTo(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent border-none focus:outline-none text-xs text-gray-700"
                />
              </div>
              {(mouFrom || mouTo) && (
                <button 
                  onClick={() => { setMouFrom(""); setMouTo(""); }}
                  className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase underline underline-offset-4"
                >
                  Clear dates
                </button>
              )}
            </div>

            <div className={`flex items-center gap-2 transition-all duration-300 ${selectedAttempts.length > 0 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none"}`}>
              <button
                onClick={() => setIsNotificationModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-50 text-[#248000] border border-[#248000] hover:bg-[#248000] hover:text-white transition-all font-medium text-xs uppercase tracking-wide shadow-sm"
              >
                <Bell size={16} />
                Notify ({selectedAttempts.length})
              </button>
              <button
                onClick={() => setIsBulkUpdateModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-black text-white hover:bg-gray-800 transition-all font-medium text-xs uppercase tracking-wide shadow-sm"
              >
                <Edit3 size={16} />
                Bulk Edit
              </button>
            </div>
          </div>
        </div>

        {/* ── Desktop Table (JobPosting Style) ── */}
        <div className="hidden md:block bg-white rounded overflow-hidden border border-gray-200 mr-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#3AB000]">
                  <th className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedAttempts.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 accent-black cursor-pointer"
                    />
                  </th>
                  {[
                    "S.N",
                    "Candidate Name",
                    "App No.",
                    "Exam Title",
                    "MOU Start Date",
                    "MOU End Date",
                    "MOU Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap ${h === "Exam Title" ? "max-w-[200px]" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                    Notif. Status
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {!isLoading && attempts.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center py-12 text-gray-400 text-sm">
                      No candidates found.
                    </td>
                  </tr>
                ) : (
                  attempts.map((attempt, idx) => (
                    <tr
                      key={attempt._id}
                      className={`border-b border-gray-100 hover:bg-[#e8f5e2] transition-colors ${selectedAttempts.includes(attempt._id) ? "bg-[#f0f9eb]" : ""
                        }`}
                    >
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedAttempts.includes(attempt._id)}
                          onChange={() => toggleSelectRow(attempt._id)}
                          className="w-4 h-4 accent-[#3AB000] cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-4 text-center text-gray-700 font-medium">
                        {(currentPage - 1) * pagination.limit + idx + 1}
                      </td>
                      <td className="px-4 py-4 text-center text-[#2d8a00] font-semibold">
                        {attempt.applicationId?.candidateName}
                      </td>
                      <td className="px-4 py-4 text-center text-gray-700 whitespace-nowrap">
                        {attempt.applicationId?.applicationNumber}
                      </td>
                      <td className="px-4 py-4 text-center text-gray-700 font-medium max-w-[250px]">
                        <div className="line-clamp-2 text-xs leading-relaxed text-gray-500">
                          {attempt.testId?.title}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-gray-700 font-semibold whitespace-nowrap">
                        {attempt.testId?.mouStartDate || "-"}
                      </td>
                      <td className="px-4 py-4 text-center text-gray-700 font-semibold whitespace-nowrap">
                        {attempt.testId?.mouEndDate || "-"}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <StatusBadge status={attempt.mouStatus} />
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap border-r border-gray-100 last:border-0">
                        <div className="flex flex-col">
                          {attempt.notificationStatus === "Sent" ? (
                            <>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-green-50 text-green-700 border border-green-200 uppercase w-fit">
                                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Notified
                              </span>
                              {attempt.lastNotifiedAt && (
                                <span className="text-[8px] text-gray-400 mt-1 font-bold">
                                  {new Date(attempt.lastNotifiedAt).toLocaleDateString()}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-gray-50 text-gray-400 border border-gray-200 uppercase w-fit">
                              Pending
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedMOU(attempt);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-[#3AB000] hover:bg-[#3AB000]/10 rounded-lg transition-all"
                          title="Edit MOU Dates"
                        >
                          <Edit size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Mobile View (JobPosting Style Compatibility) ── */}
        <div className="md:hidden space-y-3 mt-4">
          {attempts.map((attempt, idx) => (
            <div key={attempt._id} className="bg-white rounded border border-gray-200 p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                    #{(currentPage - 1) * pagination.limit + idx + 1}
                  </div>
                  <div className="text-sm font-bold text-[#2d8a00]">{attempt.applicationId?.candidateName}</div>
                  <div className="text-xs text-gray-500">{attempt.applicationId?.applicationNumber}</div>
                </div>
                <StatusBadge status={attempt.mouStatus} />
              </div>
              <div className="space-y-1.5 py-3 border-y border-gray-50">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-medium">Exam:</span>
                  <span className="text-gray-700 font-bold">{attempt.testId?.title}</span>
                </div>
                <div className="flex justify-between text-[11px] mt-2 pt-2 border-t border-gray-50 uppercase tracking-tight">
                  <span className="text-gray-400 font-bold">MOU Period:</span>
                  <span className="text-gray-600 font-black">
                    {attempt.testId?.mouStartDate || "-"} to {attempt.testId?.mouEndDate || "-"}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedMOU(attempt);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-gray-400 hover:text-[#3AB000] bg-gray-50 rounded-lg transition-all"
                >
                  <Edit size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Pagination (JobPosting Style) ── */}
        {pagination.pages > 1 && (
          <div className="mt-8 flex justify-center sm:justify-end pr-0 md:pr-4 pb-8">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => loadMOUList(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-[#3AB000] disabled:opacity-50 text-white px-6 sm:px-10 py-2 sm:py-2.5 text-xs sm:text-sm font-medium hover:bg-[#2d8a00] transition-colors rounded-sm flex-1 sm:flex-none"
              >
                Back
              </button>

              <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
                {(() => {
                  const pages = [];
                  const total = pagination.pages;
                  const visible = new Set([
                    1,
                    2,
                    total - 1,
                    total,
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                  ]);
                  for (let i = 1; i <= total; i++) {
                    if (visible.has(i)) pages.push(i);
                    else if (pages[pages.length - 1] !== "...") pages.push("...");
                  }
                  return pages.map((page, idx) =>
                    page === "..." ? (
                      <span key={idx} className="px-1 text-gray-500 select-none">
                        ...
                      </span>
                    ) : (
                      <button
                        key={`${page}-${idx}`}
                        onClick={() => loadMOUList(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded text-sm transition-colors ${currentPage === page
                            ? "text-[#3AB000] font-bold"
                            : "text-gray-600 hover:text-[#3AB000]"
                          }`}
                      >
                        {page}
                      </button>
                    )
                  );
                })()}
              </div>

              <div className="sm:hidden text-sm font-medium text-gray-700 px-2 font-bold">
                {currentPage} / {pagination.pages}
              </div>

              <button
                onClick={() => loadMOUList(currentPage + 1)}
                disabled={currentPage === pagination.pages}
                className="bg-[#3AB000] disabled:opacity-50 text-white px-6 sm:px-10 py-2 sm:py-2.5 text-xs sm:text-sm font-medium hover:bg-[#2d8a00] transition-colors rounded-sm flex-1 sm:flex-none"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {/* Modal for Editing MOU */}
        <EditMOUModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMOU(null);
          }}
          data={selectedMOU}
          onUpdate={() => loadMOUList(currentPage)}
        />
        <BulkEditMOUModal
          isOpen={isBulkUpdateModalOpen}
          onClose={() => setIsBulkUpdateModalOpen(false)}
          selectedCount={isAllSelectedGlobally ? pagination.total : selectedAttempts.length}
          onSave={handleBulkUpdate}
        />
      </div>
      {/* ── Custom Confirmation Modal ── */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-none shadow-2xl border-t-4 border-[#248000] overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-wider">{confirmModal.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{confirmModal.message}</p>
            </div>
            <div className="flex border-t border-gray-100">
              <button 
                onClick={() => setConfirmModal(prev => ({ ...prev, open: false }))}
                className="flex-1 px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmModal.onConfirm}
                className="flex-1 px-6 py-4 text-sm font-bold text-white bg-[#248000] uppercase tracking-widest hover:bg-[#1a5e00] transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success Modal ── */}
      {successModal.open && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in zoom-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-none shadow-2xl border-b-8 border-[#248000] overflow-hidden text-center">
            <div className="bg-[#248000]/10 py-10">
              <div className="w-20 h-20 bg-[#248000] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#248000]/30">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-[#248000] uppercase tracking-tighter">Campaign Finished</h3>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Broadcast Successful</p>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 border-b-2 border-green-500">
                  <p className="text-2xl font-black text-gray-800">{successModal.sent}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sent</p>
                </div>
                <div className="bg-gray-50 p-4 border-b-2 border-red-500">
                  <p className="text-2xl font-black text-gray-800">{successModal.failed}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Failed</p>
                </div>
              </div>
              
              <button 
                onClick={() => setSuccessModal({ open: false, sent: 0, failed: 0 })}
                className="w-full py-4 bg-[#248000] text-white font-black uppercase tracking-widest hover:bg-[#1a5e00] transition-all active:scale-95 shadow-lg shadow-[#248000]/20"
              >
                Done / ठीक है
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Notification Selection Modal ── */}
      {isNotificationModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={() => setIsNotificationModalOpen(false)}
          />
          <div className="relative bg-white rounded-none shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-200">
            {/* Header with Theme Green */}
            <div className="p-5 flex items-center justify-between bg-[#248000] text-white rounded-none">
              <div className="flex items-center gap-3">
                <Bell size={22} className="text-white" />
                <div>
                  <h3 className="text-lg font-bold tracking-wide uppercase">Send Notifications</h3>
                  <p className="text-[10px] text-white/80 tracking-widest uppercase">To {isAllSelectedGlobally ? pagination.total : selectedAttempts.length} Candidates</p>
                </div>
              </div>
              <button 
                onClick={() => setIsNotificationModalOpen(false)}
                className="p-1 hover:bg-black/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 gap-3">
                {/* SMS Option - Sharp Design */}
                <div 
                  onClick={() => setNotifChannels(prev => ({ ...prev, sms: !prev.sms }))}
                  className={`flex items-center gap-4 p-4 rounded-none border transition-all cursor-pointer ${
                    notifChannels.sms 
                    ? "border-[#248000] bg-green-50/50" 
                    : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`p-2.5 rounded-none transition-colors ${notifChannels.sms ? "bg-[#248000] text-white" : "bg-gray-100 text-gray-500"}`}>
                    <MessageSquare size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-bold uppercase tracking-tight ${notifChannels.sms ? "text-[#248000]" : "text-gray-700"}`}>SMS Channel</h4>
                    <p className="text-[11px] text-gray-500 uppercase">Direct text alert</p>
                  </div>
                  <div className={`w-5 h-5 rounded-none border flex items-center justify-center ${notifChannels.sms ? "border-[#248000] bg-[#248000]" : "border-gray-300 bg-white"}`}>
                    {notifChannels.sms && <div className="w-1.5 h-1.5 bg-white rounded-none" />}
                  </div>
                </div>

                {/* Email Option - Sharp Design */}
                <div 
                  onClick={() => setNotifChannels(prev => ({ ...prev, email: !prev.email }))}
                  className={`flex items-center gap-4 p-4 rounded-none border transition-all cursor-pointer ${
                    notifChannels.email 
                    ? "border-[#248000] bg-green-50/50" 
                    : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`p-2.5 rounded-none transition-colors ${notifChannels.email ? "bg-[#248000] text-white" : "bg-gray-100 text-gray-500"}`}>
                    <Mail size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-bold uppercase tracking-tight ${notifChannels.email ? "text-[#248000]" : "text-gray-700"}`}>Email Channel</h4>
                    <p className="text-[11px] text-gray-500 uppercase">Candidate email alert</p>
                  </div>
                  <div className={`w-5 h-5 rounded-none border flex items-center justify-center ${notifChannels.email ? "border-[#248000] bg-[#248000]" : "border-gray-300 bg-white"}`}>
                    {notifChannels.email && <div className="w-1.5 h-1.5 bg-white rounded-none" />}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSendNotifications}
                  disabled={!notifChannels.sms && !notifChannels.email || isUpdating}
                  className="w-full py-4 bg-[#248000] text-white rounded-none font-bold text-sm tracking-[2px] uppercase hover:bg-[#1a5e00] transition-all disabled:opacity-50 active:scale-[0.99]"
                >
                  {isUpdating ? "Broadcasting..." : "Broadcast Now"}
                </button>
                <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-medium">
                  Notifications will be sent instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      )}


    </DashboardLayout>
  );
}
