import React from "react";
import Navbar from "./_components/navbar";
import Sidebar from "./_components/sidebar";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="md:flex container">
        <Sidebar />
        <main className="px-5 py-6 flex-grow">{children}</main>
      </div>
    </div>
  );
};
export default DashboardLayout;
