import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="to flex h-screen items-center justify-center">
      {children}
    </div>
  );
};

export default AuthLayout;
