import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.home}>
      <div className={styles.content_div}>
        <p className={styles.project_name}>DSAi</p>
        <p className={styles.title}>
          AI/Machine Learning Application Development Platform
        </p>
      </div>

      <div className={styles.button_div}>
        <button
          onClick={() => navigate("projects")}
          className={styles.get_start_btn}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
