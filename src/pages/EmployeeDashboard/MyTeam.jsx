import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { employeesAPI } from "../../utils/api";
import {
   Users,
   UserCircle,
   ShieldCheck,
   MapPin,
   Phone,
   Mail,
   Loader2,
   ChevronDown,
   ChevronUp,
   ExternalLink,
   Network,
   GitGraph
} from "lucide-react";

const MyTeam = () => {
   const [hierarchy, setHierarchy] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   useEffect(() => {
      fetchHierarchy();
   }, []);

   const fetchHierarchy = async () => {
      try {
         const res = await employeesAPI.getHierarchy();
         if (res.success) {
            setHierarchy(res.data);
         } else {
            setError(res.error || "Failed to load team data");
         }
      } catch (err) {
         setError("An error occurred while fetching team data");
      } finally {
         setLoading(false);
      }
   };

   if (loading) {
      return (
         <DashboardLayout>
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
               <Loader2 className="w-10 h-10 animate-spin text-[#3AB000]" />
               <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Mapping Team Connections...</p>
            </div>
         </DashboardLayout>
      );
   }

   if (error) {
      return (
         <DashboardLayout>
            <div className="h-[60vh] flex flex-col items-center justify-center text-center px-6">
               <ShieldCheck className="text-red-500 mb-4" size={48} />
               <h2 className="text-xl font-black text-gray-900 uppercase">Data Fetch Error</h2>
               <p className="text-sm text-gray-500 font-bold uppercase mt-2 max-w-md leading-relaxed">
                  {error}
               </p>
               <button
                  onClick={fetchHierarchy}
                  className="mt-6 px-8 py-3 bg-[#3AB000] text-white text-xs font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all"
               >
                  Retry Connection
               </button>
            </div>
         </DashboardLayout>
      );
   }

   if (!hierarchy) return null;

   const { me, upper, subordinates } = hierarchy;

   // PRODUCTION ROBUST IDENTITY LOGIC
   const isSelf = (node) => {
      if (!node || !me) return false;
      const nodeId = node._id || node.id;
      const meId = me._id || me.id;

      // 1. Primary Check: Unique MongoDB / Database ID
      if (nodeId && meId) {
         return String(nodeId) === String(meId);
      }

      // 2. Fallback Check: Unique Phone Number (Only if IDs are missing)
      if (node.phone && me.phone) {
         return String(node.phone) === String(me.phone);
      }

      return false;
   };

   // Helper to get descriptive zone name
   const getZoneDisplay = (node) => {
      if (!node) return "";
      const post = (node.post || node.designation || "").toLowerCase();
      
      if (post.includes("district manager")) {
         return node.district || node.workingDistrict || node.zone?.district || "District HQ";
      }
      if (post.includes("block supervisor")) {
         return node.block || node.workingBlock?.name || node.zone?.block || "Block Area";
      }
      if (post.includes("panchayat executive")) {
         return node.panchayat || node.workingPanchayat?.name || node.zone?.panchayat || "Gram Panchayat";
      }
      return node.block || node.zone?.block || "Official";
   };

   // CARD RENDERER: DM/BS
   const renderMainCard = (node, vacantPost = "") => {
      const self = isSelf(node);
      if (!node) {
         return (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-8 rounded-none flex flex-col items-center justify-center text-center opacity-40 w-full max-w-md relative">
               <ShieldCheck size={24} className="text-gray-300 mb-2" />
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{vacantPost} Not Assigned</p>
            </div>
         );
      }

      return (
         <div className={`bg-white transition-all duration-300 group relative w-full max-w-md rounded-none shadow-none border-2
            ${self ? 'border-[#3AB000] border-[3px] scale-[1.02] z-30' : 'border-[#3AB000]/30 z-10'}`}>
            
            {self && (
               <div className="absolute -top-3 -right-3 bg-[#3AB000] px-4 py-1.5 rounded-none z-40 shadow-lg border-2 border-white animate-pulse">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">YOU</span>
               </div>
            )}
            
            <div className="p-6 flex items-center gap-5">
               <div className={`w-14 h-14 rounded-none flex items-center justify-center shadow-none transition-transform group-hover:scale-105
                  ${self ? 'bg-[#3AB000]' : 'bg-[#3AB000]/60'}`}>
                  <UserCircle className="text-white" size={32} />
               </div>
               <div className="text-left overflow-hidden">
                  <h4 className={`text-[15px] font-black uppercase leading-none mb-1.5 truncate ${self ? 'text-gray-900' : 'text-gray-700'}`}>
                     {node.name}
                  </h4>
                  <p className={`text-[11px] font-black uppercase tracking-widest truncate ${self ? 'text-[#3AB000]' : 'text-[#3AB000]/60'}`}>
                     {node.post || node.designation || node.role} • {getZoneDisplay(node)}
                  </p>
               </div>
            </div>
         </div>
      );
   };

   // CARD RENDERER: PE
   const renderPECard = (node) => {
      const self = isSelf(node);
      return (
         <div className={`bg-white transition-all duration-300 group relative w-full rounded-none shadow-none border
            ${self ? 'border-[#3AB000] border-2 scale-[1.01] z-30' : 'border-[#3AB000]/30 z-10'}`}>
            
            {self && (
               <div className="absolute -top-3 -right-3 bg-[#3AB000] px-4 py-1.5 rounded-none z-40 shadow-lg border-2 border-white animate-pulse">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">YOU</span>
               </div>
            )}
            
            <div className="p-5 flex items-center justify-between">
               <div className="flex items-center gap-4 overflow-hidden">
                  <div className={`w-10 h-10 rounded-none flex items-center justify-center transition-colors
                     ${self ? 'bg-[#3AB000] text-white' : 'bg-gray-50 text-[#3AB000]/60 group-hover:bg-[#3AB000]/5'}`}>
                     <UserCircle size={24} />
                  </div>
                  <div className="text-left overflow-hidden">
                     <p className={`text-[13px] font-black uppercase leading-none truncate ${self ? 'text-gray-800' : 'text-gray-600'}`}>
                        {node.name}
                     </p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase mt-1.5 tracking-tighter truncate">
                        Zone: {getZoneDisplay(node)}
                     </p>
                  </div>
               </div>
               <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className={`text-[9px] px-2.5 py-1 rounded-none font-black uppercase tracking-tighter 
                     ${self ? 'bg-[#3AB000]/20 text-[#3AB000]' : 'bg-[#3AB000]/5 text-[#3AB000]/50'}`}>
                     Panchayat Executive
                  </span>
                  <span className={`text-[9px] font-black uppercase flex items-center gap-1.5
                     ${self ? 'text-[#3AB000]' : 'text-[#3AB000]/40'}`}>
                     <span className={`w-2 h-2 rounded-full animate-pulse ${self ? 'bg-[#3AB000]' : 'bg-[#3AB000]/40'}`} />
                     Active
                  </span>
               </div>
            </div>
         </div>
      );
   };

   const renderUniversalTree = () => {
      if (hierarchy.isZoneLocked === false) {
         return (
            <div className="h-full flex flex-col items-center justify-center text-center p-12">
               <MapPin size={48} className="text-amber-500 mb-4 animate-bounce" />
               <h4 className="text-lg font-black text-gray-900 uppercase tracking-widest">Jurisdiction Locked</h4>
               <p className="text-[11px] font-bold text-gray-400 uppercase mt-2 max-w-xs leading-relaxed">Please lock your working zone to see team hierarchy.</p>
            </div>
         );
      }

      const findDM = () => {
         if (me.post?.toLowerCase().includes("district manager")) return me;
         const upperList = Array.isArray(upper) ? upper : [upper].filter(Boolean);
         const dmInUpper = upperList.find(n => n.post?.toLowerCase().includes("district manager"));
         if (dmInUpper) return dmInUpper;
         for (const u of upperList) {
            if (u.reportingTo?.post?.toLowerCase().includes("district manager")) return u.reportingTo;
            if (u.manager?.post?.toLowerCase().includes("district manager")) return u.manager;
            if (u.districtManager) return u.districtManager;
         }
         if (hierarchy.dm) return hierarchy.dm;
         if (hierarchy.districtManager) return hierarchy.districtManager;
         if (hierarchy.path) {
            const dmInPath = hierarchy.path.find(n => n.post?.toLowerCase().includes("district manager"));
            if (dmInPath) return dmInPath;
         }
         return null;
      };

      const dmNode = findDM();
      
      const bsNodes = (me.post?.includes("Block Supervisor") 
         ? [me] 
         : (me.post?.includes("District Manager") 
            ? subordinates.filter(s => s.post?.includes("Block Supervisor")) 
            : (Array.isArray(upper) ? upper.filter(u => u.post?.includes("Block Supervisor")) : (upper?.post?.includes("Block Supervisor") ? [upper] : []))));
            
      const peNodes = (me.post?.includes("Panchayat Executive") 
         ? [me] 
         : subordinates.filter(s => s.post?.includes("Panchayat Executive")));

      return (
         <div className="space-y-0 py-8 px-4 sm:px-12 pb-24">
            {/* DM Level */}
            <div className="flex flex-col items-start">
               {renderMainCard(dmNode, "District Manager")}
               <div className="ml-12 w-[2px] h-12 bg-[#3AB000]/40" />
            </div>

            {/* BS Level */}
            <div className="space-y-0">
               {bsNodes.length > 0 ? (
                  bsNodes.map((bs, index) => {
                     const bsBlockName = (bs.block || bs.workingBlock?.name || bs.zone?.block || "").toLowerCase();
                     const filteredPEs = peNodes.filter(pe => {
                        const peBlockName = (pe.block || pe.workingBlock?.name || pe.zone?.block || "").toLowerCase();
                        if (isSelf(pe)) {
                           const myBoss = Array.isArray(upper) ? upper[0] : upper;
                           if (myBoss && (myBoss.id === bs.id || myBoss.name === bs.name)) return true;
                        }
                        return peBlockName === bsBlockName && bsBlockName !== "";
                     });

                     return (
                        <div key={bs.id || bs._id} className="relative flex flex-col items-start">
                           {renderMainCard(bs, "Block Supervisor")}

                           <div className="ml-12 flex flex-col w-full">
                              <div className="border-l-2 border-dashed border-[#3AB000]/30 pt-12 space-y-8 w-full">
                                 {filteredPEs.length > 0 ? (
                                    filteredPEs.map(pe => (
                                       <div key={pe.id || pe._id} className="relative flex items-center pl-12">
                                          <div className="absolute left-0 w-12 h-[2px] bg-[#3AB000]/20" />
                                          <div className="flex-1 w-full max-w-2xl">
                                             {renderPECard(pe)}
                                          </div>
                                       </div>
                                    ))
                                 ) : (
                                    <div className="relative flex items-center py-4 pl-12">
                                       <div className="absolute left-0 w-12 h-[2px] bg-[#3AB000]/10" />
                                       <p className="text-[11px] text-gray-300 font-black uppercase tracking-widest italic pl-4">No Executives Assigned</p>
                                    </div>
                                 )}
                              </div>
                           </div>
                           
                           {index < bsNodes.length - 1 && <div className="ml-12 w-[2px] h-12 bg-[#3AB000]/20" />}
                        </div>
                     );
                  })
               ) : (
                  <div className="flex flex-col items-start">
                     {renderMainCard(null, "Block Supervisor")}
                  </div>
               )}
            </div>
         </div>
      );
   };

   return (
      <DashboardLayout>
         {/* Custom Scrollbar Styles */}
         <style dangerouslySetInnerHTML={{ __html: `
            .tree-scrollbar::-webkit-scrollbar { width: 6px; }
            .tree-scrollbar::-webkit-scrollbar-track { background: #f9fafb; }
            .tree-scrollbar::-webkit-scrollbar-thumb { background: #3AB00030; border-radius: 0px; }
            .tree-scrollbar::-webkit-scrollbar-thumb:hover { background: #3AB00060; }
         `}} />

         <div className="p-6 space-y-8 w-full">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#3AB000] to-[#2e8c00] p-10 shadow-none relative overflow-hidden border-b-4 border-[#1a5000] rounded-none">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-none blur-3xl -mr-20 -mt-20" />
               <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-none flex items-center justify-center border border-white/30 shadow-none">
                        <Network className="text-white" size={32} />
                     </div>
                     <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm">Team Management</h1>
                        <div className="flex items-center gap-2 mt-1">
                           <ShieldCheck className="text-white/70" size={14} />
                           <p className="text-[11px] font-black text-white/60 uppercase tracking-widest">Hierarchy Structure & Reporting</p>
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-col items-end border-l-4 border-white/30 pl-8 py-1">
                     <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">Your Coverage</p>
                     <div className="text-[15px] font-black text-white uppercase tracking-tighter flex items-center gap-2">
                        {hierarchy.isZoneLocked === false ? (
                           "No Zone Assigned"
                        ) : (
                           <>
                              <span>{me.zone?.district || me.workingDistrict || "District"}</span>
                              {me.zone?.block && (
                                 <>
                                    <span className="text-white/40">/</span>
                                    <span>{me.zone.block}</span>
                                 </>
                              )}
                              {me.zone?.panchayat && (
                                 <>
                                    <span className="text-white/40">/</span>
                                    <span className="text-amber-200">{me.zone.panchayat}</span>
                                 </>
                              )}
                           </>
                        )}
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               {/* Sidebar */}
               <div className="lg:col-span-4 space-y-8 text-left h-fit lg:sticky lg:top-8">
                  <div className="space-y-4">
                     <h3 className="text-[12px] font-black text-[#3AB000] uppercase tracking-[0.3em] flex items-center gap-2">
                        <ChevronUp size={14} />
                        REPORTING TO OFFICIAL
                     </h3>
                     {upper ? (
                        <div className="bg-white border-2 border-[#3AB000]/30 rounded-none shadow-none overflow-hidden group">
                           <div className="bg-[#3AB000] px-5 py-2.5 flex items-center justify-between border-b border-[#3AB000]/10">
                              <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest">
                                 <ShieldCheck size={14} /> {Array.isArray(upper) ? upper[0].post : upper.post}
                              </div>
                           </div>
                           <div className="p-6">
                              <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-50">
                                 <div className="w-14 h-14 bg-gray-50 rounded-none flex items-center justify-center border border-gray-100 shadow-none">
                                    <UserCircle className="text-[#3AB000]/60" size={36} />
                                 </div>
                                 <div>
                                    <h4 className="text-sm font-black text-gray-700 uppercase tracking-tight leading-none">
                                       {Array.isArray(upper) ? upper[0].name : upper.name}
                                    </h4>
                                    <p className="text-[10px] font-bold text-[#3AB000]/60 uppercase tracking-widest mt-1">
                                       {getZoneDisplay(Array.isArray(upper) ? upper[0] : upper)}
                                    </p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic mt-1">Direct Supervisor</p>
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <div className="flex items-center gap-4">
                                    <Phone size={14} className="text-[#3AB000]/60" />
                                    <span className="text-[12px] font-bold text-gray-600 tracking-widest">
                                       {Array.isArray(upper) ? upper[0].phone : upper.phone}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <Mail size={14} className="text-[#3AB000]/60" />
                                    <span className="text-[12px] font-bold text-gray-600 truncate lowercase">
                                       {Array.isArray(upper) ? upper[0].email : upper.email}
                                    </span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ) : (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-8 rounded-none flex flex-col items-center justify-center text-center opacity-60">
                           <ShieldCheck size={24} className="text-gray-300 mb-2" />
                           <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Direct HQ Reporting</p>
                        </div>
                     )}
                  </div>

                  <div className="space-y-4">
                     <h3 className="text-[12px] font-black text-[#3AB000] uppercase tracking-[0.3em] flex items-center gap-2">
                        <UserCircle className="text-[#3AB000]" size={14} />
                        My Assignment
                     </h3>
                     <div className="bg-white border-2 border-[#3AB000] p-0 shadow-none rounded-none relative overflow-hidden group">
                        <div className="bg-[#3AB000] px-5 py-2.5 flex items-center justify-between border-b border-[#3AB000]/10">
                           <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest">
                              <ShieldCheck size={14} /> {me.post}
                           </div>
                        </div>
                        <div className="p-6">
                           <div className="flex items-center gap-4 mb-4 relative z-10 text-left">
                              <div className="w-14 h-14 bg-[#3AB000] rounded-none flex items-center justify-center shadow-none">
                                 <UserCircle className="text-white" size={36} />
                              </div>
                              <div>
                                 <h4 className="text-sm font-black text-gray-900 uppercase leading-none">{me.name}</h4>
                                 <p className="text-[11px] font-black text-[#3AB000] uppercase mt-2 tracking-widest leading-none">
                                    {getZoneDisplay(me)}
                                 </p>
                              </div>
                           </div>
                           <div className="bg-gray-50 p-3 flex items-center justify-between border border-gray-100 rounded-none relative z-10">
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</span>
                              <span className="text-[9px] font-black text-[#3AB000] uppercase flex items-center gap-1.5">
                                 <span className="w-2 h-2 rounded-full bg-[#3AB000] animate-pulse" /> Active
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right Side: Tree View with Inline Scroll */}
               <div className="lg:col-span-8">
                  <div className="bg-white border border-gray-200 shadow-none flex flex-col h-[750px] overflow-hidden rounded-none">
                     <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between text-left sticky top-0 bg-white z-20">
                        <div>
                           <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                              <Network className="text-[#3AB000]" size={20} />
                              Organizational Tree
                           </h3>
                           <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-widest italic">Live Hierarchy Flow (DM -&gt; BS -&gt; PE)</p>
                        </div>
                        <div className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-none">
                           <span className="text-[10px] font-black text-gray-700 uppercase">Management Node</span>
                        </div>
                     </div>

                     <div className="flex-1 bg-gray-50/10 overflow-y-auto tree-scrollbar">
                        {renderUniversalTree()}
                     </div>

                     <div className="p-6 bg-gray-50 border-t border-gray-200 mt-auto text-left rounded-none">
                        <div className="flex items-center gap-3">
                           <Network size={20} className="text-gray-400" />
                           <p className="text-[10px] font-bold text-gray-500 leading-relaxed italic uppercase tracking-tighter">
                              This hierarchy is automatically synchronized based on zone assignments. Any discrepancies should be reported to the zonal coordinator.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </DashboardLayout>
   );
};

export default MyTeam;
