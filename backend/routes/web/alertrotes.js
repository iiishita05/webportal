const express=require('express');
const router=express.Router();
const Alert=require('../../models/Alert');

router.post("/add",async(req,res)=>{
    try{
        const newalert=new Alert(req.body);
        await newalert.save();
        res.status(201).json({message:"Alert added"});
    }catch(err){
        res.status(400).json({error:"Failed to add alert"});
    }
    
});


router.post("/delete", async (req,res)=>{
    try{
        const del = await Alert.findOneAndDelete({}, { sort: { _id: -1 } });
        if(!del) return res.status(404).json({message:"Alert not found"});
        res.status(200).json({message:"Alert deleted successfully"});
    }catch(err){
        res.status(400).json({error:"Failed to delete alert"}); 
    }
})
module.exports=router;