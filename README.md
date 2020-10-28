# Club Calendar

## Setup

Create a [Google Cloud project](https://console.cloud.google.com/) and create a project, enabling the Google Drive, Google Sheets, and Google Calendar APIs.

Generate a service account and download the config file, saving it as `config.js` in the root folder

Add the following to the environmental variables (`.env`) file:

```
SHEET_ID=[enter the ID of the google sheets from the form responses here]
CALENDAR_ID=[enter the ID for the google calendar to use]
PORT=[(optional) port number]
```

Install packages with `yarn install`

## Execution

Simply type `yarn start` to run the program