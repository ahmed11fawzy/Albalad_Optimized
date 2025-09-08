import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
/* import Layout from "./layout/Layout";
import AuthLayout from "./layout/AuthLayout";
import MinimalLayout from "./layout/MinimalLayout"; */

const Layout = React.lazy(() => import("./layout/Layout"));
const AuthLayout = React.lazy(() => import("./layout/AuthLayout"));
const MinimalLayout = React.lazy(() => import("./layout/MinimalLayout"));

import ErrorBoundary from "./components/ErrorBoundary";
import {
  mainLayoutRoutes,
  minimalLayoutRoutes,
  authLayoutRoutes,
  modalRoutes,
} from "./config/routeConfig";

// CSS imports
import "./css/productDetaail.css";
import "./css/moreLovesProducts.css";
import CustomLoader from "./components/CustomLoader";

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<CustomLoader />}>
          <Routes>
            {/* Routes with main layout (header + footer) */}
            <Route path="/" element={<Layout />}>
              {mainLayoutRoutes.map((route) => (
                <Route
                  key={route.path || "index"}
                  path={route.path}
                  element={<route.element />}
                  index={route.index}
                />
              ))}
            </Route>

            {/* Routes with minimal layout (logo header only) */}
            <Route path="/" element={<MinimalLayout />}>
              {minimalLayoutRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.element />}
                />
              ))}
            </Route>

            {/* Authentication routes (no header/footer) */}
            <Route path="/" element={<AuthLayout />}>
              {authLayoutRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.element />}
                />
              ))}
            </Route>

            {/* Modal routes that need special handling */}
            {modalRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.element />}
              />
            ))}
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
