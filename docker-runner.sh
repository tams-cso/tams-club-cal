#!/bin/bash

# Start the first process
node client/server.js &
  
# Start the second process
node server/app.js &
  
# Wait for any process to exit
wait -n
  
# Exit with status of process that exited first
exit $?

