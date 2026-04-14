import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { createPaperAPI } from "../../utils/api";
import { UserPlus, Search, ShieldAlert } from "lucide-react";

// Same UI constants as ReExam
const StatusBadge = ({ status }) => {
  if (status === "Unassigned")
    return (
      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
        Unassigned
      </span>
    );
  return (
    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
      {status}
    </span>
  );
};

const TableSkeleton = () => (
  <tbody>
    {Array.from({ length: 5 }).map((_, i) => (
      <tr key={i} className="animate-pulse border-b border-gray-100">
        <td className="p-4">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
        </td>
        <td className="p-4">
          <div className="w-8 h-4 bg-gray-200 rounded mx-auto"></div>
        </td>
        <td className="p-4 space-y-2">
          <div className="w-32 h-4 bg-gray-200 rounded"></div>
          <div className="w-48 h-3 bg-gray-200 rounded"></div>
          <div className="w-24 h-3 bg-gray-200 rounded"></div>
        </td>
        <td className="p-4 text-center">
          <div className="w-24 h-4 bg-gray-200 rounded mx-auto"></div>
        </td>
        <td className="p-4 text-center">
          <div className="w-20 h-4 bg-gray-200 rounded mx-auto"></div>
        </td>
      </tr>
    ))}
  </tbody>
);

