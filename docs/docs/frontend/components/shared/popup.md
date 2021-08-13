# Popup

**Category**: Component

## Description

The `Popup` is shown in the bottom left corner. This component will be used to display important feedback to the user. The popup display is controlled through its [Redux state](../../redux.md). More information about opening the popup can be found on that page.

The `Popup` component itself is only implemented in `client/src/app.js` because its message and opening is controlled through the Redux store.

> See this component in action [by adding an event here](https://staging.tams.club/edit/events)!

## Props

_This component has no props_

## Example

```jsx title="client/src/app.js"
<div className={classes.root}>
    <Popup />
    // ...other children
</div>
```
