# Title

**Category**: Component

## Description

This is one of the simplest components as it only sets the page title (shown in the site tab). The `Title` component is used when there is no `PageWrapper` to set the title.

By default, the title to be displayed is `[name] | [resource] - TAMS Club Calendar`. If `editHistory` is `true`, the text `[Edit History]` will be prepended to the title. If the `title` prop is defined, then all other props will be ignored and the title will be `[title] - TAMS Club Calendar`.

Either `name` + `resource` or `title` is required.

## Props

| Name        | Type                                   | Required | Default | Description                                  |
| ----------- | -------------------------------------- | -------- | ------- | -------------------------------------------- |
| name        | string                                 | Y\*      |         | Name of the resource                         |
| resource    | [Resource](../../typedefs.md#resource) | Y\*      |         | Resource of the page                         |
| editHistory | string                                 | N        | false   | If true, will show edit history before title |
| title       | string                                 | N        |         | Title of the page to show                    |

\* Not required if `title` is defined

## Example

```jsx title="client/src/components/clubs/club-display.js"
<Container className={classes.root}>
    <Title resource="clubs" name={club.name} />
    // ...other container children
</Container>
```
