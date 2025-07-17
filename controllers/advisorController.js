const Advisor = require("../models/Advisor");

exports.getAllAdvisors = async (req, res) => {
  try {
    const advisors = await Advisor.find();
    res.json(advisors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch advisors", error: error.message });
  }
};

exports.getAdvisor = async (req, res) => {
  try {
    const advisor = await Advisor.findById(req.params.id);
    if (!advisor) return res.status(404).json({ message: "Advisor not found" });
    res.json(advisor);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch advisor", error: error.message });
  }
};

exports.createAdvisor = async (req, res) => {
  try {
    let advisorData = { ...req.body };
    if (req.file) {
      advisorData.image = `/uploads/${req.file.filename}`;
    }
    // Parse expertise if it's a string
    if (typeof advisorData.expertise === "string") {
      advisorData.expertise = advisorData.expertise
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    const advisor = new Advisor(advisorData);
    await advisor.save();
    res.status(201).json(advisor);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create advisor", error: error.message });
  }
};

exports.updateAdvisor = async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    // Parse expertise if it's a string
    if (typeof updateData.expertise === "string") {
      updateData.expertise = updateData.expertise
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    // Remove empty string fields so they don't overwrite existing data
    Object.keys(updateData).forEach(
      (key) => updateData[key] === "" && delete updateData[key],
    );
    const advisor = await Advisor.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        new: true,
      },
    );
    if (!advisor) return res.status(404).json({ message: "Advisor not found" });
    res.json(advisor);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update advisor", error: error.message });
  }
};

exports.deleteAdvisor = async (req, res) => {
  try {
    await Advisor.findByIdAndDelete(req.params.id);
    res.json({ message: "Advisor deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete advisor", error: error.message });
  }
};
