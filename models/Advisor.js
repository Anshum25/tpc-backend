const mongoose = require("mongoose");

const advisorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    organization: { type: String },
    description: { type: String },
    expertise: [{ type: String }],
    image: { type: String }, // URL or path
  },
  { timestamps: true },
);

module.exports = mongoose.model("Advisor", advisorSchema);
