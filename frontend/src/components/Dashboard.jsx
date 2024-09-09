import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>DSAI</h2>
      <h3>Project Name:</h3>
      <ul className={styles.tools_container}>
        <li>
          <button onClick={() => navigate("/data")}>DATA</button>
        </li>
        <li>
          <button onClick={() => navigate("/trainning-model")}>
            TRAIN MODEL
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/predictive-model")}>
            PREDICT MODEL
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/analytics")}>ANALYTICS</button>
        </li>
        <li>
          <button onClick={() => navigate("/deploy")}>DEPLOY</button>
        </li>
      </ul>
    </div>
  );
};

export default Dashboard;
