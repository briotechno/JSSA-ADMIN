import React, { useState, useEffect, useRef, useMemo } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { employeesAPI, jobPostingsAPI } from "../../utils/api";
import { UserPlus, Search, ShieldAlert, ChevronDown, Check, X, RefreshCw, Mail, Phone, Calendar, User, Trash2 } from "lucide-react";

/**
 * Manual Employee List Page
 * Displays a table of manually created employees and allows adding new ones.
 */
const ManualEmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [postings, setPostings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPostDropdownOpen, setIsPostDropdownOpen] = useState(false);
  const [postSearch, setPostSearch] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    dob: "",
    jobPostingId: "",
    email: "",
    mobile: "",
  });

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await employeesAPI.getAll();
      if (res.success) {
        setEmployees(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPostings = async () => {
    try {
      const res = await jobPostingsAPI.getAll();
      if (res.success) {
        setPostings(res.data.postings || []);
      }
    } catch (err) {
      console.error("Failed to fetch job postings:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchPostings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.jobPostingId) {
      alert("Please select a Job Post.");
      return;
    }
    
    // 18+ Validation
    const birthDate = new Date(formData.dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    const month = new Date().getMonth() - birthDate.getMonth();
    if (age < 18 || (age === 18 && month < 0)) {
      alert("Employee must be at least 18 years old.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await employeesAPI.create(formData);
      if (res.success) {
        alert("Employee created successfully!");
        setIsModalOpen(false);
        setFormData({ name: "", fatherName: "", dob: "", jobPostingId: "", email: "", mobile: "" });
        fetchEmployees();
      } else {
        alert(res.error || "Failed to create employee.");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee? This action cannot be undone and will delete their login access as well.")) {
      return;
    }
    try {
      setIsLoading(true);
      const res = await employeesAPI.delete(id);
      if (res.success) {
        alert("Employee deleted successfully!");
        fetchEmployees();
      } else {
        alert(res.error || "Failed to delete employee.");
        setIsLoading(false);
      }
    } catch (err) {
      alert("An error occurred while deleting.");
      setIsLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const email = emp.userId?.email || "";
    const mobile = emp.userId?.phone || "";
    return (
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mobile.includes(searchQuery)
    );
  });

  return (
    <DashboardLayout activePath="/employee-management">
      <div className="min-h-screen bg-white p-0 md:ml-6 px-2 md:px-0 pb-10">
        <div className="pt-4 md:pt-6">
          {/* Header & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <h1 className="text-xl font-bold text-gray-800">Manual Employee Management</h1>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center border border-gray-300 rounded overflow-hidden h-10 w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="flex-1 px-4 text-sm outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="bg-[#3AB000] p-2.5 text-white">
                  <Search size={18} />
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#3AB000] hover:bg-[#2d8a00] text-white px-6 py-2 rounded shadow-sm font-bold flex items-center justify-center gap-2 transition-colors h-10 uppercase text-xs tracking-wider"
              >
                <UserPlus size={18} /> Add Employee
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-[#3AB000] text-white font-black uppercase text-xs tracking-widest">
                    <th className="p-4 w-16 text-center">S.N</th>
                    <th className="p-4">Employee Details</th>
                    <th className="p-4">Father Name</th>
                    <th className="p-4">Job Post</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="p-4" colSpan={5}><div className="h-10 bg-gray-100 rounded"></div></td>
                      </tr>
                    ))
                  ) : filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-gray-400 italic">No employees found.</td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp, idx) => (
                      <tr key={emp._id} className="hover:bg-[#f0f9eb] transition-colors group">
                        <td className="p-4 text-center font-bold text-gray-500">{idx + 1}</td>
                        <td className="p-4">
                          <div className="font-bold text-[#3AB000] text-base">{emp.name}</div>
                          <div className="flex flex-col gap-0.5 mt-1">
                            <div className="flex items-center gap-2 text-gray-500 text-xs">
                              <Mail size={12} /> {emp.userId?.email || "N/A"}
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-xs">
                              <Phone size={12} /> {emp.userId?.phone || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-700 font-medium">{emp.fatherName}</td>
                        <td className="p-4">
                          <div className="text-gray-800 font-bold">{emp.jobPostingId?.title || "N/A"}</div>
                          <div className="text-gray-400 text-xs">{typeof emp.jobPostingId?.post === 'object' ? emp.jobPostingId.post.en : emp.jobPostingId?.post}</div>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${emp.onboardingComplete ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {emp.onboardingComplete ? "Active" : "Onboarding"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDelete(emp._id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Delete Employee"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl animate-in zoom-in-95 duration-200">
            <div className="bg-[#3AB000] p-4 flex justify-between items-center">
              <h2 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
                <UserPlus size={18} /> Add New Employee
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" required
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded text-sm focus:border-[#3AB000] focus:ring-1 focus:ring-[#3AB000] outline-none transition-all"
                      placeholder="Enter name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Father's Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" required
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded text-sm focus:border-[#3AB000] focus:ring-1 focus:ring-[#3AB000] outline-none transition-all"
                      placeholder="Father's name"
                      value={formData.fatherName}
                      onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Date of Birth</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="date" required
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded text-sm focus:border-[#3AB000] focus:ring-1 focus:ring-[#3AB000] outline-none transition-all"
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1.5 relative">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Job Post</label>
                  <div 
                    onClick={() => setIsPostDropdownOpen(!isPostDropdownOpen)}
                    className="w-full pl-3 pr-9 py-2 border border-gray-200 rounded text-sm focus:border-[#3AB000] focus:ring-1 focus:ring-[#3AB000] cursor-pointer bg-white transition-all min-h-[40px] flex items-center justify-between"
                  >
                    <span className={`line-clamp-1 ${!formData.jobPostingId ? "text-gray-400" : "text-gray-700 font-medium"}`}>
                      {postings.find(p => p._id === formData.jobPostingId)?.title || "Select Job Post"}
                    </span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${isPostDropdownOpen ? "rotate-180" : ""}`} />
                  </div>

                  {isPostDropdownOpen && (
                    <div className="absolute z-[1000] left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-2xl max-h-80 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-3 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                        <Search size={16} className="text-gray-400 shrink-0" />
                        <input 
                          type="text"
                          placeholder="Search post by name or advertisement no..."
                          className="w-full bg-transparent border-none outline-none text-sm font-medium"
                          value={postSearch}
                          onChange={(e) => setPostSearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="overflow-y-auto custom-scrollbar divide-y divide-gray-50">
                        {postings
                          .filter(p => {
                            const title = p.title?.toLowerCase() || "";
                            const search = postSearch.toLowerCase();
                            return title.includes(search);
                          })
                          .sort((a, b) => {
                            const isVacancyOpen = (lastDate) => {
                              if (!lastDate) return true;
                              return new Date(lastDate) >= new Date();
                            };
                            const aActive = a.status !== "Inactive" && isVacancyOpen(a.lastDate);
                            const bActive = b.status !== "Inactive" && isVacancyOpen(b.lastDate);
                            return (aActive === bActive) ? 0 : aActive ? -1 : 1;
                          })
                          .map(p => {
                            const isVacancyOpen = (lastDate) => {
                              if (!lastDate) return true;
                              return new Date(lastDate) >= new Date();
                            };
                            const isActive = p.status !== "Inactive" && isVacancyOpen(p.lastDate);

                            return (
                              <div 
                                key={p._id}
                                onClick={() => {
                                  setFormData({...formData, jobPostingId: p._id});
                                  setIsPostDropdownOpen(false);
                                }}
                                className={`p-4 text-sm cursor-pointer hover:bg-[#e8f5e2] transition-all flex items-center justify-between gap-4 ${formData.jobPostingId === p._id ? "bg-[#e8f5e2] text-[#3AB000]" : "text-gray-700"}`}
                              >
                                <div className="flex-1 min-w-0">
                                  <p className={`font-bold leading-tight ${formData.jobPostingId === p._id ? "text-[#3AB000]" : "text-gray-800"}`}>
                                    {p.title}
                                  </p>
                                  <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">
                                    {typeof p.post === 'object' ? p.post.en : p.post}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {isActive ? "ACTIVE" : "INACTIVE"}
                                  </span>
                                  {formData.jobPostingId === p._id && <Check size={16} className="text-[#3AB000]" />}
                                </div>
                              </div>
                            );
                          })}
                        {postings.length === 0 && (
                          <div className="p-8 text-center text-gray-400 text-sm italic flex flex-col items-center gap-2">
                            <RefreshCw className="animate-spin text-gray-200" size={24} />
                            Loading postings...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email ID</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="email" required
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded text-sm focus:border-[#3AB000] focus:ring-1 focus:ring-[#3AB000] outline-none transition-all"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mobile Number</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="tel" required pattern="[0-9]{10}"
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded text-sm focus:border-[#3AB000] focus:ring-1 focus:ring-[#3AB000] outline-none transition-all"
                      placeholder="10-digit number"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded font-bold text-xs uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-[#3AB000] hover:bg-[#2d8a00] text-white rounded font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <RefreshCw className="animate-spin" size={16} /> : <UserPlus size={16} />}
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManualEmployeeList;
