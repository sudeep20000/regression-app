import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import BASE_URL from "../../service/helper";
import styles from "./TrainningModelForm.module.css";

const TrainningModelForm = ({ handelResultData }) => {
  const [isLoading, setIsloading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [selectedDataset, setSelectedDataset] = useState("");
  const [numVariables, setNumVariables] = useState("");
  const [independentVars, setIndependentVars] = useState([]);
  const [dependentVar, setDependentVar] = useState("");

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
      projectName,
      selectedDataset,
      independentVars,
      dependentVar,
    };

    if (
      !formData.projectName ||
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
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1>Training model</h1>
      <div>
        <label>Project Name:</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div>
        <label>Select Dataset:</label>
        <select
          value={selectedDataset}
          onChange={(e) => setSelectedDataset(e.target.value)}
          disabled={isLoading}
        >
          <option value="">-- Select --</option>
          <option value="battery_data">Battery Data</option>
          <option value="wind_turbine_data">Wind Turbine Data</option>
        </select>
      </div>

      <div>
        <label>Number of Independent Variables:</label>
        <input
          type="number"
          value={numVariables}
          onChange={handleNumVariablesChange}
          disabled={isLoading}
        />
      </div>
      {independentVars.map((varName, index) => (
        <div key={index}>
          <label>Select Independent Variable X{index + 1}:</label>
          <select
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

      <div>
        <label>Dependent Variable Y:</label>
        <select
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

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : "Run"}
      </button>
    </form>
  );
};

export default TrainningModelForm;
