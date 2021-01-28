# Events Database

## Info Collection

```js
{
    _id: ObjectId("[Mongodb auto-generated ID]"),
    objId: "[16-digit generated hex ID]",
    name: "[The name of the event]",
    club: "[The club(s) associated with the event]",
    start: "[The starting datetime of the event in UTC millis]",
    end: "[The ending datetime of the event in UTC millis]"
}
```

### Properties

- _id
- objId
- name
- club
- start
- end

## Data Collection

```js
{
    _id: ObjectId("[Mongodb auto-generated ID]"),
    objId: "[16-digit generated hex ID]",
    links: [
        "[List of strings as links related to the event]",
        // etc...
    ],
    description: "[The description for the event]",
    editedBy: [
        "[List of strings as people who edit the event, the first being the adder]"
        // TODO: THIS WILL CHANGE TO OBJECTS!
        // etc...
    ]
}
```

### Properties

- _id
- objId
- links
- description
- editedBy