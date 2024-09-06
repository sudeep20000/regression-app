import { useState } from "react";
import PredictiveModelForm from "../components/PredictiveModelForm";
import PredictiveResults from "../components/PredictiveResults";
import styles from "./PredictiveModelPage.module.css";

const PredictiveModelPage = () => {
  const [resultData, setResultData] = useState({});

  const handelResultData = (data) => {
    setResultData(data);
  };

  return (
    <div className={styles.predictiveModelPage}>
      <PredictiveModelForm handelResultData={handelResultData} />
      <PredictiveResults resultData={resultData} />
    </div>
  );
};

export default PredictiveModelPage;
