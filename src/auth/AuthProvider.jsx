import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearSession, getSession, setSession } from "./auth";
import { api } from "../utils/api";

const AuthContext = createContext(null);

const GREEN = "#3AB000";
const GREEN_DARK = "#2d8a00";

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(() => getSession());
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const onChange = () => setSessionState(getSession());
    window.addEventListener("storage", onChange);
    window.addEventListener("jssa_auth_changed", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("jssa_auth_changed", onChange);
    };
  }, []);

  // Check for role mismatch (e.g., upgraded on another system)
  useEffect(() => {
    const checkRoleSync = async () => {
      if (!session || !session.token || session.role !== "applicant") return;

      try {
        const res = await api.auth.getMe();
        if (res.success && res.data.user.role === "employee") {
          setShowUpgradeModal(true);
        }
      } catch (err) {
        console.error("Role sync check failed:", err);
      }
    };

    // Check once on mount and every time window gains focus
    checkRoleSync();
    window.addEventListener("focus", checkRoleSync);
    return () => window.removeEventListener("focus", checkRoleSync);
  }, [session]);

  const value = useMemo(() => {
    return {
      session,
      isAuthenticated: Boolean(session && session.token),
      role: session?.role,
      identifier: session?.identifier,
      token: session?.token,
      login: ({ identifier, role, token }) => setSession({ identifier, role, token }),
      logout: () => clearSession(),
    };
  }, [session]);

  return (
    <AuthContext.Provider value={value}>
      {children}
      
      {/* Role Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center transform transition-all animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎉</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Congratulations! Account Upgraded
            </h2>
            <p className="text-sm text-gray-500 mb-1">
              (बधाई हो! आपका अकाउंट अपडेट हो गया है)
            </p>
            
            <div className="bg-green-50 rounded-xl p-4 my-6 border border-green-100">
              <p className="text-gray-700 leading-relaxed font-medium">
                Your role has been upgraded to <span className="text-green-600 font-bold uppercase">Employee</span>. 
                Please logout and login again to access your new dashboard.
              </p>
              <p className="text-xs text-gray-600 mt-2 italic">
                आपका रोल अब Employee के रूप में अपडेट हो गया है। नया डैशबोर्ड देखने के लिए कृपया लॉग आउट करके दोबारा लॉग इन करें।
              </p>
            </div>
            
            <button
              onClick={() => {
                setShowUpgradeModal(false);
                clearSession();
              }}
              className="w-full py-4 px-6 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 hover:brightness-110"
              style={{ background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%)` }}
            >
              Log Out & Refresh (लॉग आउट करें)
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider />");
  }
  return ctx;
}
