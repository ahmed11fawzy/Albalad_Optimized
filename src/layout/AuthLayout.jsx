import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="App auth-layout">
      <main className="auth-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;