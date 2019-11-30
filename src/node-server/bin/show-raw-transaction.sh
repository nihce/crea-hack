#!/bin/bash
#show rawTransaction
rawTransaction=$(echo -n $1 | jq -r '.hex')
# echo $rawTransaction