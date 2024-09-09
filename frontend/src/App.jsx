import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const HomePage = lazy(() => import("./pages/HomePage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const DataPage = lazy(() => import("./pages/DataPage"));
const TrainningModelPage = lazy(() => import("./pages/TrainningModelPage"));
const PredictiveModelPage = lazy(() => import("./pages/PredictiveModelPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const DeployPage = lazy(() => import("./pages/DeployPage"));

import SpinnerFullPage from "./components/SpinnerFullPage";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<SpinnerFullPage />}>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="data" element={<DataPage />} />
            <Route path="trainning-model" element={<TrainningModelPage />} />
            <Route path="predictive-model" element={<PredictiveModelPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="deploy" element={<DeployPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: { duration: 3000 },
          error: { duration: 5000 },
          styles: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "grey",
            color: "lightGrey",
          },
        }}
      />
    </>
  );
};

export default App;
