import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { cardAPI } from "../../utils/api";
import {
  Download,
  Printer,
  Share2,
  ShieldCheck,
  Heart,
  MapPin,
  Phone,
  Loader2,
  AlertCircle,
  QrCode,
  ArrowLeft
} from "lucide-react";
import longLogo from "../../assets/jssa-logo-long.png";
import watermarkLogo from "../../assets/JSSAogo.png";
import qrCodeAsset from "../../assets/QrCode.png";

const GREEN = "#3AB000";

const MyCard = ({ cardId = null }) => {
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCard = async () => {
    try {
      setLoading(true);
      const res = cardId
        ? await cardAPI.getDetails(cardId)
        : await cardAPI.getMyCard();

      if (res.success) {
        setCard(res.data);
      } else {
        setError(res.error || "Card not found");
      }
    } catch (err) {
      setError("Failed to fetch card details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCard();
  }, [cardId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#3AB000]" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Your Digital Card...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !card) {
    return (
      <DashboardLayout>
        <div className="h-[70vh] flex flex-col items-center justify-center text-center px-6">
          <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Access Denied</h2>
          <p className="text-sm text-gray-500 font-medium mt-2">{error || "You don't have an active membership card yet."}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Back Link */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-[#3AB000] font-black uppercase text-[10px] tracking-widest mb-4 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Membership Card</h1>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Official Membership Credentials</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3AB000] text-white rounded-none text-sm font-black shadow-md hover:bg-[#2d8a00] transition-all">
              <Download size={18} />
              Download
            </button>
          </div>
        </div>

        {/* The Card Container */}
        <div className="flex flex-col items-center gap-12 py-12 bg-white rounded-none border-[1px] border-black/10 shadow-inner">

          {/* Front of Card - Premium Green Theme */}
          <div className="relative w-full max-w-[480px] aspect-[1.586/1] bg-[#0A3D00] rounded-none shadow-[0_30px_60px_rgba(0,0,0,0.3)] overflow-hidden border-2 border-[#3AB000]/30 group">

            {/* Premium Watermark Background */}
            <div className="absolute inset-0 z-0 opacity-10 flex items-center justify-center translate-y-8 pointer-events-none">
              <img src={watermarkLogo} alt="Watermark" className="w-[40%] h-auto grayscale brightness-200 rotate-[-15deg]" />
            </div>

            {/* Top Glossy Gradient */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#3AB000]/20 via-transparent to-black/40 z-0" />

            {/* Card Header with Long Logo */}
            <div className="relative z-10 px-6 py-4 bg-white/95 backdrop-blur-md flex items-center justify-between border-b-4 border-[#3AB000] shadow-md">
              <div className="flex flex-col">
                <img src={longLogo} alt="JSSA Official" className="h-10 w-auto object-contain" />
                <div className="mt-1 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#3AB000]" />
                  <span className="text-[10px] font-black text-[#0A3D00] uppercase tracking-[0.2em]">JSSA Membership</span>
                </div>
              </div>
              <div className="text-right border-l-2 border-gray-100 pl-4">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Membership ID</p>
                <p className="text-[14px] font-black text-[#3AB000] tracking-tight mt-1">{card.cardId}</p>
              </div>
            </div>

            {/* Card Content */}
            <div className="relative z-10 p-6 flex gap-8 h-[calc(100%-80px)]">
              {/* Photo Section */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-28 h-32 bg-white rounded-none border-2 border-[#3AB000] overflow-hidden shadow-2xl relative">
                  <div className="absolute inset-0 border-4 border-white z-10 pointer-events-none" />
                  <img
                    src={card.photo || "https://api.dicebear.com/7.x/initials/svg?seed=" + card.cardholderName}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-full px-3 py-1.5 bg-white text-[#0A3D00] border-l-4 border-red-500 flex items-center justify-center gap-2 shadow-lg">
                  <Heart size={12} className="fill-red-500 text-red-500" />
                  <span className="text-[11px] font-black uppercase tracking-tighter">{card.bloodGroup}</span>
                </div>
              </div>

              {/* Details Section - Premium Typography */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <p className="text-[10px] font-bold text-green-200/70 uppercase tracking-[0.2em] leading-none mb-2">Member Name</p>
                  <h3 className="text-2xl font-black text-white leading-none uppercase tracking-tight drop-shadow-md">{card.cardholderName}</h3>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-[9px] font-bold text-green-200/50 uppercase tracking-widest leading-none mb-1">Aadhar Number</p>
                    <p className="text-[15px] font-black text-white tracking-widest">XXXX XXXX {card.aadhaarNumber?.slice(-4)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-green-200/50 uppercase tracking-widest leading-none mb-1">Date of Birth</p>
                    <p className="text-[15px] font-black text-white">{new Date(card.dob).toLocaleDateString('en-GB')}</p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/10 mt-2">
                  <div className="flex items-center gap-2 text-white/90">
                    <Phone size={14} className="text-[#3AB000]" />
                    <span className="text-[12px] font-black tracking-tight">{card.mobileNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin size={14} className="text-[#3AB000]" />
                    <span className="text-[12px] font-black tracking-tight">{card.pincode}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Accent Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#3AB000] shadow-[0_-10px_20px_#3AB000]" />
          </div>

          {/* Back of Card - Premium Green Theme */}
          <div className="relative w-full max-w-[480px] aspect-[1.586/1] bg-[#0A3D00] rounded-none shadow-[0_30px_60px_rgba(0,0,0,0.3)] overflow-hidden border-2 border-[#3AB000]/30 p-8 flex flex-col justify-between">

            {/* Watermark Background */}
            <div className="absolute inset-0 z-0 opacity-10 flex items-center justify-center pointer-events-none">
              <img src={watermarkLogo} alt="Watermark" className="w-[55%] h-auto grayscale brightness-200 rotate-[15deg]" />
            </div>

            <div className="relative z-10 flex justify-between items-start">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-green-200/50 uppercase tracking-[0.2em] mb-1">Emergency Contact</p>
                  <p className="text-sm font-black text-white uppercase tracking-tight">{card.fatherOrHusbandName}</p>
                  <p className="text-[12px] font-bold text-[#3AB000]">{card.fatherOrHusbandMobile || card.mobileNumber}</p>
                </div>

                <div className="pt-2">
                  <p className="text-[10px] font-bold text-green-200/50 uppercase tracking-[0.2em] mb-1">Full Address</p>
                  <p className="text-[11px] font-bold text-white/90 leading-relaxed uppercase max-w-[200px]">
                    {card.addressLine}, {card.villageCity}, {card.block}, {card.district}, {card.state}
                  </p>
                </div>
              </div>

              {/* QR Code Section - Using Provided Asset */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 bg-white p-1 rounded-none shadow-2xl border-4 border-[#3AB000]/20">
                  <img src={qrCodeAsset} alt="QR Code" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>

            {/* Back Footer */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex justify-between items-center">
              <div className="flex flex-col">
                <p className="text-[9px] font-black text-green-200/40 uppercase">Issued By</p>
                <p className="text-[10px] font-black text-white uppercase tracking-tighter">JSSA Recruitment Board</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-[#3AB000] uppercase tracking-widest bg-white/95 px-4 py-1.5 shadow-lg border-r-4 border-green-500">Official Document</p>
              </div>
            </div>

            {/* Top Accent Bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#3AB000] opacity-50" />
          </div>

        </div>

        {/* Support Section */}
        <div className="mt-8 bg-green-50 rounded-none p-6 border border-green-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center text-[#3AB000] shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900 uppercase">Need help with your card?</h4>
              <p className="text-xs text-gray-500 font-medium">Contact your branch or employee for any corrections.</p>
            </div>
          </div>
          <button className="px-5 py-2 bg-white text-gray-900 rounded-none text-xs font-black uppercase shadow-sm hover:shadow-md transition-all">
            Contact Support
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyCard;
