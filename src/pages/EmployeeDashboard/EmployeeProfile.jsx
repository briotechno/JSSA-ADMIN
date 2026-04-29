import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  GraduationCap,
  Briefcase,
  Calendar,
  ShieldCheck,
  Globe,
  Loader2
} from "lucide-react";
import { createPaperAPI, employeesAPI } from "../../utils/api";
import { useAuth } from "../../auth/AuthProvider";

const GREEN = "#3AB000";

// Helper to sanitize image URLs for production
const cleanImageUrl = (url) => {
  if (!url) return "";
  if (url.includes("localhost:3005/api")) {
    return url.replace("http://localhost:3005/api", "https://api.jssabhiyan.com/api");
  }
  if (url.startsWith("/api/")) {
    return `https://api.jssabhiyan.com/api${url}`;
  }
  return url;
};

const ProfileField = ({ icon: Icon, label, value, color = "text-gray-600" }) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200">
    <div className={`p-2 ${color.replace('text', 'bg')}/10`}>
      <Icon size={18} className={color} />
    </div>
    <div className="flex-1">
      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-bold text-gray-900 break-words mt-1">{value || "Not Provided"}</p>
    </div>
  </div>
);

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-5 pb-3 border-b-2 border-green-600">
    <Icon className="text-green-600" size={20} />
    <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">{title}</h2>
  </div>
);

