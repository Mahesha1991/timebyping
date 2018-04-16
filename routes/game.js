var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";

/* GET home page. */
router.get('/', function(req, res, next) {

  guess = req.query.guess;
  email = req.query.email;

  var genRandom = Math.floor(Math.random() * (100-1) + 1);

  MongoClient.connect(url,function(err,db){
    if(err) throw err;
    var dbo = db.db("user");

    dbo.collection('details').find({email:email}).toArray(function(err,result){
      if (err) throw err;

      if(result[0] && result[0].email == email){
        //start game
        userOne = {name:result[0].name,email:result[0].email, gusses:parseInt(result[0].gusses),games:parseInt(result[0].games)};
        userOne.games += 1;
        if ( guess >= genRandom-10 && guess <= genRandom+10){
          userOne.gusses += 1;
          dbo.collection('details').update({email:email},userOne,function(err,result){
            if (err) throw err;
            else{
              sendItem = {text:"Good Guess", num : genRandom};
              res.send(sendItem);
            }

          });

        }else{
          dbo.collection('details').update({email:email},userOne,function(err,result){
            if (err) throw err;
            else{
              sendItem = {text:"Wrong Guess", num : genRandom};
              res.send(sendItem);
            }

          });

        }

      }else{
        sendItem = {text:"Email Not Found!", num : genRandom};
        res.send();

      }

    });

  });


});

module.exports = router;
