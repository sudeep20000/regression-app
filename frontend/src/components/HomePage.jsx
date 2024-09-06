import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.homepage}>
      <p>HomePage</p>
      <button onClick={() => navigate("trainning-model")}>Get Started</button>
    </div>
  );
};

export default HomePage;
