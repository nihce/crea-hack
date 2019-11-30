#!/bin/bash
#sign transaction
signed=$(./bin/bitcoin-cli -regtest signrawtransaction $1)
# echo $signed