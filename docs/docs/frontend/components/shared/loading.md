# Loading

**Category**: Component

## Description

The `Loading` component can display one of two things. The first is simple a display text that shows the word "Loading..." on a card component. The other is "ERROR :(" with some customizable info text below it. The only special prop is `flat`, which will remove all elevation from the element. Otherwise, it will have a default elevation of `2`.

> See this component in action [here](https://tams.club)! (That is, if your internet is slow)

## Props

| Name     | Type    | Required | Default | Description                                                                                    |
| -------- | ------- | -------- | ------- | ---------------------------------------------------------------------------------------------- |
| error    | boolean | N        | false   | If `true`, shows the error title and displays any helper text                                  |
| flat     | boolean | N        | false   | If `true`, will display card at elevation of `0`                                               |
| children | node    | N        |         | Any helper text to display underneath the ERROR title; this will be hidden if `error` if false |

## Example

The basic loading component is being used as a placeholder for the component list item as it loads.

```jsx title="client/src/components/home/home.js"
const [eventComponentList, setEventComponentList] = useState(<Loading />);
```

This default loading will either be replaced by the actual component list or be replaced by the error message, if it fails to load.

```jsx title="client/src/components/home/home.js"
if (events.status !== 200) {
    setEventComponentList(
        <Loading error>
            Could not get event data. Please reload the page or contact the site manager to fix this issue.
        </Loading>
    );
    return;
}
```
