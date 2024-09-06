const path = require("path");

const BACKEND_BASE_PATH = path.resolve(__dirname);
const DATA_FOLDER_PATH = path.join(BACKEND_BASE_PATH, "data");
const PYTHON_SCRIPT_PATH = path.join(BACKEND_BASE_PATH, "scripts");

module.exports = {
  BACKEND_BASE_PATH,
  DATA_FOLDER_PATH,
  PYTHON_SCRIPT_PATH,
};
