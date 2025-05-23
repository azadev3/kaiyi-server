const mongoose = require('mongoose');

const RepairSeoSchema = mongoose.Schema({
  meta_title: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  meta_description: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
});

const RepairSeoModel = mongoose.model('repairseo', RepairSeoSchema);

module.exports = RepairSeoModel;
