var express = require('express');
var router = express.Router();
var {User, Article} = require('../models');

/* GET home page. */
router.get('/', async (req, res, next) => {
  const university = await Article.findAll({
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
  const board = await Article.findAll({
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

  let user_name = null;

  if (req.user != null) user_name = req.user.name;
  res.render('index', {
    title: 'Steam' ,
    isNotSignedIn: !req.isAuthenticated(),
    username : user_name,
    university : university,
    board : board,
  });
});

module.exports = router;
