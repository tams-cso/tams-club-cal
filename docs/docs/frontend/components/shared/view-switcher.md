# ViewSwitcher

**Category**: Component

## Description

The `ViewSwitcher` component is displayed at the top of the list pages. This component is used to switch the view from a list to a grid with a simple toggle that controls a boolean state variable.

> See this component in action [here](https://tams.club/clubs)!

## Props

| Name        | Type     | Required | Default | Description                                         |
| ----------- | -------- | -------- | ------- | --------------------------------------------------- |
| listView    | boolean  | Y        |         | List view state object; true if list view is active |
| setListView | Function | Y        |         | Function to set list view state object              |
| className   | string   | N        | null    | React classname prop                                |

## Example

```jsx title="client/src/components/clubs/club-list.js"
<Box width="100%" marginBottom={2} display="flex" alignItems="center" height={48} justifyContent="flex-end">
    // ...other box children
    <ViewSwitcher listView={listView} setListView={setListView} className={classes.viewSwitcher} />
</Box>
```
