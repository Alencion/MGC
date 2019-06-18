//회원가입을 담당하는 부분입니다.

var express = require('express');
var passport = require('passport');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var async = require('async');

var {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var {User} = require('../models');
var {tmpUser} = require('../models');

var router = express.Router();

/* GET SignIn, SignUp page.(GET방식에 대한 정의) */
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
router.get('/reset=:token', function(req, res, next){;
    res.render('reset',{
        user:req.user
    });
});

/* POST SignIn, SignUp page. */
router.post('/signin', isNotLoggedIn, (req, res, next)=>{
    /* sigin post의 경우, login 처리를 담당합니다.  */
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
    // 회원 가입을 눌렀을 때의 동작을 정의.
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
        return res.redirect('/'); // 회원가입 완료 시 메인페이지로 이동.
    }
    catch(error){
         console.error(error);
         return next(error);
    }
    res.send('POST request to the homepage');
});

/* Post Find password Page */
router.post('/lostpw',isNotLoggedIn,  (req, res, next)=> {
    /* 비밀번호 찾기를 눌렀을 때 동작 정의. */
    async.waterfall([
        function(done){
            crypto.randomBytes(20, function(err, buf){
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done){ // db에서 해당 유저 있는지 찾습니다.
            User.find({where:{e_mail:req.body.e_mail}}).then((user) => {
                if(!user){
                    req.flash('loginError', '존재하지 않는 계정입니다.');
                    return res.redirect('/auth/signin');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 360000;
                user.save(function(){
                    done(null,token,user);
                });
                done(null,token,user);
            })
                .catch((err)=>{
                    done(err, token, user);
                })
        },
        function(token, user, done) { // nodemailer모듈과 구글 Gmail API를 이용하여 유효 Hash를 담고 있는 메일을 발송합니다.
            let transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    type: 'OAuth2',
                    user: 'nodejsrinha7@gmail.com',
                    clientId: ' 1022777822318-b873do2uaevhdgnecel0km7b8nuu4ug0.apps.googleusercontent.com ',
                    clientSecret: 'OsH9y7rn1d1mHMXulc31ojQE',
                    refreshToken: '1/pK0PM7XimsXjTJdet2JQX8O89I1kMRHjzjTwDq48iTw',
                    accessToken : 'ya29.GluiBiM-fDD2vqVCWstJZLvhoaxsBZgwKuc_Sa67tsxaHVnbmYuLL60TGagd30C79ViDiNLHeM5qbJ9yqrDzu3F8UiPzenm8v94iluQwT7lnfDOoPH71dsOzrJHD',
                    expires: 3600 // 유효기간을 3600초, 1시간으로 정합니다.
                }
            });
            let mailOptions = { // 메일에 넣을 내용을 정의합니다.
                from: {
                    name: 'cnuSteamManager',
                    address: 'nodejsrinha7@gmail.com'
                },
                to: {
                    address: user.e_mail
                },
                subject: 'CNU-Steam Page Password Reset',
                text : 'You have to reset password with this site\n\n'+
                    'http://'+req.headers.host+'/auth/reset='+token+'\n\n'+
                    'it expried in 1 hours'
            };
            transporter.sendMail(mailOptions, function(err){
                req.flash('loginerror', 'An e-mail has benn sent to you! check your e-mail');
                done(err,done);
            });
        }
        ], function (err) {
        if (err) return next(err);
        res.redirect('/auth/lostpw');
    });
});

router.post('/reset=:token', function(req, res){
    // 유효한 메일링크에는 token이 들어있습니다. 알맞은 token을 통해 링크를 들어오면 비밀번호를 변경할 수 있는 권리를 줍니다.
    async.waterfall([
       function(done) {
            console.log(req.params.token);
            User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: {$gt: Date.now()}
            }).then((user)=> {
                console.log(user);
                if (!user) {
                    req.flash('loginerror', '패스워드 변경이 허가되지 않았습니다.');
                    return res.redirect('/auth/signin');
                }
                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                bcrypt.hash(user.password, 12, function(err, result){
                    console.log(result);
                    User.update({
                        client_pw: result,
                    },{
                        where:{id:user.id},
                    });
                })
                done(null,done);
            });
        },
    ], function(err){
        res.redirect('/auth/signin');
    });
});



    /*try { // 원래 lostpw 구문
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
    }(req,res,next);*/
/* 원래 reset 구문
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
});
*/
module.exports = router;
