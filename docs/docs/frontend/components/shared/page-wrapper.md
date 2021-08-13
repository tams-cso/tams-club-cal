# PageWrapper

**Category**: Component

## Description

This component wraps most of the pages on the site. It's a simple wrapper that adds some padding, manages the height, and sets a title, if the `title` field is defined.

## Props

| Name     | Type    | Required | Default | Description                                                               |
| -------- | ------- | -------- | ------- | ------------------------------------------------------------------------- |
| title    | string  | N        |         | If defined, will display `[title] - TAMS Club Calendar` as the page title |
| noBottom | boolean | N        | false   | If `true`, will not have a bottom padding                                 |

## Example

All page wrappers simply wrap the entire page component and provide it with a title if defined.

```jsx title="client/src/components/volunteering/volunteering.js"
<PageWrapper title="Volunteering">{display}</PageWrapper>
```
