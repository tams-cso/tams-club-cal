# TAMS Club Calendar [WIP]

## Development Information

**None of the following setup information is accurate because of significant design and infrastructure changes for the second version** Check out the [old-site branch](https://github.com/MichaelZhao21/club-calendar-view/tree/old-site) for the current version deployed on the [tams.club](https://tams.club) website.

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

## Ideas Doc

[Here's the document for all of our ideas](https://docs.google.com/document/d/1U_zqoEiplk0ODeGdMTzK1aLhz9OYFQV0FlhSI52VSBo)
