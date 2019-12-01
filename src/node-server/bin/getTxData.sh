#!/bin/bash
rawTransaction=$(bin/bitcoin-cli -regtest getrawtransaction $1)
# echo $rawTransaction
# show final transaction in human readable form
readableTransaction=$(./bin/bitcoin-cli -regtest decoderawtransaction $rawTransaction)
echo $readableTransaction