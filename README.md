![TAMS Club Calendar](docs/_images/logo-banner.png)

An unofficial calendar for the [Texas Academy of Mathematics and Science (TAMS)](https://tams.unt.edu/) student organizations.

## Contribution

There is a page for instructions on [how to contribute](CONTRIBUTING.md). You can look through the issues, comment on the ones you like, and make a pull request to resolve them :D We also welcome any bug reports or feature requests ➔ [create a new issue](https://github.com/MichaelZhao21/tams-club-cal/issues/new)!

## Documentation

More information and general documentation can be found on our [documentation site](https://docs.tams.club). This project is still being actively developed, so expect a lot of missing and/or incorrect information.

For now, here are the links to the [planning Google Doc](https://docs.google.com/document/d/1U_zqoEiplk0ODeGdMTzK1aLhz9OYFQV0FlhSI52VSBo/edit?usp=sharing) and the [Figma prototype](https://www.figma.com/file/yp3mDSciGjMZBZknjbog49/TAMS-Club-Calendar?node-id=0%3A1)

## Setup

```bash
git clone https://github.com/MichaelZhao21/tams-club-cal.git
cd tams-club-cal/client && yarn install
cd ../server && yarn install
```

If you would like to help develop the backend, email or message [MichaelZhao21](https://github.com/MichaelZhao21) to get access to the database. If you are just developing frontend, you can simply use `https://dev.tams.club` as the backend address in the json file and only run the frontend (`client` folder). You will not need to do the following step if you are only developing frontend.

Create the environmental variable file at `server/.env`:

```.env
MONGO_USER="[Username for cluster]"
MONGO_PASS="[Password for cluster]"
MONGO_URL="[Connection URL to the mongodb cluster (eg. "tams-cal-db-staging.7d0nz.mongodb.net")]"

G_CLIENT_ID="[Google API OAuth 2.0 Client ID]"
G_CLIENT_SECRET="[Google API OAuth 2.0 Client Secret]"
SERVICE_EMAIL="[Google Cloud service account email]"
SERVICE_PRIVATE_KEY="[Google Cloud service account private key]"
CALENDAR_ID="[ID for Google Calendar for syncing]"
ORIGIN="[(optional) Origin to allow requests from. This will *deny requests from other origins* (eg. "http://localhost:3000")]"
PORT="[(optional) The port to start the server on]"
```

The first thing you will need is a [Mongodb Atlas Cluster](https://www.mongodb.com/cloud/atlas). A free tier instance should be good enough. If you decide to opt for a local instance, make sure to use that username/password and url instead.

Next, an AWS account will need to be used to set up a [S3 bucket](https://aws.amazon.com/s3/) and connect that to a [CloudFront CDN](https://aws.amazon.com/cloudfront/).

Additionally, you need to make a [Google Cloud Developer Account](https://cloud.google.com/docs), create a project, and make both OAuth 2.0 Client credentials and a service account credentials, enabling the Google Calendar API. The Oauth2 credentials and the service account email/private key should be placed in the `.env` file.

Finally, you will need to create a new [Google Calendar](https://calendar.google.com), share it with the service account email, and add the id and url to the `.env` file.

## Execution

To run the client:

```bash
cd client
yarn start
```

To run the server:

```bash
cd server
yarn start
```

## Deployment Notes

To run a deployment, go into the `server` folder and run `pm2 start ecosystem.config.js`.

**PM2 will not ignore watches unless you increase the number of inotify watches:**

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

To create a production version of the frontend, go into the `client` folder and run `yarn build`. This will create a production release of the site in the `/build` folder. Simply serve the static index.html and it should be up and running.

Don't forget to set the correct backend environmental variables and frontend config variables!
