var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Steam' ,
    loginError:req.flash('loginError'),
   // username : req.user.name
  });
});
module.exports = router;
