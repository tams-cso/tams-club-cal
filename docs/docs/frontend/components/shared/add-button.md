# AddButton

**Category**: Component

## Description

The `AddButton` component is an extension of the [Floating Action Button](https://material-ui.com/components/floating-action-button/) component. This component is mostly fixed and floats above all content on the bottom right hand corner of the screen. The only exception to this is if `editHistory` is true; `editHistory` AddButtons will be `display: flex` and be a wide button with contain the words `EDIT HISTORY`.

> See this component in action [here as a floating button](https://tams.club) and [here as an edit history button](https://tams.club/edit/events?id=eb613273-8726-468a-a2be-abf73056be22)!

## Props

| Name        | Type                             | Required | Default   | Description                                                  |
| ----------- | -------------------------------- | -------- | --------- | ------------------------------------------------------------ |
| path        | string                           | Y        | '#'       | Path to redirect to on click                                 |
| label       | string                           | Y        | ''        | Label of the resource being edited on; will show in tooltip  |
| color       | [Color](../../typedefs.md#color) | N        | 'default' | Color of the FAB                                             |
| edit        | boolean                          | N        | false     | If `true`, will display edit tooltip and icon instead of add |
| editHistory | boolean                          | N        | false     | If `true`, will display a static edit history button         |

## Example

Add button on its own, with `color`, `label`, and `path` defined.

```jsx title="client/src/components/home/list/event-list.js"
<AddButton color="primary" label="Event" path="/edit/events" />
```

Add button embedded on an edit page to display the "Show edit history" button, if an `id` is defined.

```jsx title="client/src/components/edit/edit-events.js"
{
    id ? <AddButton editHistory path={`/edit/history/events?id=${id}`} /> : null;
}
```
