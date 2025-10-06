const { body, validationResult } = require("express-validator");

// Common function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

//  Registration validation
const validateRegister = [
  body("name").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  handleValidationErrors,
];

//  Login validation
const validateLogin = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

//  Message validation
const validateMessage = [
  body("receiverId").notEmpty().withMessage("Receiver ID is required"),
  body("content").notEmpty().withMessage("Message content is required"),
  body("messageType")
    .isIn(["Text", "Image", "Video"])
    .withMessage("Message type must be Text, Image, or Video"),
  handleValidationErrors,
];

//  Notification validation
const validateNotification = [
  body("userId").notEmpty().withMessage("User ID is required"),
  body("type")
    .isIn(["Match Request", "Session Reminder", "Payment Alert", "Message"])
    .withMessage("Invalid notification type"),
  body("message").notEmpty().withMessage("Notification message is required"),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateMessage,
  validateNotification,
};
