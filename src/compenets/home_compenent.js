import AdsSection from "./ads_section";
import NavigationTaps from "./Navigation/NavigationTaps";
import React, { Profiler } from "react";
import onRenderCallback from "../reducer/onRenderCallback";

const MoreLovesProductSection = React.lazy(() => import("./moreLovesProducts"));
export default function Home() {
  return (
    <div className="">
      <AdsSection />
      {/* <OffersSection /> */}
      <Profiler id="NavigationTaps" onRender={onRenderCallback}>
        <div className="container">
          <NavigationTaps />
        </div>
      </Profiler>

      {/* {<BrandAdsSection />} */}
      <MoreLovesProductSection />
    </div>
  );
}
