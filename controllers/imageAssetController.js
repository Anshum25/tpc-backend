const ImageAsset = require("../models/ImageAsset");

exports.getAllImages = async (req, res) => {
  try {
    const images = await ImageAsset.find();
    res.json(images);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch images", error: error.message });
  }
};

exports.getImage = async (req, res) => {
  try {
    const image = await ImageAsset.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });
    res.json(image);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch image", error: error.message });
  }
};

exports.createImage = async (req, res) => {
  try {
    console.log("--- [createImage] Incoming request ---");
    console.log("Body:", req.body);
    console.log("File:", req.file);
    const { title, alt, part, event, date, location, category } = req.body;
    let url = req.body.url;
    if (req.file) {
      url = `/uploads/${req.file.filename}`;
    }
    if (!part) {
      console.log("[createImage] Missing 'part' field");
      return res.status(400).json({ message: "'part' field is required" });
    }
    if (!title) {
      console.log("[createImage] Missing 'title' field");
      return res.status(400).json({ message: "'title' field is required" });
    }
    if (!url) {
      console.log("[createImage] Missing file upload or url");
      return res.status(400).json({ message: "Image file is required" });
    }
    const image = new ImageAsset({
      title,
      url,
      alt,
      part,
      event,
      date,
      location,
      category,
    });
    await image.save();
    console.log("[createImage] Image saved:", image);
    res.status(201).json(image);
  } catch (error) {
    console.error("[createImage] Error:", error);
    res
      .status(400)
      .json({ message: "Failed to create image", error: error.message });
  }
};

exports.updateImage = async (req, res) => {
  try {
    const { title, alt, part, event, date, location, category } = req.body;
    let url = req.body.url;
    if (req.file) {
      url = `/uploads/${req.file.filename}`;
    }
    if (!part) {
      return res.status(400).json({ message: "'part' field is required" });
    }
    const image = await ImageAsset.findByIdAndUpdate(
      req.params.id,
      { title, url, alt, part, event, date, location, category },
      { new: true },
    );
    if (!image) return res.status(404).json({ message: "Image not found" });
    res.json(image);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update image", error: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    await ImageAsset.findByIdAndDelete(req.params.id);
    res.json({ message: "Image deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete image", error: error.message });
  }
};

exports.getGalleryImages = async (req, res) => {
  try {
    const images = await ImageAsset.find({ part: "Gallery" });
    res.json(images);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch gallery images",
      error: error.message,
    });
  }
};
