import React from "react";
import { Outlet } from "react-router-dom";
import LogoHeader from "../compenets/logoHeader";
import Footer from "../compenets/footer";

const MinimalLayout = () => {
  return (
    <div className="App">
      <LogoHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MinimalLayout;