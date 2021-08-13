# Paragraph

**Category**: Component

## Description

The `Paragraph` component takes in a string of text and formats it correctly. The component returns a `div` element that wraps a list of [`Typography`](https://material-ui.com/components/typography/) elements. These represent paragraphs and line breaks that are passed in through the `text` prop will automatically be split into new paragraphs. These paragraphs are seperated by a slight margin to differentiate them from normal line breaks.

> See this component in action [here](https://tams.club/about)!

## Props

| Name      | Type   | Required | Default | Description                             |
| --------- | ------ | -------- | ------- | --------------------------------------- |
| text      | string | Y        | ''      | Text to display                         |
| fontSize  | string | N        | '1rem'  | Font size of the textx                  |
| className | string | N        | null    | React class name to style the outer div |

## Example

The paragraph component is used to split and display text:

```jsx title="client/src/components/about/about.js"
<Paragraph text={data.aboutText} fontSize="1.1rem" />
```
