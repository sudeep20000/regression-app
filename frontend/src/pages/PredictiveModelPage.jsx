import { useState } from "react";
import PredictiveModelForm from "../components/PredictiveModelForm";
import PredictiveResults from "../components/PredictiveResults";
import styles from "./PredictiveModelPage.module.css";
import BASE_URL from "../../service/helper";
import axios from "axios";
import toast from "react-hot-toast";

const PredictiveModelPage = () => {
  const [tab, setTab] = useState("single");
  const [resultArrived, setResultArrived] = useState(false);
  const [resultFormat, setResultFormat] = useState("");
  const [resultData, setResultData] = useState(null);

  const handelSetTab = (value) => {
    setTab(value);
  };

  const handelResultData = (data) => {
    setResultArrived(true);
    setResultData(data);
  };

  const handelResultFormat = (e) => {
    setResultFormat(e.target.value);
  };

  const handelAnalytics = async (e) => {
    e.preventDefault();
    setTab("analytics");
    try {
      const loadingToastId = toast.loading("Please wait");
      const { data } = await axios.get(`${BASE_URL}/api/run-analytics`);
      toast.dismiss(loadingToastId);
      toast.success(data.msg);
    } catch (e) {
      toast.dismiss();
      toast.error(e.response.data.msg || e.message);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.predictiveModelPage}>
        <div className={styles.form_container}>
          <PredictiveModelForm
            handelResultData={handelResultData}
            tab={tab}
            handelSetTab={handelSetTab}
          />
        </div>
        <div className={styles.result_container}>
          {resultArrived && (
            <select value={resultFormat} onChange={handelResultFormat}>
              <option value="">--show results--</option>
              <option value="text">Text results</option>
              <option value="table">Table Format</option>
            </select>
          )}
          <button onClick={handelAnalytics}>Analytics</button>
          <PredictiveResults tab={tab} resultData={resultData} />
        </div>
      </div>
    </div>
  );
};

export default PredictiveModelPage;
