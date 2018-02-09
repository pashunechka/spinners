const express = require('express');
const router = express.Router();
const fs = require('fs');
let spinners = [];

fs.readFile('spinners.json', 'utf8', (err, data) => {
    if (err) throw err;
    spinners = JSON.parse(data);

});

router.get('/getSpinners', (req, res) => {
    res.send(spinners);
});

router.post('/addSpinner', (req, res) => {
  let name = req.body.name;
  let spinner = {
      spinnerName: name,
      id: spinners.length + 1,
      spinnerMembers: []
  };
  spinners.push(spinner);
  res.send(spinner);
  fs.writeFile('spinners.json', JSON.stringify(spinners), "utf-8",(err) => {
      if (err) return console.log(err);
  });

});

router.post('/getSpinner', (req, res) => {
    let id = req.body.id;
    for(const key in spinners)
        if(spinners[key].id === +id)
            return res.send(spinners[key]);
    res.send({});
});

router.post('/uploads', (req, res) => {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    let file = req.files.file;
    file.mv(`./front/src/assets/${file.name}`, err => {
        if (err) return res.status(500).send(err);
        res.send({link: `./front/src/assets/${file.name}`});
    });
});

router.post('/addSpinnerItems', (req, res) => {
    let member = req.body;
    console.log(member);
    for(const key in spinners)
        if(spinners[key].id === +member.id)
            spinners[key].spinnerMembers.push({name: member.title, image: member.image});
    fs.writeFile('spinners.json', JSON.stringify(spinners), "utf-8",(err) => {
        if (err) return console.log(err);
    });
    res.send({});
});



module.exports = router;
