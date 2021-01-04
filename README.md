# TAMS Club Calendar [WIP]

## Development Information

Check out the [old-site branch](https://github.com/MichaelZhao21/club-calendar-view/tree/old-site) for the current version deployed on the [tams.club](https://tams.club) website. The new version in development is currently being hosted at [test.tams.club](https://test.tams.club). CI/CD is being developed through Github Actions and hopefully will be avaliable soon!

[Here's the document](https://docs.google.com/document/d/1U_zqoEiplk0ODeGdMTzK1aLhz9OYFQV0FlhSI52VSBo) for all the ideas, planning, and other notes for this project.

## Contribution

*// TODO: this section*

## Setup

```bash
git clone https://github.com/MichaelZhao21/tams-club-cal.git
cd tams-club-cal/client && yarn install
cd ../server && yarn install
```

Create the config file at `client/src/files/config.json` (**For the `backend` field, don't put a `/` after**):

```json
{
    "backend": "[address that the backend server is hosted on (eg. http://localhost:5000)]"
}
```

If you would like to help develop the backend, email or message [MichaelZhao21](https://github.com/MichaelZhao21) to get access to the database. If are just developing frontend, you can simply use `https://api.tams.club` as the backend address in the json file and only run the frontend (`client` folder). You will not need to do the following step if you are only developing frontend.

Create the environmental variable file at `server/.env`:

```.env
MONGO_USER="[Username for cluster]"
MONGO_PASS="[Password for cluster]"
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
