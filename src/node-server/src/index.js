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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// 0=PACKET INFO
// 1=PACKET TRANSFER

app.post('/postPacketInfo', function (req, res) {
  const packetId = req.body.packetId;
  const temperature = req.body.temperature;
  const data = "1" + packetId + temperature;

  generateNewTransaction(data);
  setTimeout(generateBlock(), 3000);

  res.json({note: 'OK'});
});

app.post('/getPacketInfo', function (req, res) {
  const packetId = req.body.packetId;

  getTransactionById(packetId);

  res.json({note: 'OK'});
});

app.post('/packetTransfer', function (req, res) {
  const packetId = req.body.packetId;
  const receiverId = req.body.receiverId;
  const data = "0" + packetId + receiverId;

  generateNewTransaction(data);
  setTimeout(generateBlock(), 3000);


  res.json({note: 'OK'});
});

app.listen(port, function() {
    console.log(`This server is running on: localhost/${port}`);
});

//FUNCTIONS
function generateBlock() {
  const tmp = shell.exec('bin/bitcoin-cli -regtest generate 1', {silent:true}).stdout;
  return tmp;
}

function generateNewTransaction(data) {
  const str = 'bin/generate-new-transaction.sh ' + ascii_to_hexa(data);
  const tmp = shell.exec(str, {silent:false}).stdout;
  return tmp;
}

function getTransactionById(transactionId) {
  const str = 'bin/bitcoin-cli -regtest gettransaction ' + transactionId;
  const tmp = shell.exec(str, {silent:false}).stdout;
  return tmp;
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
