var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Steam' ,
   // username : req.user.name
  });
});

module.exports = router;
