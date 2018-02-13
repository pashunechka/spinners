const express = require('express');
const router = express.Router();
const fs = require('fs');

let spinners = [];

function write(data){
    fs.writeFile('spinners.json', data, "utf-8",(err) => {
        if (err) console.log(err);
    });
}

router.get('/getSpinners', (req, res) => {
    fs.readFile('spinners.json', 'utf8', (err, data) => {
        if (err) throw err;
        spinners = JSON.parse(data);
        res.send(spinners);
    });
});

router.post('/getSpinner', (req, res) => {
    let id = req.body.id;
    for(const key in spinners)
        if(spinners[key].id === +id)
            return res.send(spinners[key]);
    res.status(200).send();
});

router.post('/uploads', (req, res) => {
    if (!req.files) return;
    let file = req.files.file;
    file.mv(`./front/src/assets/${file.name}`, err => {
        if (err) return res.status(500).send(err);
        res.status(200).send();
    });
});

router.post('/addSpinner', (req, res) => {
  let name = req.body.name;
  if(req.body.name =='')
      return res.status(400).send('Invalid request');
  let spinner = {spinnerName: name, id: spinners.length + 1, spinnerMembers: []};
  spinners.push(spinner);
  res.send(spinner);
    write(JSON.stringify(spinners));
});

router.post('/addSpinnerItems', (req, res) => {
    let member = req.body;
    let spinner;
    if(member.title == '' || member.image == '')
        return res.status(400).send('Invalid request');
    for(const key in spinners)
        if(spinners[key].id === +member.id){
            spinners[key].spinnerMembers.push({name: member.title, image: member.image});
            spinner =  spinners[key];
        }
    write(JSON.stringify(spinners));
    res.send(spinner);
});

module.exports = router;