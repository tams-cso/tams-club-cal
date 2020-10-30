# Club Calendar

## Setup

Create a [Google Cloud project](https://console.cloud.google.com/) and create a project, enabling the Google Drive, Google Sheets, and Google Calendar APIs.

Generate a service account and download the config file. You will use the `client_email` and `private_key` fields.

Add the following to the environmental variables (`.env`) file (use quotation marks around the variables eg. `SHEET_ID="234fn321iHUeeZX329ff2_TXE"`):

```
SHEET_ID=[enter the ID of the google sheets from the form responses here]
CALENDAR_ID=[enter the ID for the google calendar to use]
PRIVATE_KEY=[enter the private key from the config file]
CLIENT_EMAIL=[enter the client email from the config file]
FORM_URL=[enter the url to the google form]
PORT=[(optional) port number]
```

Install packages with `yarn install`

## Execution

Simply type `yarn start` to run the program

## TODO

- Remove the .then() on api calls and move the info into the outer async functions
- Line 162: Increment p using the number of elements instead of in the loop
- Add PUG and use the html templating engine to add the FORM_URL from the .env instead of hardcoding it
- Add info for contributing
- Add html metadata and SEO stuff
- Design favicon!
