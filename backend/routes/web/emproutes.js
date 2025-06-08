const express = require("express");
const router = express.Router();
const Employees = require("../../models/web/Employees");

router.post("/addemp",async(req,res)=>{
    try{
        const {  email,empid } = req.body;
        const existingmail = await Employees.findOne({ email});
            if (existingmail)
              return res.status(400).json({ error: "E-Mail already exists" });

            const existingid = await Employees.findOne({ empid });
            if (existingid)
              return res.status(400).json({ error: "Id already exists" });



        const newemp=new Employees(req.body);
        await newemp.save();
        res.status(201).json({message:"Employee added"});
    }catch(err){
        res.status(400).json({error:"Failed to add employee"});
    }
    
});

router.get("/", async(req, res)=>{
    try{
        const emp = await Employees.find();
     res.json(emp);
    }catch(err){
        res.status(500).json({ error: "Failed to get emp" });
    }
});

router.get("/search/:empid", async(req, res)=>{
    try{
        
        const emp = await Employees.findOne({ empid: req.params.empid });
        if(!emp) return res.status(404).json({ message: "Employee not found" });
     res.json(emp);
    }catch(err){
        res.status(500).json({ error: "Failed to get emp" });
    }
});
router.get("/search/:name", async (req, res) => {
  try {
    const emp = await Employees.findOne({ empid: req.params.name });
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ error: "Failed to get emp" });
  }
});



router.delete("/delete/:empid", async(req, res)=>{
    try
   { 
    let del = await Employees.deleteOne({ empid: req.params.empid });
    if(!del) return res.status(404).json({message:"Employee not found"})
res.status(200).json({message:"Employee deleted successfully"});
}catch(err){
    res.status(400).json({error:"Failed to delete Employee"});
}
});
router.put("/update/:empid",async(req,res)=>{
    try{
        const updated=await Employees.findOneAndUpdate({empid:req.params.empid},
            req.body,{
                new:true
            }
        );
        if (!updated) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(updated);
    }catch(err){
res.status(400).json({error:err.message});
    }
});

module.exports=router;