import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TrainningModelForm from "../components/TrainningModelForm";
import TrainningResults from "../components/TrainningResults";
import styles from "./TrainningModelPage.module.css";

const TrainningModelPage = () => {
  const [resultArrived, setResultArrived] = useState(false);
  const [resultFormat, setResultFormat] = useState("");
  const [resultData, setResultData] = useState({});

  const navigate = useNavigate();

  const handelResultFormat = (e) => {
    setResultFormat(e.target.value);
  };

  const handelResultData = (data) => {
    setResultArrived(true);
    setResultData(data);
  };

  return (
    <div className={styles.trainningModelPage}>
      <div className={styles.form_container}>
        <TrainningModelForm handelResultData={handelResultData} />
        {resultArrived && (
          <select value={resultFormat} onChange={handelResultFormat}>
            <option value="">--show results--</option>
            <option value="text">Text results</option>
            <option value="images">Visualize images</option>
          </select>
        )}
        {resultArrived && (
          <div>
            <button onClick={() => navigate("/predictive-model")}>
              Go to predictive model
            </button>
          </div>
        )}
      </div>
      <TrainningResults resultData={resultData} resultFormat={resultFormat} />
    </div>
  );
};

export default TrainningModelPage;
