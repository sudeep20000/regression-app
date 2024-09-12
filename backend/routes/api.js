const express = require("express");
const multer = require("multer");

const {
  runAnalysis,
  runPredictiveForSingle,
  runPredictiveForMultiple,
  runAalytics,
} = require("../controllers/api");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.route("/run-analysis").post(runAnalysis);
router.route("/run-predictive-single").post(runPredictiveForSingle);
router
  .route("/run-predictive-multiple")
  .post(upload.single("selectedDataset"), runPredictiveForMultiple);

router.route("/run-analytics").get(runAalytics);

module.exports = router;
