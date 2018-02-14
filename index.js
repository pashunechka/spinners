const express = require('express');
const router = express.Router();
const Spinners = require('./schemes/Spinners');
const SpinnerItems = require('./schemes/SpinnerItems');

router.post('/uploads', (req, res) => {
    if (!req.files) return;
    let file = req.files.file;
    file.mv(`./front/src/assets/${file.name}`, err => {
        if (err) return res.status(500).send(err);
        res.status(200).send();
    });
});

router.get('/getSpinners', (req, res) => {
    Spinners.find({}, (err, result) =>{
        if(err) res.status(500).send();
        res.send(result);
    });
});

router.post('/addSpinner', (req, res) => {
    const spinner = new Spinners({name: req.body.name});
    if(req.body.name == '')
        return res.status(400).send('Invalid request');
    spinner.save().then((data) => res.send(data));
});

router.post('/getSpinner', (req, res) => {
    SpinnerItems.find({spinnerId: req.body.id}, (err, result) =>{
        if(err) res.status(500).send();
        res.send(result);
    })
});

router.post('/addSpinnerItems', (req, res) => {
    let member = req.body;
    const item = new SpinnerItems({spinnerId: member.id, name: member.title, image: member.image});
    if(member.title == '' || member.image == '')
        return res.status(400).send('Invalid request');
    item.save().then((data) => res.send(data));
});

module.exports = router;