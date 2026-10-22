const express = require("express");
const router = express.Router();

const {
  getMyApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const {
  applicationIdValidation,
  updateApplicationStatusValidation,
} = require("../middleware/applicationValidator/applicationValidation");

const validationResultHandler = require("../middleware/resultHandlerValidator/validationResultHandler");

// Job seeker: melihat lamaran miliknya
router.get(
  "/mine",
  authMiddleware,
  authorizationMiddleware("job_seeker"),
  getMyApplications,
);

// Recruiter: memperbarui status lamaran
router.put(
  "/:id",
  authMiddleware,
  authorizationMiddleware("recruiter"),
  applicationIdValidation,
  updateApplicationStatusValidation,
  validationResultHandler,
  updateApplicationStatus,
);

module.exports = router;
