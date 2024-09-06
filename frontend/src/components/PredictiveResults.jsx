import styles from "./PredictiveResults.module.css";

const PredictiveResults = ({ resultData }) => {
  return (
    <div className={styles.result_container}>
      {resultData.R && (
        <>
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
        </>
      )}
    </div>
  );
};

export default PredictiveResults;
