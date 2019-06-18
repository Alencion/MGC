/* mypage에 대한 router입니다. */

var express = require('express');
var router = express.Router();
var {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var {User, Article} = require('../models');

/* GET users listing. */
router.get('/', isLoggedIn, async (req, res, next) => {
    // user의 정보를 db에서 불러와 표시합니다.
    var GameCount = await Article.findAndCountAll({where: //game 게시판의 게시글 수를 불러옵니다.
            {userId:req.user.id, boardname:1}});
    var FreeCount = await Article.findAndCountAll({where: // 자유 게시판의 게시글 수를 불러옵니다.
            {userId:req.user.id, boardname:2}});

    res.render('mypage',{ // 페이지에 routing한 정보를 보냅니다.
        title : 'MyPage',
        username : req.user.name,
        email : req.user.e_mail,
        universityCount:GameCount.count,
        boardCount:FreeCount.count,
    });
});

module.exports = router;
