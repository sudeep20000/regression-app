import styles from "./PredictiveResults.module.css";

const fixKeyName = (str) =>
  str
    .split("_")
    .map((word) => word.toUpperCase())
    .join(" ");

const PredictiveResults = ({ tab, resultData }) => {
  if (resultData === null) return;

  return (
    <div className={styles.result_container}>
      {tab === "single" && !Array.isArray(resultData) && (
        <div className={styles.singleDataResult}>
          <p className={styles.para}>
            <span>Rotor Radius :</span> {resultData.R} (m)
          </p>
          <p className={styles.para}>
            <span>RPM :</span> {resultData.N}
          </p>
          <p className={styles.para}>
            <span>Wind Velocity :</span> {resultData.V} (m/s)
          </p>
          <p className={styles.para}>
            <span>Wind Direction :</span> {resultData.windDirection}
          </p>
          <p className={styles.para}>
            <span>Tip Speed Ratio :</span> {resultData.tip_speed_ratio}
          </p>
          <p className={styles.para}>
            <span>Pitch Angle :</span> {resultData.pitch_angle}
          </p>
          <p className={styles.para}>
            <span>Power Of Coefficient :</span> {resultData.cp}
          </p>
          <p className={styles.para}>
            <span>The Power :</span> {resultData.mech_power}
          </p>
        </div>
      )}
      {tab === "multiple" && Array.isArray(resultData) && (
        <div className={styles.multiDataResult}>
          {resultData.map((obj, i) => (
            <div key={i} className={styles.data_div}>
              {Object.entries(obj).map((ele, i) => (
                <div key={i} className={styles.data_property}>
                  <span className={styles.key_name}>{fixKeyName(ele[0])}:</span>
                  <span className={styles.value_name}>{ele[1]}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PredictiveResults;
