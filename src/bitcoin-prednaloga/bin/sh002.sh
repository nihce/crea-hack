#!/bin/bash
./bitcoin-cli -regtest generate 150
#store text from file to variable data and convert it to clean HEX form
data=$(echo $1 | xxd -p -u)
#create new transaction and add data to it, then store it
transaction=$(./bitcoin-cli -regtest createrawtransaction "[]" "{\"data\":\"$data\"}")
#echo $transaction
#add mining fee to transaction and store funded transaction
funded=$(./bitcoin-cli -regtest fundrawtransaction $transaction | jq -r '.hex')
#echo $funded
#sign transaction
signed=$(./bitcoin-cli -regtest signrawtransaction $funded)
# echo $signed
#show final transaction in human readable form
rawTransaction=$(echo -n $signed | jq -r '.hex')
# echo $rawTransaction
./bitcoin-cli -regtest decoderawtransaction $rawTransaction
