# Deployment Notes

Create an index in MongoDB to optimize clubs + events searching:

```
db.<collection>.createIndex({ "objId": 1 }, { unique: true, name: "objIdIndex" });
```

This should be done for the following collections:

- `events.info`
- `events.data`
- `clubs.info`
- `clubs.data`
