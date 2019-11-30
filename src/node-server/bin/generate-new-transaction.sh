#!/bin/bash
#create new transaction and add data to it, then store it
transaction=$(./bin/bitcoin-cli -regtest createrawtransaction "[]" "{\"data\":\"$1\"}")
#echo $transaction
#add mining fee to transaction and store funded transaction
funded=$(./bin/bitcoin-cli -regtest fundrawtransaction $transaction | jq -r '.hex')
#echo $funded
#sign transaction
signed=$(./bin/bitcoin-cli -regtest signrawtransaction $funded)
# echo $signed
#show rawTransaction
rawTransaction=$(echo -n $signed | jq -r '.hex')
# echo $rawTransaction
# show final transaction in human readable form
readableTransaction=$(./bin/bitcoin-cli -regtest decoderawtransaction $rawTransaction)
send=$(./bin/bitcoin-cli -regtest sendrawtransaction $rawTransaction)
echo $readableTransaction