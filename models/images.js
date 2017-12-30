var mongoose= require("mongoose");
var imageSchema = new mongoose.Schema({
    url:String
});


module.exports = mongoose.model("Image", imageSchema);