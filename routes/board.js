var express = require('express');
var router = express.Router();
var {User, Article} = require('../models');
/* GET board page. */
router.get('/page=:page', async (req, res, next) =>{
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
/* GET university board page. */
router.get('/game/page=:page', async (req, res, next)=>{
    var Count = await Article.findAndCountAll({ where : {
            boardname: 1,
        }});
    Article.findAll({
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
