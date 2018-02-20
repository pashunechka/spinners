const express = require('express');
const router = express.Router();
const Spinners = require('./schemes/Spinners');
const SpinnerItems = require('./schemes/SpinnerItems');
const bcrypt = require('bcrypt');

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

router.post('/getSpinner', (req, res) => {
    Spinners.findById(req.body.spinner._id, (err, result) =>{
        if(err) return res.status(500).send('Bad request!');
        if(result.password)
            if(result.password.passwordSpinner)
            if(!validPassword(req.body.auth, result.password.passwordSpinner))
                return res.status(401).send('Wrong password!');
        SpinnerItems.find({spinnerId: req.body.spinner._id}, (err, result) =>{
            if(err) return res.status(500).send('Bad request!');
                res.send(result);
        })
    });
});

router.post('/addSpinnerItems', (req, res) => {
    let member = req.body.spinnerItem;
    Spinners.findById(member.id, (err, result) =>{
        if(err) return res.status(500).send('Bad request!');
        if(result.password.passwordSpinner)
            if(!validPassword(req.body.auth, result.password.passwordSpinner))
                return res.status(401).send('Wrong password!');
        const item = new SpinnerItems({spinnerId: member.id, name: member.title, image: member.image});
        if(member.title == '' || member.image == '')
            return res.status(400).send('Invalid request');
        item.save().then((data) => res.send(data));
    });
});

router.get('/*', (req, res) => {
    res.sendFile(__dirname + '/front/dist/');
});


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
};

module.exports = router;