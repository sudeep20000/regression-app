import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import BASE_URL from "../../service/helper";
import styles from "./TrainningModelForm.module.css";
import { useSelector } from "react-redux";

const TrainningModelForm = ({ handelResultData }) => {
  const [isLoading, setIsloading] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState("");
  const [numVariables, setNumVariables] = useState("");
  const [independentVars, setIndependentVars] = useState([]);
  const [dependentVar, setDependentVar] = useState("");

  const { current_project } = useSelector((store) => store.project);

  const handleNumVariablesChange = (e) => {
    const value = parseInt(e.target.value);
    setNumVariables(value);
    setIndependentVars(new Array(value).fill(""));
  };

  const handleIndependentVarChange = (index, value) => {
    const newVars = [...independentVars];
    newVars[index] = value;
    setIndependentVars(newVars);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      selectedDataset,
      independentVars,
      dependentVar,
    };

    if (
      !formData.selectedDataset ||
      !formData.independentVars.length ||
      !formData.dependentVar
    ) {
      toast.error("Please select all the fields");
      return;
    }
    try {
      setIsloading(true);
      const loadingToastId = toast.loading("Please wait");
      const { data } = await axios.post(
        `${BASE_URL}/api/run-analysis`,
        formData
      );
      handelResultData(data);
      toast.dismiss(loadingToastId);
      toast.success(data.message);
    } catch (e) {
      toast.dismiss();
      toast.error(e.response.data.msg || e.message);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <span className={styles.project_name}>
        Project Name: {current_project}
      </span>
      <span className={styles.heading}>Training model</span>

      <div className={styles.dataset}>
        <label htmlFor="dataset">Select Dataset:</label>
        <select
          id="dataset"
          value={selectedDataset}
          onChange={(e) => setSelectedDataset(e.target.value)}
          disabled={isLoading}
        >
          <option value="">-- Select --</option>
          <option value="battery_data">Battery Data</option>
          <option value="wind_turbine_data">Wind Turbine Data</option>
        </select>
      </div>

      <div className={styles.independent_num}>
        <label htmlFor="independent_num">
          Number of Independent Variables:
        </label>
        <input
          id="independent_num"
          type="number"
          value={numVariables}
          onChange={handleNumVariablesChange}
          disabled={isLoading}
        />
      </div>
      {independentVars.map((varName, index) => (
        <div className={styles.independent_var} key={index}>
          <label htmlFor={`independent_var${index}`}>
            Select Independent Variable X{index + 1}:
          </label>
          <select
            id={`independent_var${index}`}
            value={varName}
            onChange={(e) => handleIndependentVarChange(index, e.target.value)}
            disabled={isLoading}
          >
            {selectedDataset === "battery_data" && (
              <>
                <option value="">-- Select --</option>
                <option value="Time">Time</option>
                <option value="Env Temp">Environment Temperature</option>
              </>
            )}
            {selectedDataset === "wind_turbine_data" && (
              <>
                <option value="">-- Select --</option>
                <option value="Tip Speed Ratio">Tip Speed Ratio</option>
                <option value="Angle of Attack">Angle of Attack</option>
              </>
            )}
          </select>
        </div>
      ))}

      <div className={styles.dependent_var}>
        <label htmlFor="dependent_var">Dependent Variable Y:</label>
        <select
          id="dependent_var"
          value={dependentVar}
          onChange={(e) => setDependentVar(e.target.value)}
          disabled={isLoading}
        >
          {selectedDataset === "battery_data" && (
            <>
              <option value="">-- Select --</option>
              <option value="Voltage">Voltage</option>
            </>
          )}
          {selectedDataset === "wind_turbine_data" && (
            <>
              <option value="">-- Select --</option>
              <option value="Cp">Power of Coefficient</option>
            </>
          )}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={styles.training_submit_btn}
      >
        {isLoading ? "Loading..." : "Run"}
      </button>
    </form>
  );
};

export default TrainningModelForm;
