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

app.get('/generate150Blocks', function (req, res) {
  const tmp = shell.exec('bin/bitcoin-cli -regtest generate ' + 150, {silent:true}).stdout;
  res.json({note: tmp});
});

app.get('/generateBlock', function (req, res) {
    const tmp = shell.exec('bin/bitcoin-cli -regtest generate 1', {silent:true}).stdout;
    console.log(tmp);
    res.send(tmp);
});

app.post('/generateNewTransaction', function (req, res) {
  const data = req.body.data;
  // console.log(data);  
  const str = 'bin/generate-new-transaction.sh ' + ascii_to_hexa(data);
  // console.log(str);
  const tmp = shell.exec(str, {silent:false}).stdout;
  res.send(tmp);
});

app.post('/getTransaction', function (req, res) {
  const transactionId = req.body.data;
  const str = 'bin/bitcoin-cli -regtest gettransaction ' + transactionId;
  const tmp = shell.exec(str, {silent:false}).stdout;
  res.send(tmp);
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

//ascii_to_hexa('12')
function ascii_to_hexa(str)
  {
	var arr1 = [];
	for (var n = 0, l = str.length; n < l; n ++) 
     {
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(hex);
	 }
	return arr1.join('');
   }

   //hex_to_ascii('3132')
   function hex_to_ascii(str1)
 {
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
 }