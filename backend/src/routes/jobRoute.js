const express = require("express");
const router = express.Router();

const {
  getAllJobs,
  getMyJobs,
  getJobById,
  createJob,
  updateJob,
  deactivateJob,
} = require("../controllers/jobController");
const {
  createApplication,
  getJobApplications,
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const {
  applicationJobIdValidation,
  createApplicationValidation,
} = require("../middleware/applicationValidator/applicationValidation");

const {
  jobListQueryValidation,
  createJobValidation,
  updateJobValidation,
  jobIdValidation,
} = require("../middleware/jobValidator/jobValidation");

const validationResultHandler = require("../middleware/resultHandlerValidator/validationResultHandler");

router.get("/", jobListQueryValidation, validationResultHandler, getAllJobs);

router.get(
  "/mine",
  authMiddleware,
  authorizationMiddleware("recruiter"),
  getMyJobs,
);

router.post(
  "/:id/apply",
  authMiddleware,
  authorizationMiddleware("job_seeker"),
  applicationJobIdValidation,
  createApplicationValidation,
  validationResultHandler,
  createApplication,
);

router.get(
  "/:id/applicants",
  authMiddleware,
  authorizationMiddleware("recruiter"),
  applicationJobIdValidation,
  validationResultHandler,
  getJobApplications,
);

router.get("/:id", jobIdValidation, validationResultHandler, getJobById);

router.post(
  "/",
  authMiddleware,
  authorizationMiddleware("recruiter"),
  createJobValidation,
  validationResultHandler,
  createJob,
);

router.put(
  "/:id",
  authMiddleware,
  authorizationMiddleware("recruiter"),
  jobIdValidation,
  updateJobValidation,
  validationResultHandler,
  updateJob,
);

router.delete(
  "/:id",
  authMiddleware,
  authorizationMiddleware("recruiter"),
  jobIdValidation,
  validationResultHandler,
  deactivateJob,
);

module.exports = router;
