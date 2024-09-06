import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const TrainningModelPage = lazy(() => import("./pages/TrainningModelPage"));
const PredictiveModelPage = lazy(() => import("./pages/PredictiveModelPage"));
import HomePage from "./components/HomePage";
import SpinnerFullPage from "./components/SpinnerFullPage";

const App = () => {
  return (
    // <>
    //   <div className={styles.app}>
    //     <div className={styles.form_container}>
    //       <div className={styles.button_container}>
    //         <button
    //           onClick={toggleTrainingModel}
    //           className={styles.training}
    //           disabled={isLoading}
    //         >
    //           Training model
    //         </button>
    //         <button
    //           onClick={togglePredictiveModel}
    //           className={styles.predictive}
    //           disabled={isLoading}
    //         >
    //           Predictive model
    //         </button>
    //       </div>
    //       {showModel === "Trainning model" && (
    //         <TrainningModelForm
    //           onSubmit={handleTrainingFormSubmit}
    //           isLoading={isLoading}
    //         />
    //       )}
    //       {showModel === "Testing model" && (
    //         <PredictiveModelForm
    //           onSubmit={handlePredictiveFormSubmit}
    //           isLoading={isLoading}
    //         />
    //       )}
    //       {showModel === "Trainning model" && msg && (
    //         <select value={showresult} onChange={handelShowResults}>
    //           <option value="">--show results--</option>
    //           <option value="text">Text results</option>
    //           <option value="images">Visualize images</option>
    //         </select>
    //       )}
    //     </div>

    //     <div className={styles.result_container}>
    //       {showModel === "Trainning model" ? (
    //         <TrainningResults
    //           showresult={showresult}
    //           resultText={resultText}
    //           plotImages={plotImages}
    //           plot3d={plot3d}
    //           dvsm={dvsm}
    //         />
    //       ) : (
    //         <PredictiveResults predictiveValues={predictiveValues} />
    //       )}
    //     </div>
    //   </div>

    //   <Toaster
    //     position="top-center"
    //     gutter={12}
    //     containerStyle={{ margin: "8px" }}
    //     toastOptions={{
    //       success: { duration: 3000 },
    //       error: { duration: 3000 },
    //       styles: {
    //         fontSize: "16px",
    //         maxWidth: "500px",
    //         padding: "16px 24px",
    //         backgroundColor: "grey",
    //         color: "lightGrey",
    //       },
    //     }}
    //   />
    // </>
    <>
      <BrowserRouter>
        <Suspense fallback={<SpinnerFullPage />}>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="trainning-model" element={<TrainningModelPage />} />
            <Route path="predictive-model" element={<PredictiveModelPage />} />
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
