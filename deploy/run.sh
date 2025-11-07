#!/bin/bash

WORKDIR="/home/dusza/dusza-web-2024/"

cd $WORKDIR

while true; do
  if ! npm run start; then
    echo "Application exited with an error. Retrying in 5 seconds..."
  else
    echo "Application exited. Restarting in 5 seconds..."
  fi
  sleep 5
done