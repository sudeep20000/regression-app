const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const { spawn } = require("child_process");
const { StatusCodes } = require("http-status-codes");
const {
  BACKEND_BASE_PATH,
  DATA_FOLDER_PATH,
  PYTHON_SCRIPT_PATH,
} = require("../config");

let best_c;
let x2_power;

const runAnalysis = async (req, res) => {
  const { projectName, selectedDataset, independentVars, dependentVar } =
    req.body;

  if (
    !projectName ||
    !selectedDataset ||
    !independentVars.length ||
    !dependentVar
  )
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please select all fields" });

  // Path to your Excel file
  const EXCEL_FILE_PATH = path.join(
    DATA_FOLDER_PATH,
    `${selectedDataset}.xlsx`
  );

  let script;
  if (selectedDataset === "battery_data") script = `mvra.py`;
  else script = `regression_analysis.py`;

  const SCRIPT_FILE_PATH = path.join(PYTHON_SCRIPT_PATH, script);

  // Define output directory
  const outputDir = path.join(BACKEND_BASE_PATH, "outputs");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const scriptArgs = [
    EXCEL_FILE_PATH,
    JSON.stringify(independentVars),
    dependentVar,
  ];

  // Execute Python script and wait for the result
  const { best_coefficients, best_x2_power } = await new Promise(
    (resolve, reject) => {
      // Spawn Python process
      const pythonProcess = spawn("python", [SCRIPT_FILE_PATH, ...scriptArgs]);

      let output;

      pythonProcess.stdout.on("data", (data) => {
        output = JSON.parse(data.toString());
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`Python script error: ${data}`);
        reject(new Error(`Python script error: ${data}`));
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: code });
        } else {
          resolve(output);
        }
      });
    }
  );

  best_c = best_coefficients;
  x2_power = best_x2_power;

  // Paths where the script saves the files
  // const plot_3d_Path = path.join(outputDir, "3d_plot.png");
  const plot_3d_Path = "3d_plot.png";

  const result_Path = path.join(outputDir, "results.txt");

  // const degree_vs_metrics_Path = path.join(outputDir, "degree_vs_metrics.png");
  const degree_vs_metrics_Path = "degree_vs_metrics.png";

  const plotsDir = path.join(outputDir, "plots");

  // Read the result file
  const resultText = fs.readFileSync(result_Path, "utf-8");

  // Collect all plots from the plots directory
  const plotImages = fs
    .readdirSync(plotsDir)
    .map((file) => path.join("plots", file));

  res.status(StatusCodes.OK).json({
    message: "Analysis completed",
    plot_3d_Path,
    resultText,
    degree_vs_metrics_Path,
    plotImages,
  });
};

const runPredictiveForSingle = async (req, res) => {
  const { rotorRadius, rpm, windVelocity, windDirection } = req.body;

  console.table(req.body);

  if (!rotorRadius || !rpm || !windVelocity || !windDirection)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please select all fields" });

  const SCRIPT_FILE_PATH = path.join(PYTHON_SCRIPT_PATH, "singleDataPoint.py");

  let R = rotorRadius;
  let N = rpm;
  let V = windVelocity;
  let W = (2 * Math.PI * N) / 60;

  const tip_speed_ratio = (W * R) / V;
  const pitch_angle = 5;

  const scriptArgs = [
    tip_speed_ratio,
    pitch_angle,
    x2_power,
    JSON.stringify(best_c),
  ];

  // Execute Python script and wait for the result
  const { cp_value } = await new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", [SCRIPT_FILE_PATH, ...scriptArgs]);

    let output;

    pythonProcess.stdout.on("data", (data) => {
      output = JSON.parse(data.toString());
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python script error: ${data}`);
      reject(new Error(`Python script error: ${data}`));
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: code });
      } else {
        resolve(output);
      }
    });
  });

  let airDensity = 1.225; // Kg/m^3

  const mechanical_power =
    (1 / 2) *
    airDensity *
    Math.PI *
    rotorRadius ** 2 *
    windVelocity ** 3 *
    cp_value;

  const valuesObj = {
    R,
    N,
    V,
    windDirection,
    tip_speed_ratio: tip_speed_ratio.toFixed(2),
    pitch_angle,
    cp: cp_value.toFixed(2),
    mech_power: mechanical_power.toFixed(2),
  };

  res
    .status(StatusCodes.ACCEPTED)
    .json({ msg: "Prediction completed", valuesObj });
};

const runPredictiveForMultiple = async (req, res) => {
  console.table(req.body);

  const { rotorRadius, rpm } = req.body;
  const selectedDataset = req.file;

  if (!selectedDataset || !rotorRadius || !rpm) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please select all fields" });
  }

  // Read the uploaded Excel file
  const workbook = xlsx.readFile(selectedDataset.path);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);

  // Extract specific properties from each object
  const filteredData = data.map((item) => {
    return {
      windSpeed: parseFloat(item["Wind Speed (m/s)"].toFixed(2)),
      windDirection: item["Wind Direction"],
    };
  });

  const R = parseFloat(rotorRadius);
  const N = parseInt(rpm);
  const W = (2 * Math.PI * N) / 60;

  filteredData.map((dataObj) => {
    dataObj.angulerSpeed = parseFloat(W.toFixed(2));
    dataObj.rotorRadius = R;
    dataObj.pitch_angle = 5;
    return dataObj;
  });

  const TEMP_DIR = path.join(BACKEND_BASE_PATH, "temp");

  // Ensure the temp directory exists
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
  }

  // Write data to a temporary JSON file in the project's temp directory
  const tempDataFile = path.join(TEMP_DIR, "form_data.json");
  fs.writeFileSync(tempDataFile, JSON.stringify(filteredData));

  const SCRIPT_FILE_PATH = path.join(
    PYTHON_SCRIPT_PATH,
    "multipleDataPoint.py"
  );

  const scriptArgs = [tempDataFile, x2_power, JSON.stringify(best_c)];

  // Execute Python script and wait for the result
  await new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", [SCRIPT_FILE_PATH, ...scriptArgs]);

    let output = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python script error: ${data}`);
      reject(new Error(`Python script error: ${data}`));
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: code });
      }
      try {
        if (output.trim()) {
          // Parse output if there is any and it is JSON
          resolve(JSON.parse(output));
        } else {
          resolve(null); // Resolve with null if there's no output
        }
      } catch (err) {
        reject(new Error(`Failed to parse Python output: ${err.message}`));
      }
    });
  });

  res.status(StatusCodes.OK).json({ msg: "Prediction completed" });
};

module.exports = {
  runAnalysis,
  runPredictiveForSingle,
  runPredictiveForMultiple,
};
