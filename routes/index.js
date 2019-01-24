var express = require('express');
var router = express.Router();
var {User, Article, Category} = require('../models');

/* GET home page. */
router.get('/', async (req, res, next) => {
  var university = await Article.findAll({
    limit: 5,
    include: {
      model: User,
      attributes: ['name'],
    },
    where : {
      boardname: 1,
    },
    order:[['id', 'DESC']],
  });
  var board = await Article.findAll({
    limit: 5,
    include: {
      model: User,
      attributes: ['name'],
    },
    where : {
      boardname: 2,
    },
    order:[['id', 'DESC']],
  });
  if(req.isAuthenticated()) {
    res.render('index', {
      title: 'Steam' ,
      isSignedIn: req.isAuthenticated(),
      isNotSignedIn: !req.isAuthenticated(),
      username : req.user.name,
      university : university,
      board : board,
    });
  }
  else{
    res.render('index', {
      title: 'Steam' ,
      isSignedIn: req.isAuthenticated(),
      isNotSignedIn: !req.isAuthenticated(),
      university : university,
      board : board,
    });
  }
});
module.exports = router;
