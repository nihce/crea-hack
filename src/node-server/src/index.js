//npm install body-parser express fs path request request-promise shelljs --save
//IMPORTS
const express = require('express');
const app = express();
const rp = require('request-promise');
const bodyParser = require('body-parser');
const port = process.argv[2];
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');

//CONSTANTS


//ENDPOINTS
//parsing from JSON to object when receiving a request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.get('/test', function (req, res) {
    shell.exec('./sh001.sh');
    console.log("test");
    res.json({note: 'test'});
    //res.send(object);
});
//
// app.post('/broadcastTransaction', function (req, res) {
//     const newTransaction = mihicoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
//     mihicoin.addTransactionToMempool(newTransaction);
//     const multiplePromises = [];
//     mihicoin.nodes.forEach(node => {
//         const singlePromise = {
//             uri: node + '/receiveTransaction',
//             method: 'POST',
//             body: newTransaction,
//             json: true,
//             simple: false
//         };
//         multiplePromises.push(rp(singlePromise));
//     });
//     Promise.allSettled(multiplePromises) //Promise.all would break execution if one of nodes is no longer online
//     .then(data => {
//         res.json({note: 'OK'});
//     }).catch((err) => {console.log(err)});
// });
//
// app.post('/receiveTransaction', function (req, res) {
//     const newTransaction = req.body;
//     mihicoin.addTransactionToMempool(newTransaction);
//     res.json({note: 'OK'})
// });

app.listen(port, function() {
    console.log(`This server is running on: localhost/${port}`);
});

//FUNCTIONS
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
