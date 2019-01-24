var express = require('express');
var passport = require('passport');
var bcrypt = require('bcrypt');
var {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var {User} = require('../models');
var {tmpUser} = require('../models');

var router = express.Router();

/* GET SignIn, SignUp page. */
router.get('/signin', function (req, res, next) {
    res.render('signin',{
        loginError:req.flash('loginError'),
    });
});
router.get('/signup', function (req, res, next) {
    res.render('signup');
});
router.get('/signout', isLoggedIn, (req, res)=>{
    req.logout();
    req.session.destroy();
    res.redirect('/');
});
router.get('/lostpw', function (req, res, next) {
    res.render('lostpw',{
        user:req.user
    });
});
router.get('/reset', function(req, res, next){;
    res.render('reset',{
        user:req.user
    });
});

/* POST SignIn, SignUp page. */
router.post('/signin', isNotLoggedIn, (req, res, next)=>{
    passport.authenticate('local', (authError, user ,info)=>{
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            req.flash('loginError',info.message);
            return res.redirect('/auth/signin');
        }
        return req.login(user, (loginError)=>{

            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.post('/signup',isNotLoggedIn, async(req, res, next)=>{
    var {client_id, client_pw, name, e_mail} = req.body;
    try {
        var exUser = await User.find({where: {client_id}});
        if (exUser) {
            req.flash('signError', '이미 가입된 아이디입니다.');
            return res.redirect('/signup');
        }
        var hash = await bcrypt.hash(client_pw, 12);
        await User.create({
            client_id,
            client_pw: hash,
            name,
            e_mail,
        });
        return res.redirect('/');
    }
    catch(error){
         console.error(error);
         return next(error);
    }
    res.send('POST request to the homepage');
});

router.post('/lostpw',isNotLoggedIn,  async (req, res, next)=> {
    try {
        exUser = await User.find({where: {e_mail: req.body.e_mail}});
        if (!exUser) {
            req.flash('loginError', '존재하지 않는 계정입니다.');
            return res.redirect('/auth/signin');
        }
        tmpUser = exUser;
        return res.redirect('/auth/reset');
    }catch(error){
        console.error(error);
        return next(error);
    }(req,res,next);
});
router.post('/reset', isNotLoggedIn, async(req,res,next)=>{
    try {
        if (!tmpUser) {
            req.flash('loginError', '비밀번호 변경에 실패했습니다.');
            return res.redirect('/auth/signin');
        }
        var hash = await bcrypt.hash(req.body.password, 12);
        User.update({
            client_pw:hash,
        },{
            where:{id:tmpUser.id},
        });
        req.flash('loginError', '비밀번호가 성공적으로 변경되었습니다!');
        return res.redirect('/auth/signin');
    }catch(error){
        console.error(error);
        return next(error);
    }
})

module.exports = router;
