# TAMS Club Calendar

## Setup

Create a [Google Cloud project](https://console.cloud.google.com/) and create a project, enabling the Google Drive, Google Sheets, and Google Calendar APIs. Generate a service account and download the config file. You will use the `client_email` and `private_key` fields. Add the following to the environmental variables (`server/.env`) file (use quotation marks around the variables eg. `SHEET_ID="234fn321iHUeeZX329ff2_TXE"`):

```
PRIVATE_KEY=[enter the private key from the config file]
CLIENT_EMAIL=[enter the client email from the config file]
PORT=[(optional) port number - default is 5000]
TEST=[(optional) "true" if it's testing environment]
```

The `server/src/data.json` file contains a lot of the links and constants that are used. 

Install packages in both the `client` and `server` folders with `yarn install` (you need to do it twice in both folders)

## Execution

Simply type `yarn start` to run the program

## TODO

- Remove the .then() on api calls and move the info into the outer async functions
- Add info for how to contribute
- Add error checking on ALL API CALLS (just add a `.catch(console.error)` after those functions)
  - Also add lots of checks for undefined behavior
  - Verify if the incoming POST request from google is actually valid
- Add html metadata and SEO stuff
- Design favicon!
- Better looking homepage
- Have only the upcoming events and pull from cal when ppl load the page
  - Add cache for cal events so only when it updates do we pull
  - So ig to that extent, we need to add a [webhook](https://developers.google.com/calendar/v3/reference/events/watch) to check for when calendar gets updated
  - Also prob refersh the cache every day or smth just in case
- Extract `[${now.toISOString()}] message` to function, where `now` is `new Date()`
- Change address to use the process variable instead of hardcoding it in the `createWebhookChannel` function
- Add the webhook info to a file (JSON prob) and have the program stop it and create a new one upon restarting
- Update manifest
