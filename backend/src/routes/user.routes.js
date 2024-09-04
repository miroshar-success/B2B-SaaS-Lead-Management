const express = require("express");
const { body, param } = require("express-validator");
const userController = require("../controllers/user.controller");
const validateRequest = require("../middleware/validateRequest");
const auth = require("../middleware/auth");

const router = express.Router();

// Create a new user
router.post("/register", validateRequest, userController.create);

// User login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  userController.login
);

// User logout
router.post("/logout", userController.logout);

// Retrieve all users (admin or super_admin only)
router.get(
  "/",
  // userController.authenticate,
  // userController.authorize('admin', 'super_admin'),
  userController.findAll
);

// Retrieve a single user by ID (admin or super_admin only)
router.get(
  "/:id",
  userController.authenticate,
  userController.authorize("admin", "super_admin"),
  param("id").isMongoId().withMessage("Invalid user ID"),
  validateRequest,
  userController.findOne
);

// Update a user by ID (admin or super_admin only)
router.put(
  "/:id",
  userController.authenticate,
  userController.authorize("admin", "super_admin"),
  param("id").isMongoId().withMessage("Invalid user ID"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validateRequest,
  userController.update
);

// Update user role (admin or super_admin only)
router.put(
  "/:id/role",
  userController.authenticate,
  userController.authorize("admin", "super_admin"),
  param("id").isMongoId().withMessage("Invalid user ID"),
  body("role")
    .isIn(["user", "admin", "super_admin"])
    .withMessage("Invalid role"),
  validateRequest,
  userController.updateRole
);

router.post("/leads/emails", auth, userController.accessEmails);
router.post("/leads/phones", auth, userController.accessPhones);

// Delete a user by ID (admin or super_admin only)
router.delete(
  "/:id",
  userController.authenticate,
  userController.authorize("admin", "super_admin"),
  param("id").isMongoId().withMessage("Invalid user ID"),
  validateRequest,
  userController.delete
);

router.post("/validate", validateRequest, userController.validate);

module.exports = router;
