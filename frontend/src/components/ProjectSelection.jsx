import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./ProjectSelection.module.css";
import { setCurrProjectname } from "../features/ProjectData/ProjectSlice";

const ProjectSelection = () => {
  const [view, setView] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([
    "Project 1",
    "Project 2",
    "Project 3",
  ]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNewProject = () => {
    setView("new");
  };

  const handleOpenProject = () => {
    setView("open");
  };

  const handleProjectNameChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleContinue = () => {
    dispatch(setCurrProjectname(projectName));
    navigate("/dashboard");
  };

  return (
    <div className={styles.project}>
      <h2>Select an Option</h2>
      <div className={styles.buttonGroup}>
        <button onClick={handleNewProject} className={styles.button}>
          New Project
        </button>
        <button onClick={handleOpenProject} className={styles.button}>
          Open a Project
        </button>
      </div>

      {view === "new" && (
        <div className={styles.inputField}>
          <h3>Create New Project</h3>
          <input
            type="text"
            placeholder="Enter project name"
            value={projectName}
            onChange={handleProjectNameChange}
          />
        </div>
      )}

      {view === "open" && (
        <div className={styles.projectList}>
          <h3>Projects</h3>
          <ul>
            {projects.map((project, index) => (
              <li key={index}>{project}</li>
            ))}
          </ul>
        </div>
      )}

      {projectName.length > 3 && (
        <button onClick={handleContinue} className={styles.continueButton}>
          Continue
        </button>
      )}
    </div>
  );
};

export default ProjectSelection;
