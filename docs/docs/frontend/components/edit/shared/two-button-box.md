# TwoButtonBox

**Category**: Component

## Description

The AddButton component is displayed at the bottom of each edit page and contains 2 buttons: Cancel and [Submit]. The submit button text is customized by the `success` prop.

> See this component in action [here](https://tams.club/edit/events)!

## Props

| Name      | Type     | Required | Default  | Description                                            |
| --------- | -------- | -------- | -------- | ------------------------------------------------------ |
| success   | string   | Y        | "Submit" | Text to show on success button (submit, upload, etc)   |
| onCancel  | Function | Y        |          | Function to run if the user presses `cancel`           |
| onSuccess | Function | Y        |          | Function to run if the user presses the success button |
| submit    | boolean  | N        | false    | True if the button is a form submit button             |
| right     | boolean  | N        | false    | True if align button right                             |
| className | string   | N        | null     | React className object                                 |

## Example

```jsx title="client/src/components/edit/edit-events.js"
<form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
    // ...other form content
    <TwoButtonBox success="Submit" onCancel={back} onSuccess={onSubmit} submit right />
</form>
```
