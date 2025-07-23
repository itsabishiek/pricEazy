import React from "react";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {children}
    </div>
  );
};
export default AuthLayout;
