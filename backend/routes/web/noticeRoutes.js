const express=require('express');
const router=express.Router();
const Notice=require('../../models/web/Notice');
const multer=require('multer');
const path=require('path');
const translate = require("google-translate-api-x");



const storage= multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/');
    },
    filename:function(req,file,cb){
const uniquename=Date.now() + '-'+file.originalname;
cb(null, uniquename); 
    }
});
const upload=multer({storage:storage});
router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: "failed to fetch notices" });
  }
});


router.post("/upload", upload.single("pdf"), async (req, res) => {
  const { title, category } = req.body;
  const pdf = req.file;

  if (!title || !pdf) {
    return res.status(400).json({ error: "Title and PDF are required" });
  }

  let translatedTitle = "";
  try {
    const result = await translate(title, { from: "en", to: "hi" });
    console.log("Translated text:", result.text);
    translatedTitle = result.text;
  } catch (error) {
    console.error("Translation failed:", error.message);
    translatedTitle = title; // fallback to original title
  }

  try {
    const newNotice = new Notice({
      title,
      titleHindi: translatedTitle,
      category: category || "General",
      pdf: `/uploads/${pdf.filename}`,
    });

    const saved = await newNotice.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Saving notice failed:", err.message);
    res.status(500).json({ error: "Failed to create notice" });
  }
});


router.post("/delete", async (req, res) => {
  const { title } = req.body;
  try {
    const deleted = await Notice.deleteOne({ title });
    if(!deleted) return res.status(404).json({ message: "Notice not found" });
    
    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notice" });
  }
});
module.exports=router;
