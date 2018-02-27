const express = require('express');
const router = express.Router();
const Spinners = require('./schemes/Spinners');
const SpinnerItems = require('./schemes/SpinnerItems');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.get('/logout', (req, res) =>{
    req.logout();
});

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

router.post('/modifyItem', /* isLoggedIn, */ (req, res) => {
    SpinnerItems.findOneAndUpdate({_id: req.body.id}, {$set: { name: req.body.title, image: req.body.image}}, {new: true }, (error, result) => {
        if (error)  return res.status(500).send(error);
        return res.send(result);
    });
});

router.post('/deleteItem', /* isLoggedIn, */ (req, res) => {
    SpinnerItems.remove({_id: req.body._id}, err => {
        if(err) return res.status(500);
        res.send();
    })
});

router.post('/addItems', /* isLoggedIn, */ (req, res) => {
    let member = req.body;
    const item = new SpinnerItems({spinnerId: member.id /* req.user._id */, name: member.title, image: member.image});
    if(member.title == '' || member.image == '')
       return res.status(400).send('Invalid request');
    item.save().then((data) => res.send(data));
});

router.post('/increaseItemStatistics', (req, res) => {
   SpinnerItems.findOneAndUpdate({ _id: req.body._id },  { $inc: { statistics: 1 } }, {new: true }, (error, result) => {
        if (error)  return res.status(500).send(error);
        return res.send(result);
    });
});
/*
router.post('/getItems', (req, res) => {
    SpinnerItems.find({spinnerId: req.body.id}, (error, result) => {
        if (error)  return res.status(500).send(error);
        return res.send(result);
    });
});
*/
router.post('/getItems', passport.authenticate('local'), (req, res) => {
    SpinnerItems.find({spinnerId: req.body.id}, (error, result) => {
        if (error)  return res.status(500).send(error);
        return res.send(result);
    });
});

passport.use('local', new LocalStrategy({
        usernameField: 'id',
        passwordField: 'auth',
        passReqToCallback: true
    }, (req, login, password, done) => {
        process.nextTick(() => {
            Spinners.findById(req.body.id, (err, spinner) => {
                if (err)  return err;
                if(req.user)
                    if(req.user.password.passwordSpinner === spinner.password.passwordSpinner)
                        return done(null, spinner);
                if(req.body.auth === ' ' &&  !spinner.password.passwordSpinner)
                    return done(null, spinner);
                if(validPassword(req.body.auth, spinner.password.passwordSpinner))
                    return done(null, spinner);
                done(null, false);
            });
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

router.get('/*', (req, res) => {
    res.sendFile(__dirname + '/front/dist/');
});


function constractSpinner(data){
    const spinner  = new Spinners({
        name: data.spinnerName,
        password: {private: data.password.isShowPass, passwordSpinner: ''}});
    if(data.password.spinnerPassword)
        spinner.password.passwordSpinner = spinner.generateHash(data.password.spinnerPassword);
    return spinner;
}

function validPassword(auth, password) {
    return bcrypt.compareSync(auth, password);
}

function isLoggedIn(req, res, next) {
    Spinners.findById(req.body.id, (err, result) => {
        if(err) return res.status(500).send(err);
        if(req.user.password.passwordSpinner === result.password.passwordSpinner)
            return next();
        res.status(401).send();
    });
}

module.exports = router;