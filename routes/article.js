var express = require('express');
var router = express.Router();
var {User, Article} = require('../models');
var multer = require('multer');
var {isLoggedIn, isNotLoggedIn} = require('./middlewares');


/* GET article, write page. */
router.get('/id=:id' , async(req, res, next) => {
    try{
        //select article
        var id = req.params.id;
        var article = await Article.find({where: { id }});
        //select user to take article writer
        var writer = await User.find({where: { id: article.user_id }});
        //update view + 1
        // Article.update({view: article.view+1 }, {where: {id}});
    }
    catch (error) {
        console.error(error);
        return next(error);
    }
    if(req.isAuthenticated()) {
        User = req.user;
    }
    res.render('article',{
        isSignedIn: req.isAuthenticated(),
        isNotSignedIn: !req.isAuthenticated(),
        username : User.name,
        article_title : article.title,
        view : article.view,
        created_date : article.created_date,
        writer : writer.name,
        description : article.description,
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
        await Article.create({
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
