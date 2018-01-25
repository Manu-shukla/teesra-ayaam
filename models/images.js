var mongoose= require("mongoose"),
   imageSchema = new mongoose.Schema({
    url:String
});


module.exports = mongoose.model("Image", imageSchema);
