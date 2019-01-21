var express = require('express');
var router = express.Router();
var {User, Article} = require('../models');
/* GET board page. */
router.get('/page=:page', async (req, res, next) =>{
    var Count = await Article.findAndCountAll({});
    Article.findAll({
        offset: (req.params.page -1)*10,
        limit: 10,
        include: {
            model: User,
            attributes: ['name'],
        },
        order:[['id', 'DESC']],
    })
        .then((Article) => {
            Count = parseInt((Count.count+9)/10);
            var index = req.params.page;
            if(req.isAuthenticated()) {
                User = req.user;
            }
            res.render('board',{
                title : '자유게시판',
                isSignedIn: req.isAuthenticated(),
                isNotSignedIn: !req.isAuthenticated(),
                username : User.name,
                articles : Article,
                index : index,
                count : Count,
            })
        });
});
/* GET university board page. */
router.get('/university/page=:page', async (req, res, next)=>{
    var Count = await Article.findAndCountAll({});
    Article.findAll({
        offset: (req.params.page - 1)*10,
        limit: 10,
        include: {
            model: User,
            attributes: ['name'],
        },
        order:[['id', 'DESC']],
    })
        .then((Article) => {
            Count = parseInt((Count.count+9)/10);
            var index = req.params.page;
            console.log(Count);
            if(req.isAuthenticated()) {
                User = req.user;
            }
            res.render('board',{
                title : '대학게시판',
                isSignedIn: req.isAuthenticated(),
                isNotSignedIn: !req.isAuthenticated(),
                username : User.name,
                articles : Article,
                index : index,
                count : Count,
            })
        });
});

module.exports = router;
