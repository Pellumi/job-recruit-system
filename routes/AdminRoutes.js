const express = require("express");
const {
  getAllJobs,
  getAllUsers,
  getAllApp,
  updateApplication,
  deleteApplication,
  updateUser,
  deleteUser,
  getApplication,
  getUser,
  getJob,
  updateJob,
  deleteJob,
  getAllCompanyApp,
  getAllCompanies,
  getCompanyDetails,
  getAllApplicants,
} = require("../controllers/AdminControllers");
const { isAuthenticated, authorizationRoles } = require("../middlewares/auth");
const {
  applicationIdValidator,
  validateHandler,
  userIdValidator,
  JobIdValidator,
} = require("../middlewares/validators");
const router = express.Router();

router
  .route("/admin/allJobs")
  .get(isAuthenticated, authorizationRoles("admin"), getAllJobs);
router.route("/admin/allUsers").get(getAllUsers);
router.route("/admin/allApplicants").get(getAllApplicants);
router.route("/admin/allCompanies").get(getAllCompanies);
router.route("/admin/getCompany/:id").get(getCompanyDetails);
router
  .route("/admin/allApp")
  .get(isAuthenticated, authorizationRoles("admin"), getAllApp);

router
  .route("/admin/allCompanyApp")
  .get(
    isAuthenticated,
    authorizationRoles("admin", "company"),
    getAllCompanyApp
  );

router
  .route("/admin/getApplication/:id")
  .get(
    isAuthenticated,
    authorizationRoles("admin", "company"),
    applicationIdValidator(),
    validateHandler,
    getApplication
  );
router
  .route("/admin/updateApplication/:id")
  .put(
    isAuthenticated,
    authorizationRoles("admin", "company"),
    applicationIdValidator(),
    validateHandler,
    updateApplication
  );
router
  .route("/admin/deleteApplication/:id")
  .delete(
    isAuthenticated,
    authorizationRoles("admin", "company"),
    applicationIdValidator(),
    validateHandler,
    deleteApplication
  );

router
  .route("/admin/getUser/:id")
  .get(
    isAuthenticated,
    authorizationRoles("admin"),
    userIdValidator(),
    validateHandler,
    getUser
  );
router.route("/admin/updateUser/:id").put(updateUser);
router
  .route("/admin/deleteUser/:id")
  .delete(
    isAuthenticated,
    authorizationRoles("admin"),
    userIdValidator(),
    validateHandler,
    deleteUser
  );

router
  .route("/admin/getJob/:id")
  .get(
    isAuthenticated,
    authorizationRoles("admin", "company"),
    JobIdValidator(),
    validateHandler,
    getJob
  );
router
  .route("/admin/updateJob/:id")
  .put(
    isAuthenticated,
    authorizationRoles("admin", "company"),
    JobIdValidator(),
    validateHandler,
    updateJob
  );
router
  .route("/admin/deleteJob/:id")
  .delete(
    isAuthenticated,
    authorizationRoles("admin", "company"),
    JobIdValidator(),
    validateHandler,
    deleteJob
  );

module.exports = router;
