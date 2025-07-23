import React from "react";
import Navbar from "./_components/navbar";

type MarketingLayoutProps = {
  children: React.ReactNode;
};

const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="container">{children}</main>
    </div>
  );
};
export default MarketingLayout;
