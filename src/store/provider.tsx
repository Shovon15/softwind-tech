"use client";
import { Provider } from "react-redux";
import { store } from ".";
import GoogleAnalytics from "@/lib/analytics/googleAnalytics";
// import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // useSmoothScroll({ delay: 5000, duration: 5000 });
  return (
    <Provider store={store}>
      {children}
      {/* <GoogleAnalytics GA_MEASUREMENT_ID={"G-PX3YHBREZL"} /> */}
    </Provider>
  );
}
