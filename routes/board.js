/* 게시판 보기를 담당하는 부분입니다. */


var express = require('express');
var router = express.Router();
var {User, Article} = require('../models');

/* GET board page. */
router.get('/page=:page', async (req, res, next) =>{
    /* 게시판 번호 2번인 자유게시판에 저장된 글들을 불러옵니다.
    10개의 페이지를 나누어 각 페이지에 대한 링크에 대응합니다.
    */
    var Count = await Article.findAndCountAll({ where : {
            boardname: 2,
        }});
    Article.findAll({
        offset: (req.params.page -1)*10,
        limit: 10,
        include: {
            model: User,
            attributes: ['name'],
        },
        where : {
            boardname: 2,
        },
        order:[['id', 'DESC']],
    })
        .then((Article) => {
            Count = parseInt((Count.count+9)/10);
            var index = req.params.page;
            if(req.isAuthenticated()) {
                res.render('board',{
                    title : '자유게시판',
                    isSignedIn: req.isAuthenticated(),
                    isNotSignedIn: !req.isAuthenticated(),
                    username : req.user.name,
                    articles : Article,
                    index : index,
                    count : Count,
                });
            }
            else {
                res.render('board', {
                    title: '자유게시판',
                    isSignedIn: req.isAuthenticated(),
                    isNotSignedIn: !req.isAuthenticated(),
                    articles: Article,
                    index: index,
                    count: Count,
                });
            }
        });
});

/* GET game information page. */
router.get('/game/page=:page', async (req, res, next)=>{
    /* game post부분으로 넘어오는 곳은 주소를 다르게 해주었습니다.
    *  같은 주소를 사용하는 방법도 있지만, 어려워서 주소를 변경하는 방법을 채택하였습니다. */
    var Count = await Article.findAndCountAll({ where : {
            boardname: 1,
        }}); // db에서 게시판번호 1번인 data들을 불러와 정렬한 후, pug를 통해 화면에 보입니다.
    Article.findAll({
        // findAll 메소드를 이용하여 db에서 불러온 자료들을 10개씩 끊어서 정렬합니다.
        // 한 페이지에는 10개의 데이터만을 보여줍니다.
        offset: (req.params.page - 1)*10,
        limit: 10,
        include: {
            model: User,
            attributes: ['name'],
        },
        where : {
            boardname: 1,
        },
        order:[['id', 'DESC']],
    })
        .then((Article) => {
            // 불러온 이후, count를 통해 숫자를 세며 각 페이지에 10개씩 글을 표시합니다.
            Count = parseInt((Count.count+9)/10);
            var index = req.params.page;
            if(req.isAuthenticated()) {
                res.render('board',{
                    title : '게임게시판',
                    isSignedIn: req.isAuthenticated(),
                    isNotSignedIn: !req.isAuthenticated(),
                    username : req.user.name,
                    articles : Article,
                    index : index,
                    count : Count,
                });
            }
            else {
                res.render('board',{
                    title : '게임게시판',
                    isSignedIn: req.isAuthenticated(),
                    isNotSignedIn: !req.isAuthenticated(),
                    articles : Article,
                    index : index,
                    count : Count,
                });
            }
        });
});

module.exports = router;
