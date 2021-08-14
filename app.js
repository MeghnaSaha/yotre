const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mongodb = require("mongodb");
const path = require("path");
const fs = require("fs");
var mongoose = require("mongoose");

var collection;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
var urlparser = bodyParser.urlencoded({ extended: false });

var upload = multer({ dest: "uploads/" });

const MongoClient = mongodb.MongoClient;
const uri =
  "mongodb+srv://meghna:test@cluster0-tozta.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  collection = client.db("yotre").collection("userWardrobe");
  app.listen(3000, () => {
    console.log("listening on 3000");
  });
});

mongoose.connect(uri);
var UserSchema = new mongoose.Schema({
  username: String,
  userEmail: String,
  password: String,
  size: String,
  height: String,
  apparels: [String]
});
var User = mongoose.model("User", UserSchema);
var AdvicePromptSchema = new mongoose.Schema({
  username: String,
  occasion: String,
  experimenty: String
});
var AdvicePrompt = mongoose.model("AdvicePrompt", AdvicePromptSchema);


app.get("/", function(req, res) {
  res.render("LoginPage", { userValid: true });
});

app.post("/register-done", urlparser, async function(req, res) {
  User.countDocuments({ username: req.body.username }, function(err, c) {
    if (c > 0) {
      res.render("LoginPage", { userValid: false });
    } else {
      var user = User({
        username: req.body.username,
        userEmail: req.body.email,
        password: req.body.password
      }).save(function(err) {
        if (err) console.log(err);
        res.render("UserCharacteristics", { data: req.body });
      });
    }
  });
});

app.post("/charac-updated", urlparser, function(req, res) {
  var filter = { username: req.body.username };
  var toUpdate = {size: req.body.size, height: req.body.height};
  User.findOneAndUpdate(filter, toUpdate, ()=>{
    res.redirect("/wardrobe?user="+req.body.username);
  });
});

app.post("/login-done", urlparser, function(req, res) {
  User.findOne(
    { username: req.body.username, password: req.body.password },
    function(err, result) {
      if(result){
        res.redirect("/feed?user="+req.body.username);
      }
      else{
        res.redirect('/');
      }
    }
  );
});

app.get("/wardrobe", function(req, res) {
  displayApparels(req.query.user)
    .then(result => {
      res.render("UploadWardrobe", { apparels: result , username: req.query.user});
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
});

app.post("/uploadShirt", upload.single("shirt"), function(req, res) {
  var img = fs.readFileSync(req.file.path);
  var encodedImg = img.toString("base64");
  var jsonImg = {
    contentType: req.file.mimetype,
    path: req.file.path,
    image: new Buffer.from(encodedImg, "base64"),
    type: req.file.fieldname
  };
  var filter = { username: req.body.username };
  var toUpdate = {$push: {apparels: req.file.path }};
  User.findOneAndUpdate(filter, toUpdate, (err, result)=>{
    console.log("Added to user's wardrobe");
  });
  collection.insertOne(jsonImg, function(err, result) {
    if (err) return console.log(err);
    console.log("Saved to wardrobe database");
    fs.unlinkSync(req.file.path);
    res.redirect("/wardrobe?user="+req.body.username);
  });
});

app.post("/uploadLegWear", upload.single("legwear"), function(req, res) {
  var img = fs.readFileSync(req.file.path);
  var encodedImg = img.toString("base64");
  var jsonImg = {
    contentType: req.file.mimetype,
    path: req.file.path,
    image: new Buffer.from(encodedImg, "base64"),
    type: req.file.fieldname
  };
  var filter = { username: req.body.username };
  var toUpdate = {$push: {apparels: req.file.path }};
  User.findOneAndUpdate(filter, toUpdate, (err, result)=>{
    console.log("Added to user's wardrobe");
  });
  collection.insertOne(jsonImg, function(err, result) {
    if (err) return console.log(err);
    console.log("Saved to wardrobe database", req.file.path);
    fs.unlinkSync(req.file.path);
    res.redirect("/wardrobe?user="+req.body.username);
  });
});

app.post('/wardrobe/delete/:username/uploads/:clothPath', function(req, res){
  const username = req.params.username.replace(/%20/g," ");
  const apparelPath = 'uploads/' + req.params.clothPath;
  User.updateOne({username: username}, {$pull: {'apparels':apparelPath}}, (result)=>{
    console.log("File path deleted off " + username +"'s database");
  });
  collection.findOneAndDelete({"path":apparelPath}, function(err,data){
      if(err) {
        console.log(err, apparelPath);
        res.sendStatus(404);
      }
      res.sendStatus(200);
  });
});

app.post('/ask-advice', function(req, res){
  var advicePrompt = AdvicePrompt({
    username: req.body.username,
    occasion: req.body.purpose,
    experimenty: req.body.experimenty
  }).save(function(err) {
    if (err) console.log(err);
    res.redirect("/wardrobe?user="+req.body.username);
  });
});

app.get("/feed", function(req, res) {
  displayAdvicePrompts()
    .then(result => {
      res.render("AdviceFeed", { advicePrompts: result , username: req.query.user});
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
});

app.get("/make-outfit", function(req, res) {
  displayApparels(req.query.helps)
    .then(result => {
      res.render("MakeOutfit", { apparels: result , userToHelp: req.query.helps, username: req.query.user});
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
});

app.post('/give-advice', function(req, res){
  res.redirect("/make-outfit?user="+req.body.username+"&helps="+req.body.userToHelp);
});

app.post('/save-outfit', function(req, res){
  console.log('in post request');
  //res.redirect("/");
  res.sendStatus(200);
});

async function displayApparels(user) {
  const userInfo = await User.findOne({username: user});
  var apparelPromises = userInfo.apparels.map(async function(apparel){
    var result = await collection.findOne({path: apparel});
    return ({
      image: result.image.toString('base64'),
      type: result.type,
      path: result.path
    });
  });
  const apparels = await Promise.all(apparelPromises);
  return apparels;
}

async function displayAdvicePrompts() {
  const advicePrompts = await AdvicePrompt.find();
  return advicePrompts;
}


