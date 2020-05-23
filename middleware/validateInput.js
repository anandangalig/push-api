const { validationResult, check } = require("express-validator");

module.exports = (fieldsToValidate = []) => {
  const validations = fieldsToValidate.map((field) => {
    switch (field) {
      case "password":
      case "newPassword":
      case "newPasswordConfirm":
        return check(`${field}`).isLength({ min: 8 });
      case "email":
        return check("email").isEmail().normalizeEmail();
      default:
        break;
    }
  });

  validations.push((req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      } else {
        return next();
      }
    } catch (e) {
      return res.json(e).status(500);
    }
  });

  return validations;
};
