---
sidebar_position: 3
sidebar_label: Mirage
---

# Mirage.js

[Mirage.js](https://miragejs.com/) is used as an API mocking library. By default, `yarn start` will use mirage as the backend service. Mirage can mock the entire backend, but post requests and such will not actually modify the data.

If you wish to start the frontend with the backend, you can use `yarn start:backend` to start the frontend while making calls to `http://localhost:5000`.

:::caution

To locally run the backend server, you must enter correct `server/.env` file information before running `yarn dev` or `yarn start`. See [Environmental Variables](../backend/env.md) for more info.

:::

Another option is to use the staging backend for your local frontend development. The `yarn start:staging` will use `https://dev.tams.club` as the backend. This instance of the backend is the same one used by `https://staging.tams.club`. This is the easier option and actually modifies the data when you send POST and PUT requests. 

## Development

If you wish to edit the mirage route handlers, you can modify `client/src/server.js`. The `client/src/mirage/` folder stores the fake data that is sent to the client.
