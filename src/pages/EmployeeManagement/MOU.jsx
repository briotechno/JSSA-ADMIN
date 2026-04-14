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
} from "lucide-react";

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

export default function MOU() {
  const [attempts, setAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [mouFrom, setMouFrom] = useState("");
  const [mouTo, setMouTo] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedMOU, setSelectedMOU] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    limit: 10,
  });

  const tabs = [
    { id: "all", label: "All" },
    { id: "pass", label: "Pass" },
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
        limit: 10,
        search: searchQuery,
        status: activeTab,
        mouFrom,
        mouTo,
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

  useEffect(() => {
    loadMOUList(1);
  }, [activeTab, mouFrom, mouTo]);

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

  return (
    <DashboardLayout>
      {(isLoading || isUpdating) && <LoadingOverlay message={isUpdating ? "Updating..." : "Loading..."} />}

      <div className="p-0 ml-0 md:ml-6 px-2 md:px-0 mt-4 h-full">
        {/* ── Top Bar (JobPosting Style) ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 pr-0 md:pr-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 w-full">
            {/* Tab Group */}
            <div className="flex items-center gap-0 border border-gray-300 rounded overflow-hidden flex-shrink-0 w-full sm:w-auto shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium border-r border-gray-300 last:border-r-0 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-[#3AB000] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Group */}
            <div className="flex items-center border border-gray-300 rounded overflow-hidden h-10 flex-1 w-full sm:max-w-[500px] shadow-sm">
              <input
                type="text"
                placeholder="Search Candidate, Application No..."
                className="flex-1 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 focus:outline-none h-full bg-white"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                onKeyDown={(e) => e.key === "Enter" && loadMOUList(1)}
              />
              <button 
                onClick={() => loadMOUList(1)}
                className="bg-[#3AB000] hover:bg-[#2d8a00] text-white text-xs sm:text-sm px-4 sm:px-6 h-full font-medium transition-colors whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </div>
          
          {/* Date Filter Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded px-2 h-10 shadow-sm">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">MOU Start</span>
                <input
                  type="date"
                  value={mouFrom}
                  onChange={(e) => setMouFrom(e.target.value)}
                  className="px-1 py-1 text-xs focus:outline-none bg-transparent"
                />
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded px-2 h-10 shadow-sm">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">MOU End</span>
                <input
                  type="date"
                  value={mouTo}
                  onChange={(e) => setMouTo(e.target.value)}
                  className="px-1 py-1 text-xs focus:outline-none bg-transparent"
                />
            </div>
          </div>
        </div>

        {/* ── Desktop Table (JobPosting Style) ── */}
        <div className="hidden md:block bg-white rounded overflow-hidden border border-gray-200 mr-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#3AB000]">
                  {[
                    "S.N",
                    "Candidate Name",
                    "App No.",
                    "Exam Title",
                    "MOU Start Date",
                    "MOU End Date",
                    "MOU Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap ${h === "Exam Title" ? "max-w-[200px]" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!isLoading && attempts.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-12 text-gray-400 text-sm">
                       No candidates found.
                    </td>
                  </tr>
                ) : (
                  attempts.map((attempt, idx) => (
                    <tr
                      key={attempt._id}
                      className="border-b border-gray-100 hover:bg-[#e8f5e2] transition-colors"
                    >
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
                      <td className="px-4 py-4 text-center">
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
                        key={page}
                        onClick={() => loadMOUList(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded text-sm transition-colors ${
                          currentPage === page
                            ? "text-[#3AB000] font-bold"
                            : "text-gray-600 hover:text-[#3AB000]"
                        }`}
                      >
                        {page}
                      </button>
                    ),
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
     </div>
    </DashboardLayout>
  );
}
