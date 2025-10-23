import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarApp from "../components/SidebarApp";
import AppHeader from "../components/AppHeader";

const AppLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Header - Fixed at top, above everything */}
      <AppHeader />

      {/* Sidebar - Fixed on left */}
      <SidebarApp
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content - with margin for sidebar and padding for header */}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isSidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Spacer for fixed header */}
        <div className="h-24"></div>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
