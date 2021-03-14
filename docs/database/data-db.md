# Data Database

## Users Collection

```js
{
    _id: ObjectId("[Mongodb auto-generated ID]"),
    email: "[Email address of the user]",
    refresh: "[Google API refresh token of the user]",
    lastRequest: "[Millisecond datetime of last request]"
}
```

### Properties

- _id
- email
- refresh
- lastRequest

## Logs Collections

```js
{
    _id: ObjectId("[Mongodb auto-generated ID]"),
    date: "[Date of saved logs]",
    log: "[String log of that day]"
}
```

### Properties

- _id
- date
- log
