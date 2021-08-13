# SortSelect

**Category**: Component

## Description

The `SortSelect` component is a simple [`Select`](https://material-ui.com/components/selects/) component with an [`IconButton`](https://material-ui.com/components/buttons/#icon-buttons) arrow component. This takes in 2 state variables, along with a list of filters.

All this component will do is manage handlers and display the `options` array as select options, setting the selected option to the `value` state. The `reverse` state will be true or false depending on which sort direction the user has selected.

> See this component in action [here](https://tams.club/volunteering)!

## Props

| Name       | Type     | Required | Default | Description                                          |
| ---------- | -------- | -------- | ------- | ---------------------------------------------------- |
| options    | string[] | Y        | []      | Array of select options                              |
| value      | string   | Y        |         | State variable to store the value of the select      |
| setValue   | Function | Y        |         | Function to change the `value` state variable        |
| reverse    | string   | Y        |         | State variable to store if sorting order is reversed |
| setReverse | Function | Y        |         | Function to change the `reverse` state variable      |

## Example

```jsx title="client/src/components/volunteering/volunteering-list.js"
<Box width="100%" marginBottom={2} display="flex" alignItems="center">
    // ...other children
    <SortSelect value={sort} setValue={setSort} reverse={reverse} setReverse={setReverse} options={['name', 'club']} />
</Box>
```
