![TAMS Club Calendar](docs/_images/logo-banner.png)

An unofficial calendar for the [Texas Academy of Mathematics and Science (TAMS)](https://tams.unt.edu/) student organizations.

## Contribution

Find out how to contribute [here](CONTRIBUTING.md)! You can look through the issues, comment on the ones you like, and make a pull request to resolve them :grinning: We also welcome any bug reports or feature requests ➔ create a new issue [here](https://github.com/MichaelZhao21/tams-club-cal/issues/new)!

## Documentation

More information and general documentation can be found on our [documentation site](https://docs.tams.club). This project is still being actively developed, so expect a lot of missing and/or incorrect information.

For now, here are the links to the [planning Google Doc](https://docs.google.com/document/d/1U_zqoEiplk0ODeGdMTzK1aLhz9OYFQV0FlhSI52VSBo/edit?usp=sharing) and the [Figma prototype](https://www.figma.com/file/yp3mDSciGjMZBZknjbog49/TAMS-Club-Calendar?node-id=0%3A1)

## Setup

```bash
git clone https://github.com/MichaelZhao21/tams-club-cal.git
cd tams-club-cal/client && yarn install
cd ../server && yarn install
```

Create the config file at `client/src/files/config.json` (**For the `backend` field, don't put a `/` after**):

```json
{
    "backend": "[address that the backend server is hosted on (eg. http://localhost:5000)]",
    "apiKey": "[(optional) API key for backend. The https://dev.tams.club backend used for development does NOT need this]"
}
```

If you would like to help develop the backend, email or message [MichaelZhao21](https://github.com/MichaelZhao21) to get access to the database. If you are just developing frontend, you can simply use `https://api.tams.club` as the backend address in the json file and only run the frontend (`client` folder). You will not need to do the following step if you are only developing frontend.

Create the environmental variable file at `server/.env`:

```.env
MONGO_USER="[Username for cluster]"
MONGO_PASS="[Password for cluster]"
DROPBOX_TOKEN="[Token for dropbox app]"
```

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
