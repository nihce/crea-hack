#!/bin/bash
#add mining fee to transaction and store funded transaction
funded=$(./bin/bitcoin-cli -regtest fundrawtransaction $1 | jq -r '.hex')
#echo $funded