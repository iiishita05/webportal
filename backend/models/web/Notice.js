const mongoose=require('mongoose');

const noticeSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
    required: true,
  },
  pdf: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "General",
  },
  titleHindi: {
     type:String,
  }
});
module.exports=mongoose.model('Notice',noticeSchema);