const EmployeeProfile = () => {
  const [loading, setLoading] = useState(true);
  const [app, setApp] = useState(null);
  const [mouAddress, setMouAddress] = useState(null);
  const [appAddress, setAppAddress] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Try fetching application data (works for exam-based employees)
        const [examRes, empRes] = await Promise.allSettled([
          createPaperAPI.getAssigned(),
          employeesAPI.getMe(),
        ]);

        let merged = {};

        // If manual employee profile exists, use it as base
        if (empRes.status === "fulfilled" && empRes.value?.success && empRes.value?.data) {
          const ep = empRes.value.data;
          setMouAddress({
            address: ep.villageTola,
            wardNo: ep.wardNo,
            panchayat: ep.gramPanchayat,
            block: ep.blockKhand,
            district: ep.district,
            state: ep.state,
            pincode: ep.pincode
          });
          merged = {
            candidateName: ep.name,
            fatherName: ep.fatherName,
            motherName: ep.motherName,
            dob: ep.dob,
            mobile: ep.mobile,
            email: ep.email,
            nationality: ep.nationality,
            panNumber: ep.panNumber,
            state: ep.state,
            district: ep.district,
            blockKhand: ep.blockKhand,
            gramPanchayat: ep.gramPanchayat,
            villageTola: ep.villageTola,
            wardNo: ep.wardNo,
            pincode: ep.pincode,
            educationDetails: ep.educationDetails || [],
            bankName: ep.bankName,
            accountNumber: ep.accountNumber,
            ifscCode: ep.ifscCode,
            accountHolderName: ep.accountHolderName,
            photo: ep.photo,
            signature: ep.signature,
            post: ep.jobPostingId?.title || ep.jobPostingId?.post?.en || "",
            employeeId: `JSSA/EMP/${ep._id?.slice(-6).toUpperCase()}`,
            // Map field names for compatibility
            block: ep.blockKhand,
            panchayat: ep.gramPanchayat,
            address: ep.villageTola,
          };
        }

        // If exam-based application data exists, overlay it (it's more authoritative)
        if (examRes.status === "fulfilled" && examRes.value?.success && examRes.value?.data?.tests?.length > 0) {
          const examApp = examRes.value.data.tests[0].userAttempt?.applicationId;
          if (examApp) {
            setAppAddress({
              address: examApp.address,
              wardNo: examApp.wardNo,
              panchayat: examApp.panchayat,
              block: examApp.block,
              district: examApp.district,
              state: examApp.state,
              pincode: examApp.pincode
            });
            merged = { ...merged, ...examApp };
          }
        }

        if (Object.keys(merged).length > 0) setApp(merged);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
          <p className="font-bold text-gray-700">Loading your profile details...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 max-w-6xl mx-auto">

        {/* Header Profile Card */}
        <div className="relative mb-8 pt-20">
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-green-600 to-green-700">
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
          </div>

          <div className="bg-white p-6 sm:p-8 border border-green-600 flex flex-col md:flex-row items-center md:items-end gap-6 relative">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white p-1 border border-green-600 -mt-20 md:-mt-24 overflow-hidden group">
              <img
                src={cleanImageUrl(app?.photo) || "https://ui-avatars.com/api/?name=User&background=3AB000&color=fff"}
                alt="Profile"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">
                  {app?.candidateName}
                </h1>
                <span className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-[9px] font-black uppercase tracking-widest border border-green-700">
                  <ShieldCheck size={12} className="mr-1" /> Verified Employee
                </span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-600 font-bold text-sm">
                <span className="flex items-center gap-1.5"><Briefcase size={16} className="text-green-600" /> {app?.post || "Not Assigned"}</span>
                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-red-500" /> {app?.district}, {app?.state}</span>
                <span className="flex items-center gap-1.5 text-blue-600"><Globe size={16} /> ID: {app?.employeeId || `JSSA/EMP/${app?._id?.slice(-6).toUpperCase()}`}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content Areas */}
          <div className="lg:col-span-2 space-y-8">

            {/* Personal Details */}
            <div className="bg-white p-6 sm:p-8 border border-green-600">
              <SectionHeader icon={User} title="Personal Details" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <ProfileField icon={User} label="Father's Name" value={app?.fatherName} />
                <ProfileField icon={User} label="Mother's Name" value={app?.motherName} color="text-pink-600" />
                <ProfileField icon={Calendar} label="Date of Birth" value={new Date(app?.dob).toLocaleDateString()} color="text-orange-600" />
                <ProfileField icon={Phone} label="Mobile Number" value={app?.mobile} color="text-green-600" />
                <ProfileField icon={Mail} label="Email Address" value={app?.email} color="text-blue-600" />
                <ProfileField icon={Globe} label="Nationality" value={app?.nationality && app.nationality.charAt(0).toUpperCase() + app.nationality.slice(1)} color="text-purple-600" />
              </div>
            </div>

            {/* Educational Qualifications */}
            <div className="bg-white p-6 sm:p-8 border border-green-600">
              <SectionHeader icon={GraduationCap} title="Education Qualifications" />
              {app?.educationDetails && app.educationDetails.length > 0 ? (
                <div className="overflow-x-auto border border-green-600">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-green-600 text-[9px] font-black uppercase tracking-widest text-white border-b border-green-700">
                        <th className="px-4 py-3">Qualification</th>
                        <th className="px-4 py-3">Board/University</th>
                        <th className="px-4 py-3 text-center">Year</th>
                        <th className="px-4 py-3 text-center">Marks (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {app.educationDetails.map((edu, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-bold text-gray-800">{edu.level}</td>
                          <td className="px-4 py-3 text-gray-600 font-semibold">{edu.board}</td>
                          <td className="px-4 py-3 text-center text-gray-600 font-semibold">{edu.year}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 bg-green-600 text-white font-bold">{edu.percentage}%</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50 border border-dashed border-green-600">
                  <GraduationCap size={40} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm font-bold text-gray-600">No education details added yet</p>
                  <p className="text-[11px] text-gray-500 mt-2">Complete your MOU form to add educational qualifications</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">

            {/* Bank Details from MOU */}
            <div className="bg-white p-6 border border-green-600 bg-gradient-to-br from-white to-gray-50">
              <SectionHeader icon={CreditCard} title="Bank Information" />
              <div className="space-y-3 text-left">
                <ProfileField icon={Building} label="Bank Name" value={app?.bankName} color="text-blue-600" />
                <ProfileField icon={CreditCard} label="Account Number" value={app?.accountNumber} color="text-gray-800" />
                <ProfileField icon={Globe} label="IFSC Code" value={app?.ifscCode} color="text-orange-600" />
                <ProfileField icon={User} label="A/C Holder" value={app?.accountHolderName} color="text-green-600" />
                <div className="mt-4 p-3 bg-white border border-green-600">
                  <p className="text-[9px] font-bold text-gray-600 uppercase">Verification Status</p>
                  <p className="text-xs font-black text-green-600 flex items-center mt-2">
                    <ShieldCheck size={14} className="mr-1" /> PAYMENTS ENABLED
                  </p>
                </div>
              </div>
            </div>

            {/* Professional & Address */}
            <div className="bg-white p-6 border border-green-600">
              <SectionHeader icon={MapPin} title="Geographical Details" />
              <div className="space-y-4 text-left">
                {/* Application Address Block */}
                {appAddress && (
                  <div className="p-4 bg-blue-50/50 border border-blue-200">
                    <p className="text-[9px] font-black text-blue-600 uppercase mb-2 tracking-widest flex items-center gap-1">
                      <Globe size={10} />  Address
                    </p>
                    <p className="text-sm font-bold text-gray-800 leading-relaxed">
                      {[
                        appAddress.address,
                        appAddress.wardNo ? `Ward ${appAddress.wardNo}` : null,
                        appAddress.panchayat,
                        appAddress.block,
                        appAddress.district,
                        appAddress.state ? `${appAddress.state}${appAddress.pincode ? ` - ${appAddress.pincode}` : ''}` : appAddress.pincode
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>
                )}

                {/* MOU Address Block - Only show if data exists */}
                {mouAddress && Object.values(mouAddress).some(v => v && v.toString().trim()) && (
                  <div className="p-4 bg-green-50/50 border border-green-200">
                    <p className="text-[9px] font-black text-green-600 uppercase mb-2 tracking-widest flex items-center gap-1">
                      <ShieldCheck size={10} /> MOU / Profile Address
                    </p>
                    <p className="text-sm font-bold text-gray-800 leading-relaxed">
                      {[
                        mouAddress.address,
                        mouAddress.wardNo ? `Ward ${mouAddress.wardNo}` : null,
                        mouAddress.panchayat,
                        mouAddress.block,
                        mouAddress.district,
                        mouAddress.state ? `${mouAddress.state}${mouAddress.pincode ? ` - ${mouAddress.pincode}` : ''}` : mouAddress.pincode
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-red-50 border border-red-600 text-center">
                  <p className="text-[8px] font-black text-red-600 uppercase mb-1">PAN NO.</p>
                  <p className="text-xs font-black text-red-700">{app?.panNumber || app?.pan || "N/A"}</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-600 text-center">
                  <p className="text-[8px] font-black text-blue-600 uppercase mb-1">ADHAR VERIFIED</p>
                  <p className="text-xs font-black text-blue-700">SUCCESS</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeProfile;
