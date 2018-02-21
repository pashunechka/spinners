const express = require('express');
const router = express.Router();
const Spinners = require('./schemes/Spinners');
const SpinnerItems = require('./schemes/SpinnerItems');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.post('/uploads', (req, res) => {
    if (!req.files) return;
    let file = req.files.file;
    file.mv(`./front/dist/assets/${file.name}`, err => {
        if (err) return res.status(500).send(err);
        res.status(200).send();
    });
});

router.get('/getSpinners', (req, res) => {
    Spinners.find({}, 'name password.private', (err, result) =>{
        if(err) return res.status(500).send();
            res.send(result);
    });
});

router.post('/addSpinner', (req, res) => {
    if(req.body.name == '')
        return res.status(400).send('Invalid request');
    const spinner = constractSpinner(req.body);
    spinner.save().then((data) => {
        const result = {name: data.name, _id: data._id, password: {private: data.password.private}};
        res.send(result)
    });
});


router.post('/getItems', (req, res) => {
    SpinnerItems.find({spinnerId: req.body.id}, (err, result) =>{
       if(err) return res.status(500).send('Bad request!');
       res.send(result);
    });
});

router.post('/addItems', (req, res) => {
    let member = req.body;
        const item = new SpinnerItems({spinnerId: member.id, name: member.title, image: member.image});
        if(member.title == '' || member.image == '')
            return res.status(400).send('Invalid request');
        item.save().then((data) => res.send(data));
});

router.get('/*', (req, res) => {
    res.sendFile(__dirname + '/front/dist/');
});
/*
router.post('/getItems', passport.authenticate(), (req, res) => {
    console.log(req.body)
});


passport.use(new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback: true
    },
    (req, usernameField, passwordField, done) => {
        Spinners.findById(req.body.id, (err, spinner) => {
            if (err)  return done(err);
            if (!spinner) return done(null, false);
            if (!validPassword('', spinner.password.passwordSpinner)) return done(null, false);
            return done(null, spinner);
        });
    }
));

passport.serializeUser((spinner, done) => {
    done(null, spinner);
});

passport.deserializeUser((id, done) => {
    Spinners.findById(id, (err, spinner) => {
        done(err, spinner);
    });
});
*/

function constractSpinner(data){
    const spinner  = new Spinners({
        name: data.spinnerName,
        password: {private: data.password.isShowPass, passwordSpinner: ""}});
    if(data.password.spinnerPassword)
        spinner.password.passwordSpinner = spinner.generateHash(data.password.spinnerPassword);
    return spinner;
}

function validPassword(auth, password) {
    return bcrypt.compareSync(auth, password);
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

module.exports = router;