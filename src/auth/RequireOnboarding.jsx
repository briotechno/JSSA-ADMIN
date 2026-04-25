import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { employeesAPI } from "../utils/api";

/**
 * RequireOnboarding
 * Protects employee dashboard routes. 
 * Redirects to onboarding if not complete.
 */
export const RequireOnboarding = () => {
  const { role } = useAuth();
  const location = useLocation();
  const [onboardingComplete, setOnboardingComplete] = useState(null);
  const [isLoading, setIsLoading] = useState(role === "employee");

  useEffect(() => {
    const checkOnboarding = async () => {
      if (role === "employee") {
        try {
          const res = await employeesAPI.getOnboardingStatus();
          if (res.success) {
            setOnboardingComplete(res.onboardingComplete);
          } else {
            setOnboardingComplete(true);
          }
        } catch (err) {
          setOnboardingComplete(true);
        } finally {
          setIsLoading(false);
        }
      }
    };
    checkOnboarding();
  }, [role, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3AB000]"></div>
      </div>
    );
  }

  // If employee and onboarding is NOT complete, force them to stay on onboarding page
  if (role === "employee" && onboardingComplete === false && location.pathname !== "/employee/onboarding") {
    return <Navigate to="/employee/onboarding" replace />;
  }

  // If employee and onboarding IS complete, don't let them go back to onboarding page
  if (role === "employee" && onboardingComplete === true && location.pathname === "/employee/onboarding") {
    return <Navigate to="/employee/dashboard" replace />;
  }

  return <Outlet />;
};
