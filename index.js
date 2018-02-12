const express = require('express');
const router = express.Router();
const fs = require('fs');
let spinners = [];

router.get('/getSpinners', (req, res) => {
    fs.readFile('spinners.json', 'utf8', (err, data) => {
        if (err) throw err;
        spinners = JSON.parse(data);
        res.send(spinners);
    });
});

router.post('/addSpinner', (req, res) => {
  let name = req.body.name;
  if(req.body.name =='')
      return res.status(400).send('Invalid request');
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
        return;
    let file = req.files.file;
    file.mv(`./front/src/assets/${file.name}`, err => {
        if (err) return res.status(500).send(err);
        res.send({link: `./front/src/assets/${file.name}`});
    });
});

router.post('/addSpinnerItems', (req, res) => {
    let member = req.body;
    if(member.title == '' || member.image == '')
        return res.status(400).send('Invalid request');
    let spinner;
        for(const key in spinners)
            if(spinners[key].id === +member.id){
                spinners[key].spinnerMembers.push({name: member.title, image: member.image});
                spinner =  spinners[key];
            }
    fs.writeFile('spinners.json', JSON.stringify(spinners), "utf-8",(err) => {
        if (err) return res.status(500).send(err);
    });
    res.send(spinner);
});



module.exports = router;
