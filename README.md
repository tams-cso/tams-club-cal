# Club Calendar

## Setup

Create a [Google Cloud project](https://console.cloud.google.com/) and create a project, enabling the Google Drive, Google Sheets, and Google Calendar APIs.

Generate a service account and download the config file. You will use the `client_email` and `private_key` fields.

Add the following to the environmental variables (`.env`) file (use quotation marks around the variables eg. `SHEET_ID="234fn321iHUeeZX329ff2_TXE"`):

```
PRIVATE_KEY=[enter the private key from the config file]
CLIENT_EMAIL=[enter the client email from the config file]
PORT=[(optional) port number - default is 5000]
```

Install packages with `yarn install`

Also if you want to use this, change `data.json` and `index.html` links/ids 

## Execution

Simply type `yarn start` to run the program

## TODO

- Remove the .then() on api calls and move the info into the outer async functions
- Update readme explaining how to change stuff in the data.json file
- Also get rid of the extra .env stuff in the instructions (only need private key and client email)
- Add info for how to contribute
- Add error checking on ALL API CALLS (just add a `.catch(console.error)` after those functions)
  - Also add lots of checks for undefined behavior
  - Verify if the incoming POST request from google is actually valid
- Add html metadata and SEO stuff
- Design favicon!
- Better looking homepage
- Maybe try pulling data directly from Facebook posts, but I guess we need to do some in-depth analysis of the how clubs post dates ~ regex!
- Have only the upcoming events and pull from cal when ppl load the page
  - Add cache for cal events so only when it updates do we pull
  - So ig to that extent, we need to add a webhook to check for when calendar gets updated
- Extract `[${now.toISOString()}] message` to function, where `now` is `new Date()`
- Change address to use the process variable instead of hardcoding it in the `createWebhookChannel` function
