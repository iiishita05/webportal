const mongoose=require('mongoose');
const alertSchema=new mongoose.Schema({
    alerttitle:{
        type:String,
        required:true
    }
});
module.exports=mongoose.model('Alert',alertSchema);