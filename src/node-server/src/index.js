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
const LENGTH_OF_TIMESTAMP = 10;
const START_TIMESTAMP = 4;
const END_TIMESTAMP = START_TIMESTAMP + LENGTH_OF_TIMESTAMP;

//SIMULATED DATABASE
let listOfTransactions = []; 

//ENDPOINTS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// 0=PACKET INFO
// 1=PACKET TRANSFER

app.post('/postPacketInfo', function (req, res) {
  // const packetId = req.body.packetId;
  // const temperature = req.body.temperature;
  // const timestamp = req.body.timestamp;
  const packetId = "007";
  const temperature = rand(4,9);
  const timestamp = Math.floor(Date.now() / 1000);
  const data = "1" + packetId + timestamp + temperature;

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
  let response = "Packet Number: " + packetId;
  response += ", ";
  let temperatureBreach = 0;

  if (listOfTransactions && listOfTransactions.length) {    
    listOfTransactions.forEach(txid => {      
      const parsed = JSON.parse(getTransactionById(txid));
      const hex = '' + parsed.vout[0].scriptPubKey.hex.slice(6);
      const ascii = hex_to_ascii(hex);
      if (parseInt(ascii.charAt(0))) {
        const temperature = ascii.substring(END_TIMESTAMP, ascii.length);

        if (temperature > 8.0) {
          temperatureBreach = 1;
        }
        const timestamp = unix_to_date(ascii.substring(START_TIMESTAMP, END_TIMESTAMP));
        response += "Packet Temperature: ";
        response += temperature;
        response += " [" + timestamp + "]";
        response += ", ";
      } else {
        const temperature = ascii.substring(END_TIMESTAMP, ascii.length);
        const timestamp = unix_to_date(ascii.substring(START_TIMESTAMP, END_TIMESTAMP));
        response += "Packet Transfared To: ";
        response += temperature;
        response += " [" + timestamp + "]";
        response += ", ";
      }
    });
  }
  response = response + "temperatureBreach: " + temperatureBreach;
  // console.log("getPacketInfo called with: " + packetId);
  res.send(response);
});

app.post('/packetTransfer', function (req, res) {
  const packetId = req.body.packetId;
  const receiverId = req.body.receiverId;
  const timestamp = req.body.timestamp;
  const data = "0" + packetId + timestamp + receiverId;

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
  const str = 'bin/getTxData.sh ' + transactionId;
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

 function unix_to_date(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}