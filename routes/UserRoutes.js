const express = require("express");
const {
  register,
  login,
  isLogin,
  me,
  changePassword,
  updateProfile,
  deleteAccount,
  registerCompany,
  updateCompanyProfile,
} = require("../controllers/UserControllers");
const { isAuthenticated } = require("../middlewares/auth");
const {
  registerValidator,
  validateHandler,
  loginValidator,
  changePasswordValidator,
  updateProfileValidator,
  deleteAccountValidator,
} = require("../middlewares/validators");
const router = express.Router();

router.route("/register").post(registerValidator(), validateHandler, register);
router.route("/login").post(loginValidator(), validateHandler, login);
router.route("/isLogin").get(isAuthenticated, isLogin);
router.route("/me").get(isAuthenticated, me);
router
  .route("/changePassword")
  .put(
    isAuthenticated,
    changePasswordValidator(),
    validateHandler,
    changePassword
  );
router
  .route("/updateProfile")
  .put(
    isAuthenticated,
    updateProfileValidator(),
    validateHandler,
    updateProfile
  );
router
  .route("/deleteAccount")
  .put(
    isAuthenticated,
    deleteAccountValidator(),
    validateHandler,
    deleteAccount
  );

router.route("/register-company").post(registerCompany);
router
  .route("/update-company-profile")
  .put(isAuthenticated, updateCompanyProfile);

module.exports = router;
