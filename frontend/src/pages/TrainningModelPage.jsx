import { useState } from "react";
import TrainningModelForm from "../components/TrainningModelForm";
import TrainningResults from "../components/TrainningResults";
import styles from "./TrainningModelPage.module.css";

const TrainningModelPage = () => {
  const [resultArrived, setResultArrived] = useState(false);
  const [resultFormat, setResultFormat] = useState("");
  const [resultData, setResultData] = useState({});

  const handelResultFormat = (e) => {
    setResultFormat(e.target.value);
  };

  const handelResultData = (data) => {
    setResultArrived(true);
    setResultData(data);
  };

  return (
    <div className={styles.main}>
      <div className={styles.trainningModelPage}>
        <div className={styles.form_container}>
          <TrainningModelForm handelResultData={handelResultData} />
        </div>
        <div className={styles.result_container}>
          {resultArrived && (
            <div className={styles.show_res_btn}>
              <label htmlFor="show_res_btn">Choose result format:</label>
              <select
                id="show_res_btn"
                value={resultFormat}
                onChange={handelResultFormat}
              >
                <option value="">--show results--</option>
                <option value="text">Text results</option>
                <option value="images">Visualize images</option>
              </select>
            </div>
          )}
          <TrainningResults
            resultData={resultData}
            resultFormat={resultFormat}
          />
        </div>
      </div>
    </div>
  );
};

export default TrainningModelPage;
