import ProjectSelection from "../components/ProjectSelection";
import styles from "./ProjectsPage.module.css";

const ProjectsPage = () => {
  return (
    <div className={styles.project_page}>
      <ProjectSelection />
    </div>
  );
};

export default ProjectsPage;
