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

//SIMULATED DATABASE
let listOfTransactions = []; 

//ENDPOINTS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// 0=PACKET INFO
// 1=PACKET TRANSFER

app.post('/postPacketInfo', function (req, res) {
  const packetId = req.body.packetId;
  const temperature = req.body.temperature;
  const data = "1" + packetId + temperature;

  const parsed = JSON.parse(generateNewTransaction(data));
  const txid = '' + parsed.txid;
  listOfTransactions.push(txid);

  setTimeout(function() {
    generateBlock()
  }, 3000);

  res.json({note: 'OK'});
});

app.post('/getPacketInfo', function (req, res) {
  const packetId = req.body.packetId;
  
  var obj = new Object();
  obj.name = "Raj";
  obj.age  = 32;
  obj.married = false;
  var jsonString= JSON.stringify(obj);

  listOfTransactions.forEach(txid => {
    const parsed = JSON.parse(getTransactionById(packetId));
    const hex = '' + parsed.vout[0].scriptPubKey.hex.slice(6);
    const ascii = hex_to_ascii(hex);
    // console.log(ascii);
    if (ascii.charAt(0)) {
      obj.kind = "Packet Info";
    } else {
      obj.kind = "Packet Transfer"
    }
    obj.kind = ;
    obj.age  = 32;
    obj.married = false;
  });


  console.log("getPacketInfo called");
  
  res.json({note: 'OK'});
});

app.post('/packetTransfer', function (req, res) {
  const packetId = req.body.packetId;
  const receiverId = req.body.receiverId;
  const data = "0" + packetId + receiverId;

  const parsed = JSON.parse(generateNewTransaction(data));
  const txid = '' + parsed.txid;
  listOfTransactions.push(txid);

  setTimeout(function() {
    generateBlock()
  }, 3000);


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
	for (var n = 0, l = str.length; n < l; n ++) {
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


