const express = require("express");
const router = express.Router();
const GuarantHeroModel = require("../../models/guarantkaiyi/GuarantHeroModel");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { uploadConfig, useSharp } = require("../../config/MulterC");

router.post("/guaranthero", uploadConfig.single("img"), async (req, res) => {
  try {
    const fileName = `${uuidv4()}-${Date.now()}.webp`;
    const outputPath = path.join(__dirname, "../../public", fileName);
    await useSharp(req.file.buffer, outputPath);
    const imgFile = `/public/${fileName}`;

    const requiredFields = ["title_az", "title_en", "title_ru", "description_az", "description_en", "description_ru"];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `missing field ${field}` });
      }
    }

    const createData = new GuarantHeroModel({
      title: {
        az: req.body.title_az,
        en: req.body.title_en,
        ru: req.body.title_ru,
      },
      description: {
        az: req.body.description_az,
        en: req.body.description_en,
        ru: req.body.description_ru,
      },
      image: imgFile,
      status: req.body.status,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/guaranthero/:id", uploadConfig.single("img"), async (req, res) => {
  try {
    const { id } = req.params;

    const fileName = `${uuidv4()}-${Date.now()}.webp`;
    const outputPath = path.join(__dirname, "../../public", fileName);
    await useSharp(req.file.buffer, outputPath);
    const imgFile = `/public/${fileName}`;

    const { title_az, title_en, title_ru, description_az, description_en, description_ru } = req.body;

    const updatedData = await GuarantHeroModel.findByIdAndUpdate(
      id,
      {
        $set: {
          title: {
            az: title_az,
            en: title_en,
            ru: title_ru,
          },
          description: {
            az: description_az,
            en: description_en,
            ru: description_ru,
          },
          image: imgFile,
          status: req.body.status,
        },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedData) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(updatedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/guaranthero/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await GuarantHeroModel.findById(id);

    if (!data) {
      return res.status(404).json({ message: "data not found." });
    }

    await GuarantHeroModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "deleted data" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/guaranthero", async (req, res) => {
  try {
    const data = await GuarantHeroModel.find().lean().exec();
    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/guarantherofront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await GuarantHeroModel.find({ status: "active" });

    const filteredData = datas?.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
      image: data.image,
      status: data.status,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/status-update-guaranthero/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedData = await GuarantHeroModel.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedData) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Status updated", updatedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/status-guaranthero/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await GuarantHeroModel.findById(id, "status");

    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }

    return res.status(200).json({ message: "Status fetched successfully", status: data.status });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;