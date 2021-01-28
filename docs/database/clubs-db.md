# Clubs Database

## Info Collection

```js
{
    _id: ObjectId("[Mongodb auto-generated ID]"),
    objId: "[16-digit generated hex ID]",
    name: "[The name of the club]",
    advised: "[Boolean - true if the club is advised]",
    fb: "[Facebook link of club]",
    website: "[Link to website of club]",
    coverImgThumbnail: "[String representing the ID of the thumbnail image]"
}
```

### Properties

- _id
- objId
- name
- advised
- fb
- website
- coverImgThumbnail

## Data Collection

```js
{
    _id: ObjectId("[Mongodb auto-generated ID]"),
    objId: "[16-digit generated hex ID]",
    description: "[The description of the club]",
    coverImg: "[String representing the ID of the image]",
    execs: [
        {
            name: "[Name of the exec]",
            position: "[Position of the exec]",
            description: "[Description/bio of the exec]",
            img: "[String ID of the image]"
        },
        //...
    ],
    committees: [
        {
            name: "[Name of the committee]",
            description: "[Description of the committee]",
            fb: "[Facebook link of committee]",
            website: "[Link to website of committee]"
        },
        //...
    ]
}
```

### Properties

- _id
- objId
- description
- coverImg
- execs
    - name
    - position
    - description
    - img
- committees 
    - name
    - description
    - fb
    - website