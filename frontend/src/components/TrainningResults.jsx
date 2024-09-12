import BASE_URL from "../../service/helper";
import styles from "./TrainningResults.module.css";

const TrainningResults = ({ resultData, resultFormat }) => {
  return (
    <div className={styles.results}>
      {resultFormat === "text" && (
        <div className={styles.text_res_container}>
          <pre>{resultData.resultText}</pre>
        </div>
      )}
      {resultFormat === "images" && (
        <div className={styles.images_res_container}>
          <div className={styles["3d_plot"]}>
            <img
              src={`${BASE_URL}/outputs/${resultData.plot3d}`}
              alt="plot3d"
            />
          </div>
          <div className={styles.dvsm}>
            <img src={`${BASE_URL}/outputs/${resultData.dvsm}`} alt="dvsm" />
          </div>
          <div className={styles.plots}>
            {resultData.plotImages.map((path, i) => (
              <img src={`${BASE_URL}/outputs/${path}`} alt="dvsm" key={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainningResults;
