import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { current_project } = useSelector((store) => store.project);

  return (
    <div className={styles.dashboard}>
      <p className={styles.title}>DSAI</p>
      <p className={styles.project_name}>
        <span className={styles.label}>Project Name:</span>
        <span className={styles.value}>{current_project}</span>
      </p>
      <ul className={styles.tools_container}>
        <li className={styles.dashboard_btn_container}>
          <button
            className={styles.dashboard_btn}
            onClick={() => navigate("/data")}
          >
            DATA
          </button>
        </li>
        <li className={styles.dashboard_btn_container}>
          <button
            className={styles.dashboard_btn}
            onClick={() => navigate("/trainning-model")}
          >
            TRAIN MODEL
          </button>
        </li>
        <li className={styles.dashboard_btn_container}>
          <button
            className={styles.dashboard_btn}
            onClick={() => navigate("/predictive-model")}
          >
            PREDICT MODEL
          </button>
        </li>
        <li className={styles.dashboard_btn_container}>
          <button
            className={styles.dashboard_btn}
            onClick={() => navigate("/evaluate")}
          >
            EVALUATE
          </button>
        </li>
        <li className={styles.dashboard_btn_container}>
          <button
            className={styles.dashboard_btn}
            onClick={() => navigate("/analytics")}
          >
            ANALYTICS
          </button>
        </li>
        <li className={styles.dashboard_btn_container}>
          <button
            className={styles.dashboard_btn}
            onClick={() => navigate("/deploy")}
          >
            DEPLOY
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Dashboard;
