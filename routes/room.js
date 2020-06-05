var express = require('express')
var router = express.Router()

// define the home page route
router.get('/', function (req, res) {
    res.render('pages/home');
});

// define the about route
router.post('/join', function (req, res) {
    res.redirect('/room', {user: req.body.user, room: 'alias'});
});

module.exports = router;