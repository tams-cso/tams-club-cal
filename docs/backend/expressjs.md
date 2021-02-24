# API Reference

## Authentication

| Method                            | HTTP request       | Description                                               |
| --------------------------------- | ------------------ | --------------------------------------------------------- |
| [getUrl](backend/events.md#list)  | GET /auth          | Sends the Google authentication redirect URL              |
| [getToken](backend/events.md#get) | POST /auth         | Uses auth code to fetch access tokens and name            |
| [refresh](backend/events.md#add)  | POST /auth/refresh | Uses the refresh token to get a new access token and name |
| [getIp](backend/events.md#update) | GET /auth/ip       | Returns the user's IP address                             |

## Events

| Method                             | HTTP request          | Description         |
| ---------------------------------- | --------------------- | ------------------- |
| [list](backend/events.md#list)     | GET /events           | List of events      |
| [get](backend/events.md#get)       | GET /events/\<id\>    | Gets an event by id |
| [add](backend/events.md#add)       | POST /events          | Adds an event       |
| [update](backend/events.md#update) | POST /events/\<id\>   | Updates an event    |
| [delete](backend/events.md#delete) | DELETE /events/\<id\> | Deletes an event    |

## Clubs

| Method                            | HTTP request         | Description       |
| --------------------------------- | -------------------- | ----------------- |
| [list](backend/clubs.md#list)     | GET /clubs           | List of clubs     |
| [get](backend/clubs.md#get)       | GET /clubs/\<id\>    | Gets a club by id |
| [add](backend/clubs.md#add)       | POST /clubs          | Adds a club       |
| [update](backend/clubs.md#update) | POST /clubs/\<id\>   | Updates a club    |
| [delete](backend/clubs.md#delete) | DELETE /clubs/\<id\> | Deletes a club    |

## Volunteering

| Method                            | HTTP request         | Description                        |
| --------------------------------- | -------------------- | ---------------------------------- |
| [list](backend/clubs.md#list)     | GET /clubs           | List of volunteering               |
| [add](backend/clubs.md#add)       | POST /clubs          | Adds a volunteering opportunity    |
| [update](backend/clubs.md#update) | POST /clubs/\<id\>   | Updates a volunteering opportunity |
| [delete](backend/clubs.md#delete) | DELETE /clubs/\<id\> | Deletes a volunteering opportunity |

## Feedback

| Method                         | HTTP request   | Description             |
| ------------------------------ | -------------- | ----------------------- |
| [add](backend/feedback.md#add) | POST /feedback | Adds a feedback message |