const Unassigned = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 10 });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const loadUnassigned = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await createPaperAPI.getGlobalUnassigned({
        page,
        limit: 10,
        search: searchQuery,
        appliedFrom,
        appliedTo,
      });
      if (res.success) {
        setStudents(
          (res.data.students || []).map((s) => ({
            ...s,
            status: "Unassigned",
          }))
        );
        setPagination(res.data.pagination);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadUnassigned(1);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, appliedFrom, appliedTo]);

  const toggleSelectAll = () => {
    if (selectedStudentIds.length === students.length && students.length > 0) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(students.map((s) => s._id));
    }
  };

  const toggleStudentSelection = (id) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handlePlanAssignment = () => {
    if (selectedStudentIds.length === 0) {
      alert("Please select at least one candidate to assign.");
      return;
    }
    if (
      !window.confirm(
        `Create a new Event for these ${selectedStudentIds.length} selected candidate(s)? You will be taken to the 'Create Paper' section to finalize it.`
      )
    )
      return;

    setIsActionLoading(true);
    try {
      navigate("/create-paper", {
        state: {
          reExamData: {
            title: `New Assignment Event`,
            assignedStudents: selectedStudentIds,
            status: "draft",
          },
        },
      });
    } catch {
      alert("Failed to plan assignment.");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white ml-0 p-0 md:ml-6 px-2 md:px-0 pb-10">
        <div className="pt-4 md:pt-6">
          {/* Top Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
              {/* Left side (Title) */}
              <h1 className="text-base sm:text-lg font-bold text-gray-800 hidden lg:block">
                Unassigned Candidates
              </h1>

              {/* Right side (Tabs / Filter) */}
              {/* <div className="flex justify-end w-full sm:w-auto">
                <div className="gap-0 border border-gray-300 rounded overflow-hidden flex w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap bg-[#3AB000] text-white">
                    Global Unassigned
                  </button>
                </div>
              </div> */}
            </div>
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 w-full">
              {/* Search */}
              <div className="flex items-center border border-gray-300 rounded overflow-hidden h-10 flex-1 w-full sm:max-w-[400px]">
                <input
                  type="text"
                  placeholder="Search students..."
                  className="flex-1 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 focus:outline-none h-full bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="bg-[#3AB000] hover:bg-[#2d8a00] text-white text-xs sm:text-sm px-4 h-full font-medium transition-colors whitespace-nowrap">
                  Search
                </button>
              </div>
            </div>

            <button
              onClick={handlePlanAssignment}
              disabled={isActionLoading || selectedStudentIds.length === 0}
              className="bg-black hover:bg-[#3AB000] disabled:opacity-50 text-white text-xs sm:text-sm font-medium px-4 sm:px-6 py-2.5 rounded-sm transition-colors whitespace-nowrap w-full sm:w-auto flex items-center justify-center gap-1.5"
            >
              <UserPlus size={14} />
              Assign Selected ({selectedStudentIds.length})
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Applied From
              </label>
              <input
                type="date"
                value={appliedFrom}
                onChange={(e) => setAppliedFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-[#3AB000] focus:border-[#3AB000] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Applied To
              </label>
              <input
                type="date"
                value={appliedTo}
                onChange={(e) => setAppliedTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-[#3AB000] focus:border-[#3AB000] outline-none transition-all"
              />
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="bg-[#3AB000]">
                    <th className="px-4 py-3 text-center font-bold text-black text-sm w-12">
                      <input
                        type="checkbox"
                        checked={
                          students.length > 0 &&
                          selectedStudentIds.length === students.length
                        }
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 accent-black"
                      />
                    </th>
                    <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                      S.N
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-black text-sm whitespace-nowrap">
                      Candidate Details
                    </th>
                    <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                      Applied Date
                    </th>
                    <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                      Status
                    </th>
                  </tr>
                </thead>

                {isLoading ? (
                  <TableSkeleton />
                ) : students.length === 0 ? (
                  <tbody>
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                        No unassigned candidates found.
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {students.map((student, idx) => (
                      <tr
                        key={student._id}
                        className="border-b border-gray-100 hover:bg-[#e8f5e2] transition-colors"
                      >
                        <td className="px-4 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedStudentIds.includes(student._id)}
                            onChange={() => toggleStudentSelection(student._id)}
                            className="w-4 h-4 rounded border-gray-300 accent-[#3AB000]"
                          />
                        </td>
                        <td className="px-4 py-4 text-center text-gray-700">
                          {(currentPage - 1) * pagination.limit + idx + 1}
                        </td>
                        <td className="px-4 py-4 text-left">
                          <p className="text-sm font-semibold text-[#2d8a00]">
                            {student.candidateName}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {student.applicationNumber} · {student.district}
                          </p>
                          <p className="text-xs text-gray-400">
                            {student.mobile} · {student.email}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-center text-gray-600 font-medium">
                          {student.createdAt ? new Date(student.createdAt).toLocaleDateString("en-GB") : "-"}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <StatusBadge status={student.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded border border-gray-200 p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              ))
            ) : students.length === 0 ? (
              <div className="bg-white rounded border border-gray-200 p-8 text-center text-gray-400 text-sm">
                No unassigned candidates found.
              </div>
            ) : (
              students.map((student, idx) => (
                <div key={student._id} className="bg-white rounded border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(student._id)}
                        onChange={() => toggleStudentSelection(student._id)}
                        className="w-4 h-4 rounded border-gray-300 accent-[#3AB000] flex-shrink-0"
                      />
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">
                          S.N: {(currentPage - 1) * pagination.limit + idx + 1}
                        </div>
                        <div className="text-sm font-semibold text-[#2d8a00]">
                          {student.candidateName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {student.applicationNumber} · {student.district}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Applied: {student.createdAt ? new Date(student.createdAt).toLocaleDateString("en-GB") : "-"}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={student.status} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!isLoading && pagination.pages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between sm:justify-end items-center gap-3 mt-6">
              <div className="text-xs text-gray-500 sm:hidden">
                Showing {(currentPage - 1) * pagination.limit + 1}–
                {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total}
              </div>
              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center">
                <button
                  onClick={() => loadUnassigned(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  className="bg-[#3AB000] disabled:opacity-50 text-white px-6 sm:px-10 py-2 sm:py-2.5 text-xs sm:text-sm font-medium hover:bg-[#2d8a00] transition-colors rounded-sm flex-1 sm:flex-none"
                >
                  Back
                </button>
                <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
                  {(() => {
                    const pages = [];
                    const visible = new Set([
                      1, 2, pagination.pages - 1, pagination.pages,
                      currentPage - 1, currentPage, currentPage + 1
                    ]);
                    for (let i = 1; i <= pagination.pages; i++) {
                      if (visible.has(i)) pages.push(i);
                      else if (pages[pages.length - 1] !== "...") pages.push("...");
                    }
                    return pages.map((page, i) =>
                      page === "..." ? (
                        <span key={i} className="px-1 text-gray-500 select-none">...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => loadUnassigned(page)}
                          className={`w-7 h-7 flex items-center justify-center rounded text-sm transition-colors ${currentPage === page ? "text-[#3AB000] font-bold" : "text-gray-600 hover:text-[#3AB000]"
                            }`}
                        >
                          {page}
                        </button>
                      )
                    );
                  })()}
                </div>
                <div className="sm:hidden text-sm font-medium text-gray-700 px-2">
                  {currentPage}
                </div>
                <button
                  onClick={() => loadUnassigned(currentPage + 1)}
                  disabled={currentPage === pagination.pages || isLoading}
                  className="bg-[#3AB000] disabled:opacity-50 text-white px-6 sm:px-10 py-2 sm:py-2.5 text-xs sm:text-sm font-medium hover:bg-[#2d8a00] transition-colors rounded-sm flex-1 sm:flex-none"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Unassigned;
