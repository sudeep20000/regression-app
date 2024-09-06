import { useState } from "react";
import PredictiveModelForm from "../components/PredictiveModelForm";
import PredictiveResults from "../components/PredictiveResults";
import styles from "./PredictiveModelPage.module.css";

const PredictiveModelPage = () => {
  const [tab, setTab] = useState("single");
  const [resultData, setResultData] = useState(null);

  const handelSetTab = (value) => {
    setTab(value);
  };

  const handelResultData = (data) => {
    setResultData(data);
  };

  return (
    <div className={styles.predictiveModelPage}>
      <PredictiveModelForm
        handelResultData={handelResultData}
        tab={tab}
        handelSetTab={handelSetTab}
      />
      <PredictiveResults tab={tab} resultData={resultData} />
    </div>
  );
};

export default PredictiveModelPage;
