var express = require('express');
var router = express.Router();
var {User} = require('../models');
/* GET home page. */

router.get('/', function(req, res, next) {
  if(req.isAuthenticated()) {
    User = req.user;
    console.log(User);
  }
  res.render('index', {
    title: 'Steam' ,
    isSignedIn: req.isAuthenticated(),
    isNotSignedIn: !req.isAuthenticated(),
    username : User.name,
  });
});
module.exports = router;
