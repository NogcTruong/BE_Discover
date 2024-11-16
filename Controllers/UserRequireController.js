const UserRequire = require("../models/userRequireModel");

const UserRequireController = {
  async createUserRequire(req, res) {
    try {
      const newUserRequire = new UserRequire(req.body);
      const savedUserRequire = await newUserRequire.save();

      res.status(201).json({
        type: "success",
        userRequire: savedUserRequire,
      });
    } catch (error) {
      console.error("Error creating UserRequire:", error);
      res.status(500).json({
        type: "error",
        message: "An error occurred while creating UserRequire.",
        error: error.message,
      });
    }
  },
};

module.exports = UserRequireController;
