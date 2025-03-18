const express = require("express");
const { isAuthenticated, authorizationRoles } = require("../middlewares/auth");
const {
  createJob,
  allJobs,
  oneJob,
  saveJob,
  getSavedJobs,
  getAllJobsByCompany,
} = require("../controllers/JobControllers");
const {
  jobValidator,
  validateHandler,
  JobIdValidator,
} = require("../middlewares/validators");
const router = express.Router();

router
  .route("/create/job")
  .post(
    isAuthenticated,
    authorizationRoles("admin", "company"),
    jobValidator(),
    validateHandler,
    createJob
  );

router.route("/jobs").get(allJobs);

router.route("/job/:id").get(JobIdValidator(), validateHandler, oneJob);

router
  .route("/saveJob/:id")
  .get(isAuthenticated, JobIdValidator(), validateHandler, saveJob);

router.route("/getSavedJobs").get(isAuthenticated, getSavedJobs);

router.route("/company/jobs").get(isAuthenticated, getAllJobsByCompany);

module.exports = router;
