const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { currentUser } = require('../../config/auth');
// routers for post and get
// for cUser

router.get('*', currentUser)

// home route
router.get('/', (req, res) => {
    res.render('index');
});
// login route
router.get('/login', (req, res) => {
    res.render('login');
});
// register route
router.get('/register', (req, res) => {
    res.render('register');
});

// gen jwt
const maxage = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECREET_TOKEN, { expiresIn: maxage });
}
// post register route

router.post('/register', (req, res) => {
    const regError = [];
    const { name, email, password } = req.body;
    if (regError.length > 0) {
        res.render('register', { regError });
    }
    User.findOne({ email }).then(user => {
        if (user) {
            regError.push({ msg: 'user already registered' });
            res.render('register', { regError });
        } else {
            const newUser = User({
                name,
                email,
                password
            })
            newUser.save()
                .then(user => {
                    const token = createToken(user._id);
                    res.cookie('jwt', token, { httpOnly: true, maxAge: maxage * 1000 });
                    res.redirect('/todo/addtodos');
                })
                .catch(err => console.log(err));
        }
    });
});
router.get('/logout', (req, res) => {
    res.cookie('jwt', 'cookie');
    res.redirect('/login');
})
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxage * 1000 });
        res.redirect('/todo/addtodos');
    } catch (error) {
        res.render('login', { error });
    }
})


module.exports = router;