var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";

/* GET home page. */
router.get('/', function(req, res, next) {

  MongoClient.connect(url,function(err,db){
    if(err) throw err;
    var dbo = db.db("user");

    dbo.collection('details').find().sort({gusses:-1}).toArray(function(err,result){
      if (err) throw err;

      res.render('result', { results: result });
      // for(var i = 0; i < result.length; i++){
      //   console.log(result[i])
      // }

    });

  });



});

module.exports = router;
