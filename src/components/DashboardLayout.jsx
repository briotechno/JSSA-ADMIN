import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import FloatingBroadcastManager from "./FloatingBroadcastManager";
import TawkMessenger from "./TawkMessenger";
import AnnouncementBanner from "./AnnouncementBanner";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Announcement Banner for Employees */}
      <AnnouncementBanner />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <main
        className={`mt-12 p-4 bg-white min-h-screen transition-all duration-300
        ${sidebarOpen ? "ml-56" : "ml-0"} 
        md:ml-56`}
      >
        {children}
      </main>

      {/* Global Broadcast Status Manager */}
      <FloatingBroadcastManager />

      {/* Tawk.to Widget for Employees */}
      <TawkMessenger />
    </div>
  );
};

export default DashboardLayout;
