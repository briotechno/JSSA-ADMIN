import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { claimsAPI } from "../../utils/api";
import { 
  Send, 
  History, 
  FileUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Plus,
  Loader2,
  FileText,
  MessageSquare,
  ChevronRight,
  ShieldAlert
} from "lucide-react";

const Claims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await claimsAPI.getMyClaims();
      if (res.success) {
        setClaims(res.data);
      }
    } catch (err) {
      alert("Failed to load your claims");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !file) {
      alert("Please fill all fields and upload evidence");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("evidence", file);

      const res = await claimsAPI.submit(formData);
      if (res.success) {
        alert("Claim submitted successfully");
        setShowForm(false);
        setTitle("");
        setDescription("");
        setFile(null);
        fetchClaims();
      }
    } catch (err) {
      alert(err.message || "Failed to submit claim");
    } finally {
      setSubmitting(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      pending: "bg-amber-50 text-amber-600 border-amber-100",
      approved: "bg-green-50 text-green-600 border-green-100",
      rejected: "bg-red-50 text-red-600 border-red-100"
    };
    const labels = { pending: "Pending", approved: "Authorized", rejected: "Terminated" };
    
    return (
      <span className={`px-3 py-1 border text-[11px] font-black uppercase tracking-widest ${styles[status] || "bg-gray-50 text-gray-400 border-gray-100"}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-0 ml-0 md:ml-6 px-2 md:px-0 mt-4 space-y-6 h-full mr-4">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-white border border-[#3AB000]/20 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#3AB000]/10 flex items-center justify-center">
               <History className="text-[#3AB000]" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 uppercase tracking-tighter leading-none">Service Claims</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Track benefit requests</p>
            </div>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-6 py-2.5 transition-all text-[11px] font-black uppercase tracking-widest shadow-md ${
                showForm ? "bg-black text-white" : "bg-[#3AB000] text-white hover:bg-[#2d8a00]"
            }`}
          >
            {showForm ? <XCircle size={16} /> : <Plus size={16} />}
            {showForm ? "Cancel" : "New Request"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-[#3AB000]/30 p-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300">
             <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                <FileUp className="text-[#3AB000]" size={18} />
                New Submission
             </h2>
             
             <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Title</label>
                      <input 
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Claim subject..."
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#3AB000] outline-none transition-all font-bold text-gray-800 text-sm"
                        required
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Evidence</label>
                      <input 
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="hidden"
                        id="evidence-upload"
                        required
                      />
                      <label 
                        htmlFor="evidence-upload"
                        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 cursor-pointer hover:border-[#3AB000] transition-all group"
                      >
                         <span className={`font-bold text-xs truncate pr-4 ${file ? "text-[#3AB000]" : "text-gray-400"}`}>
                            {file ? file.name : "Select file..."}
                         </span>
                         <FileUp size={16} className="text-[#3AB000]" />
                      </label>
                   </div>
                </div>

                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                   <textarea 
                     rows="3"
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     placeholder="Provide details..."
                     className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#3AB000] outline-none transition-all font-bold text-gray-800 text-sm"
                     required
                   />
                </div>

                <div className="flex justify-end pt-2">
                   <button 
                     type="submit"
                     disabled={submitting}
                     className="px-10 py-3 bg-[#0A3D00] text-white text-[11px] font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all"
                   >
                     {submitting ? <Loader2 className="animate-spin" size={16} /> : "Submit Claim"}
                   </button>
                </div>
             </form>
          </div>
        )}

        {/* List View - Compact Redesign */}
        <div className="space-y-3">
           <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Activity Feed</span>
              <div className="h-px bg-gray-200 flex-1" />
           </div>

           {loading ? (
             <div className="py-12 flex flex-col items-center justify-center gap-3 bg-white border border-gray-200">
                <Loader2 className="animate-spin text-[#3AB000]" size={24} />
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Loading...</p>
             </div>
           ) : claims.length === 0 ? (
             <div className="py-12 bg-white border border-dashed border-gray-200 text-center">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No claims found</p>
             </div>
           ) : (
             <div className="flex flex-col gap-3">
                {claims.map((claim) => (
                  <div key={claim._id} className="bg-white border border-[#3AB000]/20 hover:border-[#3AB000]/60 transition-all shadow-sm overflow-hidden">
                     <div className="p-5 flex flex-col lg:flex-row items-stretch lg:items-center gap-6">
                        
                        {/* 1. Status & Basic Info */}
                        <div className="flex flex-col gap-3 min-w-[150px] border-b lg:border-b-0 lg:border-r border-gray-100 pb-4 lg:pb-0 lg:pr-6">
                           <StatusBadge status={claim.status} />
                           <div className="space-y-1.5">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">REF: {claim._id.slice(-8).toUpperCase()}</p>
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">DATE: {new Date(claim.createdAt).toLocaleDateString('en-GB')}</p>
                           </div>
                        </div>

                        {/* 2. Main Content (Center) */}
                        <div className="flex-1 min-w-0 space-y-4">
                           <div>
                              <h4 className="text-[18px] font-black text-gray-900 uppercase tracking-tight truncate group-hover:text-[#3AB000] transition-colors">{claim.title}</h4>
                              <p className="text-[13px] font-bold text-gray-500 leading-relaxed line-clamp-1">{claim.description}</p>
                           </div>

                           {claim.adminRemark && (
                              <div className="bg-[#3AB000]/5 border-l-2 border-[#3AB000] px-4 py-3 animate-in fade-in duration-500">
                                 <div className="flex items-center gap-2 mb-1.5">
                                    <MessageSquare size={14} className="text-[#3AB000]" />
                                    <span className="text-[10px] font-black text-[#3AB000] uppercase tracking-widest">Administrator Feedback</span>
                                 </div>
                                 <p className="text-[13px] font-bold text-gray-800 italic leading-tight">"{claim.adminRemark}"</p>
                              </div>
                           )}
                        </div>

                        {/* 3. Action (Right) */}
                        <div className="flex items-center justify-end lg:pl-6 lg:border-l border-gray-100 min-w-[150px]">
                           <a 
                             href={claim.evidence}
                             target="_blank"
                             rel="noreferrer"
                             className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#0A3D00] text-white text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-md group/btn"
                           >
                              <FileText size={16} />
                              Evidence
                           </a>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Claims;
