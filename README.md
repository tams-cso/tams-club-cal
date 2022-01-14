![TAMS Club Calendar](client/public/logo-banner.png)
The TAMS Club Calendar is a fully contained event tracker, club/volunteering database, and general resource center. This is the unofficial club event calendar for the [Texas Academy of Mathematics and Science (TAMS)](https://tams.unt.edu/) student organizations!

## Contribution

There is a page for instructions on [how to contribute](CONTRIBUTING.md). You can look through the issues, comment on the ones you like, and make a pull request to resolve them :D We also welcome any bug reports or feature requests ➔ [create a new issue](https://github.com/MichaelZhao21/tams-club-cal/issues/new)!

## Documentation

More information and general documentation can be found on our [documentation site](https://docs.tams.club). This project is still being actively developed, so expect a lot of missing and/or incorrect information.

For now, here are the links to the [planning Google Doc](https://docs.google.com/document/d/1U_zqoEiplk0ODeGdMTzK1aLhz9OYFQV0FlhSI52VSBo/edit?usp=sharing) and the [Figma prototype](https://www.figma.com/file/yp3mDSciGjMZBZknjbog49/TAMS-Club-Calendar?node-id=0%3A1)

## Setup

```bash
git clone https://github.com/MichaelZhao21/tams-club-cal.git
cd tams-club-cal && yarn install
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

AWS_ACCESS_ID="[AWS IAM User Access Key ID]"
AWS_SECRET_KEY="[AWS IAM User Secret Key]"

ORIGIN="[(optional) Origin requests are sent from. This is needed for google login -- thus, it will not work for local development]"
NO_ORIGIN_CHECK="[(optional) If true, all requests not from ORIGIN will be *denied with a 403 error*]"
STAGING="[(optional) On dev.tams.club, this value needs to be true to upload files to the correct bucket due to docker running in production]"
PORT="[(optional) The port to start the server on - DEPLOYMENTS SHOULD BE PORT 80 due to docker port mapping]"
```

The first thing you will need is a [Mongodb Atlas Cluster](https://www.mongodb.com/cloud/atlas). A free tier instance should be good enough. If you decide to opt for a local instance, make sure to use that username/password and url instead.

Next, an AWS account will need to be used to set up a [S3 bucket](https://aws.amazon.com/s3/) and connect that to a [CloudFront CDN](https://aws.amazon.com/cloudfront/). Then, create an IAM user and allow access to S3 management. Put that user's access key ID and secret in the `.env` file.

Additionally, you need to make a [Google Cloud Developer Account](https://cloud.google.com/docs), create a project, and make both OAuth 2.0 Client credentials and a service account credentials, enabling the Google Calendar API. The Oauth2 credentials and the service account email/private key should be placed in the `.env` file.

Finally, you will need to create a new [Google Calendar](https://calendar.google.com), share it with the service account email, and add the id and url to the `.env` file.

## Execution

To develop the frontend without a local backend, run `yarn dev:staging`, which will use the local frontend with http://dev.tams.club as the backend.

If you would like to host a local backend, run `yarn dev` and `yarn backend`. The first will start the frontend and the second will start the backend. To do this, you **must have all the required environmental variables**!
