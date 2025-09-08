import React, { Profiler } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../compenets/header";
import Footer from "../compenets/footer";
import COUPONSDialog from "../compenets/COUPONSDialog";
import onRenderCallback from "../reducer/onRenderCallback";

const Layout = () => {
  const location = useLocation();
  const [showCoupons, setShowCoupons] = React.useState(false);

  React.useEffect(() => {
    if (
      location.pathname === "/" ||
      location.pathname === "/home"
    ) {
      setShowCoupons(true);
    } else {
      setShowCoupons(false);
    }
  }, [location.pathname]);

  return (
    <div className="App">
      <Profiler id="Header" onRender={onRenderCallback}>
        <Header />
      </Profiler>
      <main>
        <Outlet />
      </main>
      <Footer />
      {showCoupons && <COUPONSDialog show={showCoupons} setShow={setShowCoupons} />}
    </div>
  );
};

export default Layout;