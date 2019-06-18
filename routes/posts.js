/*(미완성) 게임 관련 Post에 대한 정보를 담는 Post에 대한 router입니다. */

const express = require('express');

const { Post, Hashtag, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();
//주소 변경해줘야함.
router.post('/game', isLoggedIn, upload2.none(), async (req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            userId: req.user.id,
        });
        res.redirect('/game');
    } catch (error) {
        console.error(error);
        next(error);
    }
});
module.exports = router;
