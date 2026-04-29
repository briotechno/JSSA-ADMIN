import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { employeesAPI, locationAPI } from "../../utils/api";
import statesData from "../../data/states.json";
import districtsData from "../../data/district.json";
import {
   ShieldCheck,
   MapPin,
   Lock,
   Eye,
   Loader2,
   ChevronRight,
   CheckCircle2,
   AlertCircle,
   Users
} from "lucide-react";
import { toast } from "react-hot-toast";

const WorkingZone = () => {
   const [profile, setProfile] = useState(null);
   const [loading, setLoading] = useState(true);
   const [submitting, setSubmitting] = useState(false);

   // Selection State
   const [designation, setDesignation] = useState("");
   const [state, setState] = useState("Bihar"); // Default for JSSA
   const [district, setDistrict] = useState("");
   const [block, setBlock] = useState("");
   const [panchayat, setPanchayat] = useState("");

   const [statesList] = useState(statesData);
   const [districts, setDistricts] = useState([]);
   const [blocks, setBlocks] = useState([]);
   const [panchayats, setPanchayats] = useState([]);

   // Preview Data
   const [previewBlocks, setPreviewBlocks] = useState([]);
   const [previewPanchayats, setPreviewPanchayats] = useState([]);

   useEffect(() => {
      fetchProfile();
   }, []);

   useEffect(() => {
      if (state) {
         setDistricts(districtsData[state] || []);
      } else {
         setDistricts([]);
      }
   }, [state]);

   const fetchProfile = async () => {
      try {
         const res = await employeesAPI.getProfile();
         if (res.success) {
            setProfile(res.data);
            setDesignation(res.data.jobPostingId?.post?.en || "");
            if (res.data.isZoneLocked) {
               const s = res.data.workingState;
               const d = res.data.workingDistrict;
               const b = res.data.workingBlock?._id || res.data.workingBlock;
               const p = res.data.workingPanchayat?._id || res.data.workingPanchayat;

               setState(s);
               setDistrict(d);
               setBlock(b);
               setPanchayat(p);

               // Auto-fetch preview data for locked zone with explicit parameters
               if (d) fetchBlocks(d, s);
               if (b) fetchPanchayats(b, s, d);
            }
         }
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   // Helper to get English Name from "English / Hindi" format
   const getCleanName = (name) => {
      if (!name) return "";
      return name.split(" / ")[0].trim();
   };

   useEffect(() => {
      if (district) {
         fetchBlocks(district);
      } else {
         setBlocks([]);
      }
   }, [district]);

   const fetchBlocks = async (dist, st = state) => {
      try {
         const res = await locationAPI.getBlocks({ state: st, district: dist });
         setBlocks(res.data || []);
         setPreviewBlocks(res.data || []);
      } catch (err) {
         console.error(err);
      }
   };

   useEffect(() => {
      if (block) {
         fetchPanchayats(block);
      } else {
         setPanchayats([]);
         setPanchayat("");
         setPreviewPanchayats([]);
      }
   }, [block]);

   const fetchPanchayats = async (blockId, st = state, dist = district) => {
      try {
         const res = await locationAPI.getPanchayats({ blockId, state: st, district: dist, all: true });
         setPanchayats(res);
         setPreviewPanchayats(res);
      } catch (err) {
         console.error(err);
      }
   };

   const handleLockZone = async () => {
      if (!district) return toast.error("Please select a District");
      if (designation.includes("Block Supervisor") && !block) return toast.error("Please select a Block");
      if (designation.includes("Panchayat Executive") && (!block || !panchayat)) return toast.error("Please select a Panchayat");

      if (!window.confirm("Are you sure? Once locked, your Working Zone cannot be changed without Admin permission.")) return;

      try {
         setSubmitting(true);
         const res = await employeesAPI.lockZone({
            workingState: state,
            workingDistrict: district,
            workingBlock: block || null,
            workingPanchayat: panchayat || null
         });

         if (res.success) {
            toast.success("Working Zone Locked Successfully!");
            // Manually update profile state with all details for immediate UI feedback
            setProfile(prev => ({
               ...prev,
               isZoneLocked: true,
               workingState: state,
               workingDistrict: district,
               workingBlock: block,
               workingPanchayat: panchayat
            }));
            fetchProfile(); // Background refresh
         } else {
            toast.error(res.error || "Failed to lock zone");
         }
      } catch (err) {
         toast.error("An error occurred");
      } finally {
         setSubmitting(false);
      }
   };

   if (loading) {
      return (
         <DashboardLayout>
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
               <Loader2 className="w-10 h-10 animate-spin text-[#3AB000]" />
               <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Loading Zone Data...</p>
            </div>
         </DashboardLayout>
      );
   }

   const isDM = designation.includes("District Manager");
   const isBS = designation.includes("Block Supervisor");
   const isPE = designation.includes("Panchayat Executive");

   // Get current active zone name based on designation
   const getCurrentZoneName = () => {
      if (isDM) return district;
      if (isBS) return blocks.find(b => b._id === block)?.name;
      if (isPE) return panchayats.find(p => p._id === panchayat)?.name;
      return "";
   };

   const activeZoneName = getCurrentZoneName();

   return (
      <DashboardLayout>
         <div className="p-6 space-y-6 w-full">

            {/* Step Indicator */}
            <div className="flex items-center justify-between bg-white p-4 shadow-sm border border-gray-100 rounded-lg overflow-x-auto">
               {[
                  { n: 1, l: "State", active: !!state },
                  { n: 2, l: "District", active: !!district },
                  { n: 3, l: "Block", active: !!block || isDM },
                  { n: 4, l: "Panchayat", active: !!panchayat || isDM || isBS }
               ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 min-w-fit px-4">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-all ${s.active ? 'bg-[#3AB000] text-white shadow-lg shadow-[#3AB000]/30' : 'bg-gray-100 text-gray-400'}`}>
                        {s.n}
                     </div>
                     <span className={`text-[11px] font-black uppercase tracking-widest ${s.active ? 'text-[#0A3D00]' : 'text-gray-300'}`}>
                        {s.l}
                     </span>
                     {i < 3 && <div className={`h-[2px] w-8 md:w-16 mx-2 ${s.active ? 'bg-[#3AB000]' : 'bg-gray-100'}`} />}
                  </div>
               ))}
            </div>

            {/* Header */}
            <div className="bg-white border-b-4 border-[#3AB000] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-t-xl">
               <div>
                  <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                     <MapPin className="text-[#3AB000]" size={28} />
                     Working Zone Selection
                  </h1>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Official Territory Assignment</p>
               </div>
               <div className="flex items-center gap-3 bg-[#3AB000]/5 px-4 py-2 border border-[#3AB000]/20">
                  <ShieldCheck className="text-[#3AB000]" size={20} />
                  <div className="text-right">
                     <p className="text-[10px] font-black text-gray-400 uppercase leading-none">Designation</p>
                     <p className="text-[13px] font-black text-[#0A3D00] uppercase">{designation || "Employee"}</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

               {/* Selection Form */}
               <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white border border-gray-200 p-6 shadow-md relative">
                     {profile?.isZoneLocked && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center p-6 text-center">
                           <div className="bg-white border-2 border-[#3AB000] p-6 shadow-2xl rounded-2xl max-w-sm w-full animate-in zoom-in-95 duration-300">
                              <div className="w-16 h-16 bg-[#3AB000]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                 <CheckCircle2 className="text-[#3AB000]" size={40} />
                              </div>
                              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Zone Locked</h3>
                              <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-widest mb-6">Territory Officially Assigned</p>

                              <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-left border border-gray-100">
                                 <div className="flex justify-between items-center border-b border-gray-200/50 pb-2">
                                    <span className="text-[9px] font-black text-gray-400 uppercase">State</span>
                                    <span className="text-[11px] font-black text-gray-900 uppercase">{profile?.workingState}</span>
                                 </div>
                                 <div className="flex justify-between items-center border-b border-gray-200/50 pb-2">
                                    <span className="text-[9px] font-black text-gray-400 uppercase">District</span>
                                    <span className="text-[11px] font-black text-gray-900 uppercase">{profile?.workingDistrict}</span>
                                 </div>
                                 {profile?.workingBlock && (
                                    <div className="flex justify-between items-center border-b border-gray-200/50 pb-2">
                                       <span className="text-[9px] font-black text-gray-400 uppercase">Block</span>
                                       <span className="text-[11px] font-black text-gray-900 uppercase">{profile?.workingBlock?.name || blocks.find(b => b._id === (profile?.workingBlock?._id || profile?.workingBlock))?.name || "Loading..."}</span>
                                    </div>
                                 )}
                                 {profile?.workingPanchayat && (
                                    <div className="flex justify-between items-center">
                                       <span className="text-[9px] font-black text-gray-400 uppercase">Panchayat</span>
                                       <span className="text-[11px] font-black text-[#3AB000] uppercase">{profile?.workingPanchayat?.name || panchayats.find(p => p._id === (profile?.workingPanchayat?._id || profile?.workingPanchayat))?.name || "Loading..."}</span>
                                    </div>
                                 )}
                              </div>

                              <p className="text-[9px] font-bold text-gray-400 uppercase mt-6 leading-relaxed italic">
                                 This configuration is permanent. Contact Admin for modifications.
                              </p>
                           </div>
                        </div>
                     )}

                     <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <Lock size={14} />
                        Configuration
                     </h3>

                     <div className="space-y-5">
                        {/* State (Always Locked to Bihar for now) */}
                        <div>
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">State</label>
                           <select
                              value={state}
                              onChange={(e) => {
                                 setState(e.target.value);
                                 setDistrict("");
                                 setBlock("");
                                 setPanchayat("");
                              }}
                              className="w-full bg-white border-2 border-gray-100 px-4 py-3 text-sm font-black text-gray-700 focus:border-[#3AB000] outline-none transition-all"
                           >
                              <option value="">Select State</option>
                              {statesList.map(s => (
                                 <option key={s} value={s}>{s}</option>
                              ))}
                           </select>
                        </div>

                        {/* District */}
                        <div>
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">District</label>
                           <select
                              value={district}
                              onChange={(e) => {
                                 setDistrict(e.target.value);
                                 setBlock("");
                                 setPanchayat("");
                              }}
                              className="w-full bg-white border-2 border-gray-100 px-4 py-3 text-sm font-black text-gray-700 focus:border-[#3AB000] outline-none transition-all"
                           >
                              <option value="">Select District</option>
                              {districts.map(d => (
                                 <option key={d} value={d}>{d}</option>
                              ))}
                           </select>
                        </div>

                        {/* Block (Visible for BS and PE) */}
                        {(isBS || isPE) && (
                           <div className="animate-in slide-in-from-top-2 duration-300">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Block / Tehsil</label>
                              <select
                                 value={block}
                                 onChange={(e) => setBlock(e.target.value)}
                                 disabled={!district}
                                 className="w-full bg-white border-2 border-gray-100 px-4 py-3 text-sm font-black text-gray-700 focus:border-[#3AB000] outline-none transition-all disabled:opacity-50"
                              >
                                 <option value="">Select Block</option>
                                 {blocks.map(b => (
                                    <option key={b._id} value={b._id}>{b.name}</option>
                                 ))}
                              </select>
                           </div>
                        )}

                        {/* Panchayat (Visible for PE) */}
                        {isPE && (
                           <div className="animate-in slide-in-from-top-2 duration-300">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Gram Panchayat</label>
                              <select
                                 value={panchayat}
                                 onChange={(e) => setPanchayat(e.target.value)}
                                 disabled={!block}
                                 className="w-full bg-white border-2 border-gray-100 px-4 py-3 text-sm font-black text-gray-700 focus:border-[#3AB000] outline-none transition-all disabled:opacity-50"
                              >
                                 <option value="">Select Panchayat</option>
                                 {panchayats.map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                 ))}
                              </select>
                           </div>
                        )}

                        <button
                           onClick={handleLockZone}
                           disabled={submitting}
                           className="w-full bg-[#3AB000] text-white py-4 text-xs font-black uppercase tracking-[0.2em] shadow-lg hover:bg-[#2e8c00] transition-all flex items-center justify-center gap-3 group mt-4 rounded-lg"
                        >
                           {submitting ? (
                              <Loader2 className="animate-spin" size={18} />
                           ) : (
                              <>
                                 <Lock size={18} className="group-hover:scale-110 transition-transform" />
                                 Lock Working Zone
                              </>
                           )}
                        </button>
                        <p className="text-[9px] font-bold text-red-500 text-center uppercase tracking-tighter">
                           * Caution: This action is permanent and auto-locks your territory.
                        </p>
                     </div>
                  </div>

                  {/* Quick Info */}
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 flex gap-4">
                     <AlertCircle size={20} className="text-amber-500 shrink-0" />
                     <p className="text-[11px] font-bold text-amber-800 leading-tight">
                        By locking your zone, you will be automatically linked to the senior management of your territory.
                     </p>
                  </div>
               </div>

               {/* Real-time Preview Area */}
               <div className="lg:col-span-8 space-y-6">
                  <div className="bg-white border border-gray-200 shadow-md min-h-[400px] flex flex-col">
                     <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                           <Eye size={18} className="text-[#3AB000]" />
                           Territory Preview
                        </h3>
                        <div className="flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-[#3AB000] animate-pulse" />
                           <span className="text-[10px] font-black text-[#3AB000] uppercase tracking-widest">Real-time Data</span>
                        </div>
                     </div>

                     <div className="flex-1 p-8">
                        {!district ? (
                           <div className="h-full flex flex-col items-center justify-center text-center opacity-30 grayscale p-12">
                              <MapPin size={60} className="mb-4" />
                              <p className="text-sm font-black uppercase tracking-widest">Select a district to view your area coverage</p>
                           </div>
                        ) : (
                           <div className="space-y-8 animate-in fade-in duration-700">

                              {/* Breadcrumb Preview */}
                              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400">
                                 <span className="text-[#3AB000]">{state}</span>
                                 <ChevronRight size={14} />
                                 <span className="text-[#3AB000]">{district}</span>
                                 {block && (
                                    <>
                                       <ChevronRight size={14} />
                                       <span className="text-[#3AB000]">{blocks.find(b => b._id === block)?.name}</span>
                                    </>
                                 )}
                              </div>

                              {/* Stats Grid */}
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                 <div className="p-4 bg-gray-50 border border-gray-100 flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-gray-400 uppercase leading-none">Management Level</span>
                                    <span className="text-sm font-black text-gray-900 uppercase">
                                       {isDM ? "District" : isBS ? "Block" : "Panchayat"}
                                    </span>
                                 </div>
                                 <div className="p-4 bg-gray-50 border border-gray-100 flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-gray-400 uppercase leading-none">Total Blocks Under You</span>
                                    <span className="text-sm font-black text-gray-900 uppercase">{isDM ? previewBlocks.length : 1} Units</span>
                                 </div>
                                 <div className="p-4 bg-gray-50 border border-gray-100 flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-gray-400 uppercase leading-none">Panchayat Coverage</span>
                                    <span className="text-sm font-black text-gray-900 uppercase">
                                       {isDM || isBS ? previewPanchayats.length : 1} Localities
                                    </span>
                                 </div>
                              </div>

                              {/* Active Jurisdiction Banner */}
                              <div className="bg-gradient-to-r from-[#3AB000] to-[#2e8c00] p-6 rounded-xl flex items-center justify-between shadow-xl animate-in zoom-in-95 duration-500 border-b-4 border-[#1a5000]">
                                 <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                                       <ShieldCheck className="text-white" size={30} />
                                    </div>
                                    <div>
                                       <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] leading-none mb-1.5">Official Working Jurisdiction</p>
                                       <h2 className="text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm">
                                          {activeZoneName || (district ? "Calculating Zone..." : "No Zone Selected")}
                                       </h2>
                                    </div>
                                 </div>
                                 <div className="hidden lg:block text-right">
                                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-lg">
                                       <p className="text-[9px] font-black text-white uppercase tracking-widest leading-none">Status</p>
                                       <p className="text-[11px] font-black text-white uppercase mt-0.5">Authenticated Territory</p>
                                    </div>
                                 </div>
                              </div>

                              {/* List View */}
                              <div className="space-y-4 pt-4 border-t border-gray-100">
                                 <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Users size={14} className="text-[#3AB000]" />
                                    Area Coverage Details
                                 </h4>

                                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar p-1">
                                    {isDM && previewBlocks.map(b => (
                                       <div key={b._id} className="p-4 bg-white border border-gray-100 flex items-center justify-between group hover:border-[#3AB000] hover:shadow-md transition-all rounded-lg">
                                          <div className="flex items-center gap-3">
                                             <div className="w-1.5 h-1.5 rounded-full bg-[#3AB000]" />
                                             <span className="text-[12px] font-black text-gray-900 uppercase tracking-tighter">{b.name}</span>
                                          </div>
                                          <span className="text-[9px] font-black text-[#3AB000] uppercase bg-[#3AB000]/10 px-2.5 py-1 rounded-md border border-[#3AB000]/20">Block</span>
                                       </div>
                                    ))}

                                    {(isBS || isPE) && previewPanchayats.map(p => (
                                       <div key={p._id} className={`p-4 border flex items-center justify-between group transition-all rounded-lg ${p._id === panchayat ? 'bg-[#3AB000] border-[#3AB000] text-white shadow-lg' : 'bg-white border-gray-200 hover:border-[#3AB000] hover:shadow-md'}`}>
                                          <div className="flex items-center gap-3 overflow-hidden">
                                             <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${p._id === panchayat ? 'bg-white' : 'bg-[#3AB000]'}`} />
                                             <span className={`text-[12px] font-black uppercase tracking-tighter truncate ${p._id === panchayat ? 'text-white' : 'text-gray-900'}`}>{p.name}</span>
                                          </div>
                                          {p._id === panchayat ? (
                                             <CheckCircle2 size={16} className="shrink-0" />
                                          ) : (
                                             <span className="text-[9px] font-black text-[#3AB000] uppercase bg-[#3AB000]/10 px-2.5 py-1 rounded-md border border-[#3AB000]/20 shrink-0">Panchayat</span>
                                          )}
                                       </div>
                                    ))}

                                    {isDM && previewBlocks.length === 0 && <p className="text-xs text-gray-400 italic">No blocks found in this district.</p>}
                                    {isBS && previewPanchayats.length === 0 && <p className="text-xs text-gray-400 italic">No panchayats found in this block.</p>}
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>

                     <div className="p-6 bg-gray-50 border-t border-gray-200 mt-auto">
                        <p className="text-[10px] font-bold text-gray-500 leading-relaxed italic">
                           * The coverage details above are pulled directly from official JSSA location databases. If your assigned area is missing, please contact the IT Administrator.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </DashboardLayout>
   );
};

export default WorkingZone;
