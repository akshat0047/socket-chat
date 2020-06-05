var express = require('express')
var router = express.Router()

var users = [];

/* middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
*/

// define the home page route
router.get('/', function (req, res) {
    res.render('pages/home');
});

// define the about route
router.post('/join', function (req, res) {
    res.render('pages/index', {user: req.body.user, room: req.body.room});
});

module.exports = router;