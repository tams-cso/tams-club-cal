# Volunteering Database

## Data Collection

```js
{
    _id: ObjectId("[Mongodb auto-generated ID]"),
    name: "[The name of the volunteering]",
    club: "[The club(s) associated with the volunteering]",
    description: "[The description of the volunteering]",
    signupTime: "[The signup datetime in UTC millis (if applicable)]",
    filters: {
        limited: "[Boolean - true if volunteering has limited spots]",
        semester: "[Boolean - true if volunteereing is a semester-long committment]",
        setTimes: "[Boolean - true if volunteering times are pre-determined]",
        weekly: "[Boolean - true if volunteering repeats weekly]",
        open: "[Boolean - true if the volunteering is currently open]"
    }
}
```

### Properties

- _id
- name
- club
- description
- signupTime
- filters
    - limited
    - semester
    - setTimes
    - weekly
    - open
