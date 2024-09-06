import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import BASE_URL from "../../service/helper";
import styles from "./PredictiveModelForm.module.css";

const PredictiveModelForm = ({ handelResultData, tab, handelSetTab }) => {
  const [isLoading, setIsloading] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [rotorRadius, setRotorRadius] = useState("");
  const [rpm, setRpm] = useState("");
  const [windVelocity, setWindVelocity] = useState("");
  const [windDirection, setWindDirection] = useState("");

  const handleFileChange = (e) => {
    setSelectedDataset(e.target.files[0]);
  };

  const handleRotorRadius = (e) => {
    setRotorRadius(e.target.value);
  };

  const handleRpm = (e) => {
    setRpm(e.target.value);
  };

  const handleWindVelocity = (e) => {
    setWindVelocity(e.target.value);
  };

  const handleWindDirection = (e) => {
    setWindDirection(e.target.value);
  };

  const handleSubmitForSingle = async (e) => {
    e.preventDefault();

    if (!rotorRadius || !rpm || !windVelocity || !windDirection) {
      toast.error("Please select all the fields");
      return;
    }

    let formData;
    formData = {
      rotorRadius: parseFloat(rotorRadius),
      rpm: parseInt(rpm),
      windVelocity: parseFloat(windVelocity),
      windDirection: windDirection,
    };

    try {
      setIsloading(true);
      const loadingToastId = toast.loading("Please wait");
      const {
        data: { msg, valuesObj },
      } = await axios.post(`${BASE_URL}/api/run-predictive-single`, formData, {
        timeout: 120000,
      });
      toast.dismiss(loadingToastId);
      toast.success(msg);
      handelResultData(valuesObj);
    } catch (e) {
      toast.dismiss();
      toast.error(e.response.data.msg || e.message);
    } finally {
      setIsloading(false);
    }
  };

  const handleSubmitForMultiple = async (e) => {
    e.preventDefault();

    if (!selectedDataset || !rotorRadius || !rpm) {
      toast.error("Please select all the fields");
      return;
    }

    let formData;
    formData = {
      selectedDataset,
      rotorRadius: parseFloat(rotorRadius),
      rpm: parseInt(rpm),
    };

    try {
      setIsloading(true);
      const loadingToastId = toast.loading("Please wait");
      const {
        data: { msg, resultData },
      } = await axios.post(
        `${BASE_URL}/api/run-predictive-multiple`,
        formData,
        {
          timeout: 120000,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.dismiss(loadingToastId);
      toast.success(msg);
      handelResultData(resultData);
    } catch (e) {
      toast.dismiss();
      if (e.code === "ECONNABORTED") {
        toast.error("Request timed out");
      } else {
        toast.error(e.message || e.response.data.msg);
      }
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className={styles.form_container}>
      <div className={styles.predictionTab}>
        <button onClick={() => handelSetTab("single")}>
          Single data point
        </button>
        <button onClick={() => handelSetTab("multiple")}>
          Multiple data point
        </button>
      </div>
      {tab === "single" && (
        <form onSubmit={handleSubmitForSingle} className={styles.form}>
          <h2>Predictive model for {tab} data point</h2>

          <div>
            <label>Rotor Radius:</label>
            <input
              type="text"
              value={rotorRadius}
              onChange={handleRotorRadius}
              disabled={isLoading}
            />
            <span>(m)</span>
          </div>

          <div>
            <label>RPM:</label>
            <input
              type="text"
              value={rpm}
              onChange={handleRpm}
              disabled={isLoading}
            />
          </div>

          <div>
            <label>Wind Velocity:</label>
            <input
              type="text"
              value={windVelocity}
              onChange={handleWindVelocity}
              disabled={isLoading}
            />
            <span>(m/s)</span>
          </div>

          <div>
            <label>Wind Direction:</label>
            <select
              type="text"
              value={windDirection}
              onChange={handleWindDirection}
              disabled={isLoading}
            >
              <option value="">--select--</option>
              <option value="North">N</option>
              <option value="North-northeast">NNE</option>
              <option value="North-east">NE</option>
              <option value="East-northeast">ENE</option>
              <option value="East">E</option>
              <option value="East-southeast">ESE</option>
              <option value="South-east">SE</option>
              <option value="South-southeast">SSE</option>
              <option value="South">S</option>
              <option value="South-southwest">SSW</option>
              <option value="South-west">SW</option>
              <option value="West-southwest">WSW</option>
              <option value="West">W</option>
              <option value="West-northwest">WNW</option>
              <option value="North-west">NW</option>
              <option value="North-northwest">NNW</option>
            </select>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Run"}
          </button>
        </form>
      )}

      {tab === "multiple" && (
        <form onSubmit={handleSubmitForMultiple} className={styles.form}>
          <h2>Predictive model for {tab} data point</h2>

          <div>
            <label>Select Input File:</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".xlsx, .xls"
            />
            {selectedDataset && (
              <div>
                <p>File Name: {selectedDataset.name}</p>
              </div>
            )}
          </div>

          <div>
            <label>Rotor Radius:</label>
            <input
              type="text"
              value={rotorRadius}
              onChange={handleRotorRadius}
              disabled={isLoading}
            />
            <span>(m)</span>
          </div>

          <div>
            <label>RPM:</label>
            <input
              type="text"
              value={rpm}
              onChange={handleRpm}
              disabled={isLoading}
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Run"}
          </button>
        </form>
      )}
    </div>
  );
};

export default PredictiveModelForm;
