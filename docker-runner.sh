#!/bin/bash

# Start the client app
node client/server.js &
  
# Start the server app
node server/app.js &
  
# Wait for any process to exit
wait -n
  
# Exit with status of process that exited first
exit $?

