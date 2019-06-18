// 게시판 글 페이지로 연결해주는 라우터입니다
// 게시판 번호에 따라 다른 타입으로 연결합니다.
// 게시판이 자유게시판인 경우 단순한 글쓰기 및 댓글기능으로
// 그렇지 않다면 게임토론 게시판으로 이동합니다.(미구현)

var express = require('express');
var router = express.Router();
var {User, Article, Post} = require('../models');
var model = require('../models');
var multer = require('multer');
var {isLoggedIn, isNotLoggedIn} = require('./middlewares');


/* GET article, write page. */
router.get('/id=:id' , async(req, res, next) => {
    try{
        //select article
        var id = req.params.id;
        var article = await Article.find({where: { id }, include: [model.User]});
        // update view + 1
        Article.update({view: article.view+1 }, {where: { id }});
    }
    catch (error) {
        console.error(error);
        return next(error);
    }
    if(req.isAuthenticated()) {
        User = req.user;
    }
    var bname = article.boardname;
    var posts = await Post.find({where:{ id }});

    console.log(posts);
    if(bname === 1){
        res.render('post', {
            isSignedIn: req.isAuthenticated(),
            isNotSignedIn: !req.isAuthenticated(),
            username: User.name,
            article_title: article.title,
            view: article.view,
            created_date: article.created_date,
            writer: article.user.name,
            description: article.description,
        });
    }
    else {
        res.render('article', {
            isSignedIn: req.isAuthenticated(),
            isNotSignedIn: !req.isAuthenticated(),
            username: User.name,
            article_title: article.title,
            view: article.view,
            created_date: article.created_date,
            writer: article.user.name,
            description: article.description,
        });
    }
});

//Write Function Rotuer!
router.get('/write', function (req, res, next) {
    if(req.isAuthenticated()) {
        User = req.user;
    }
    res.render('write', {
        isSignedIn: req.isAuthenticated(),
        isNotSignedIn: !req.isAuthenticated(),
        username : User.name,
    });
});
/* POST write page. */
var upload = multer();
router.post('/write', isLoggedIn, upload.none(), async(req, res, next)=>{
    try{
        await Article.create({
            title: req.body.title,
            description : req.body.description,
            view: 0,
            userId : req.user.id,
            created_date : model.Sequelize.literal('now()'),
            boardname : req.body.category
        });
        res.redirect('http://localhost:3000/board/page=1');
    }catch(error){
        console.error(error);
        next(error);
    }
});

module.exports = router;
