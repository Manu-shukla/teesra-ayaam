var express= require("express"),
 app=express(),
 body= require("body-parser"),
 mongoose= require("mongoose"),
 Scraper = require ('images-scraper'),
 bing = new Scraper.Bing(),
 Image=require("./models/images"),
 Keyword=require("./models/keywords");
// var Jimp = require("jimp");

//connecting to DB
mongoose.Promise = global.Promise;
// mongoose.connect("mongodb://localhost/keyword_1",{useMongoClient:true} );
mongoose.connect("mongodb://utkarsh:utkarsh@ds131687.mlab.com:31687/keyword_1", {useMongoClient:true});
app.set("view engine", "ejs");
app.use(body.urlencoded({extended: true}));


//Routes
//landing
app.get("/", function(req, res) {
    res.render("landing");
});

//index-show all keyword
app.get("/keywords", function(req,res){
    Keyword.find({}, function(err, allKeyword){
        if(err){
            console.log(err);
        }
        else{
            res.render("keywords", {keywords:allKeyword});
        }
    });
   
});

//create- new keyword 
app.post("/keywords", function(req,res){
    var keyword=req.body.keyword;
    var newKeyword = {name:keyword};
    
    Keyword.create(newKeyword, function(err, newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            
            //fetch images, pass through filter and save
        bing.list({
    keyword: keyword,
    num: 15,
    detail: true
})
.then(function (response) {
  for(var i=0; i<15; i++){
      var url=response[i].url;
Image.create({url:url},function(err, image){
          if(err){
              console.log(err);
          }
          else{
              Keyword.findOne({name:keyword}, function(err, foundkeyword){
                  if(err){
                      console.log(err);
                  }
                  else{
                      foundkeyword.image.push(image);
                      foundkeyword.save(function(err,data){
                          if(err){
                              console.log(err);
                          }
                          else{
                              console.log("Data saved successfully");
                          }
                      });
                  }
              });
              
          }
      });
  }
    res.render("fetch",{response:response, keyword:keyword});
        
    
}).catch(function(err) {
    console.log('err',err);
});
            
        }
    });
    
});


//new-show form 
app.get("/keywords/new", function(req,res){
    res.render("new");
});

//show a particular keyword's image from index pg
app.get("/keywords/:id", function(req,res){
    Keyword.findById(req.params.id).populate("image").exec(function(err, foundKeyword){
        if(err){
            console.log(err);
        }
        else{
            
            
            res.render("show",{keyword:foundKeyword});
        }
    });
    
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started");

});
