const mongoose = require("mongoose");

const TestDriveSchema = mongoose.Schema({
  title: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  description: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  image: { type: String, required: false, default: "" },
  status: { type: String, required: false, default: "active" },
});

const TestDriveModel = mongoose.model("TestDrive", TestDriveSchema);

module.exports = TestDriveModel;
