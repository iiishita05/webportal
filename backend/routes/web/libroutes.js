const express = require("express");
const router = express.Router();
const Library=require("../../models/web/Library");


router.post("/add",async(req,res)=>{
    try{
        const newbook=new Library(req.body);
        await newbook.save();
        res.status(201).json({message:"Book added"});
    }catch(err){
        res.status(400).json({error:"Failed to add book"});
    }
    
});

router.get("/", async(req, res)=>{
    try{
        const books = await Library.find();
     res.json(books);
    }catch(err){
        res.status(500).json({ error: "Failed to get book" });
    }
});
router.get("/search/:name", async (req, res) => {
  try {
    const books = await Library.findOne({name:req.params.name});
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Failed to get book" });
  }
});
router.get("/search/:author", async (req, res) => {
  try {
    const books = await Library.findOne({ name: req.params.author });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Failed to get book" });
  }
});

router.delete("/delete/:isbn", async(req, res)=>{
    try
   { 
    let del=await Library.deleteOne({isbn:req.params.isbn});
    if (del.deletedCount === 0) {
      return res.status(404).json({ message: "Book not found" }); 
    }

    if(!del) return res.status(404).json({message:"Book not found"})
res.status(200).json({message:"Book dleted successfully"});
}catch(err){
    res.status(400).json({error:"Failed to delete book"});
}
});
router.put("/update/:isbn",async(req,res)=>{
    try{
        const updated=await Library.findOneAndUpdate({isbn:req.params.isbn},
            req.body,{
                new:true
            }
        );
        if (!updated) return res.status(404).json({ message: 'Book not found' });
        res.json(updated);
    }catch(err){
        res.status(500).json({error:"Failed to update book"});
    }
})
module.exports=router; 