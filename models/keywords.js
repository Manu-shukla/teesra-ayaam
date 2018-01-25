var mongoose= require("mongoose"),
    keywordSchema = new mongoose.Schema({
    name:String,
    image: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Image"
    }]
});
module.exports = mongoose.model("Keyword", keywordSchema);
