import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.homepage}>
      <h1>DSAi</h1>
      <h3>AI/Machine Learning Application Development Platform</h3>
      <button onClick={() => navigate("dashboard")}>Get Started</button>
    </div>
  );
};

export default Home;
