#!/bin/bash

# Variables
REPO_DIR="/home/dusza/dusza-web-2024"
APP_NAME="dusza-web-2024"
CHECK_INTERVAL=60  # Check every 60 seconds

#Derived
CI_SCREEN_NAME="${APP_NAME}_ci"

# Function to start a screen or restart if already running
start_screen() {
  local screen_name=$1
  local command=$2

  if screen -list | grep -q "$screen_name"; then
    screen -S $screen_name -X quit
  fi
  screen -dmS "$screen_name" bash -c "$command"
}

# Function to check for updates and restart the application if needed
check_and_restart() {
  # Pull latest changes from GitHub
  cd $REPO_DIR
  git fetch origin main

  # Check if there are any new changes
  if git diff --quiet HEAD origin/main; then
    echo "No changes detected. Checking again in $CHECK_INTERVAL seconds."
  else
    echo "Pulling changes..."
    
    # Pull the latest changes
    if ! git pull origin main; then
      echo "Error pulling changes. Please check the error message above."
      return
    fi

    # Rebuild the application
    if ! npm install; then
      echo "Error during npm install. Please check the error message above."
      return
    fi
    if ! npx prisma migrate deploy; then
      echo "Error during Prisma migration. Please check the error message above."
      return
    fi
    if ! npx prisma generate; then
      echo "Error during Prisma Client generation. Please check the error message above."
      return
    fi
    if ! npm run build; then
      echo "Error during build. Please check the error message above."
      return
    fi

    # Start a new screen session and run the application
    start_screen $APP_NAME "$REPO_DIR/deploy/run.sh"
  fi
}

# Function to start the CI script in a screen session
start_ci() {
  npm install
  npx prisma generate
  npm run build
  start_screen $APP_NAME "$REPO_DIR/deploy/run.sh"
  start_screen $CI_SCREEN_NAME "$0 inside_screen"
  echo "CI script and APP started."
}

# Function to stop the CI script
stop_ci() {
  screen -S $CI_SCREEN_NAME -X quit
  echo "CI script stopped."
}

# Handle arguments
case "$1" in
  start)
    start_ci
    ;;
  stop)
    stop_ci
    ;;
  attach)
    screen -r $APP_NAME
    ;;
  attach_ci)
    screen -r $CI_SCREEN_NAME
    ;;
  inside_screen)
    while true; do
      check_and_restart
      sleep $CHECK_INTERVAL
    done
    ;;
  *)
    echo "Usage: $0 {start|stop|attach|attach ci}"
    exit 1
    ;;
esac
