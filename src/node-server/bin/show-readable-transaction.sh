#!/bin/bash
#show final transaction in human readable form
readableTransaction=./bin/bitcoin-cli -regtest decoderawtransaction $1
#echo $readableTransaction
