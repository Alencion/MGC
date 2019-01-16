var express = require('express');
var router = express.Router();
var {User, Article} = require('../models');
var path = require('path');
var multer = require('multer');
var {isLoggedIn, isNotLoggedIn} = require('./middlewares');


/* GET article, write page. */
router.get('/id=:id' , function (req, res, next) {
    if(req.isAuthenticated()) {
        User = req.user;
    }
    res.render('article',{
        isSignedIn: req.isAuthenticated(),
        isNotSignedIn: !req.isAuthenticated(),
        username : User.name,
    });
});
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
        var post = await Article.create({
            title: req.body.title,
            description : req.body.description,
            view: 0,
            user_id : req.user.id,
        });
        res.redirect('/board');
    }catch(error){
        console.error(error);
        next(error);
    }
});

module.exports = router;
