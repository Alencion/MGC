var express = require('express');
var router = express.Router();
var {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var {User, Article} = require('../models');

/* GET users listing. */
router.get('/', isLoggedIn, async (req, res, next) => {
    var UnivCount = await Article.findAndCountAll({where:
            {userId:req.user.id, boardname:1}});
    var FreeCount = await Article.findAndCountAll({where:
            {userId:req.user.id, boardname:2}});

    res.render('mypage',{
        title : 'MyPage',
        username : req.user.name,
        univcount:UnivCount.count,
        freecount:FreeCount.count,
    });
});

module.exports = router;
