var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";

/* GET users listing. */
router.get('/', function(req, res, next) {

  name = req.query.name;
  email = req.query.email;

  if(!name || !email){
    res.render('index',{ title: 'Welcome',error:"Name or Email is empty" });
  }else{
    MongoClient.connect(url,function(err,db){
      if(err) throw err;
      var dbo = db.db("user");

      dbo.collection('details').find({email:email}).toArray(function(err,result){
        if (err) throw err;

        if(result[0] && result[0].email == email){
          //start game
          userOne = {name:result[0].name,email:result[0].email, gusses:parseInt(result[0].gusses),games:parseInt(result[0].games)};
          res.render('game',userOne);
        }else{
          userOne = {name:name,email:email, gusses:0,games:0};
          dbo.collection('details').update({email:email},userOne,{upsert:true},function(err,result){
            if (err) throw err;
            else{
              res.render('game',userOne);
            }

          });

        }

      });

    });
  }


});

module.exports = router;
