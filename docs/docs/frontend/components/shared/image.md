# Image

**Category**: Component

## Description

The `Image` component is used to display images, with a fallback in case the image does not exist or is invalid. The image will default to a value defined by the `default` prop. You may set the width and height to a specified value. Additionally, the Image component can be displayed at a raised elevation or have a transparent background color.

For the `default` prop, you can pass in `/default-profile.webp` and `/default-cover.webp` for the profile pics and cover pics respectively.

> See this component in action [here](https://tams.club/clubs?id=0770a434-726e-4644-87ed-75afc4a9c193)!

## Props

| Name        | Type             | Required | Default   | Description                                                          |
| ----------- | ---------------- | -------- | --------- | -------------------------------------------------------------------- |
| src         | string           | Y        |           | Src of the image to display; will dynamically update image           |
| default     | string           | Y        |           | Src of the default fallback image to display                         |
| alt         | string           | Y        |           | Alt text to display for accessibility purposes (won't actually show) |
| width       | number \| string | N        | '100%'    | Width of the image                                                   |
| height      | number \| string | N        | 'inherit' | Height of the image                                                  |
| raised      | boolean          | N        | false     | If `true`, will add drop shadow to image                             |
| transparent | boolean          | N        | false     | If `true`, no background color surface color will be displayed       |

## Example

The image component is used to display a transparent-background banner on the about page.

```jsx title="client/src/components/about/about.js"
<Image src="/logo-banner.png" alt="TAMS Club Calendar" className={classes.image} transparent />
```

In the exec display card, the images have a drop shadow, which can be enabled through the `raised` prop.

```jsx title="client/src/components/clubs/exec-card.js"
<Image
    className={classes.image}
    src={props.exec.img}
    alt="profile pic"
    default="/default-profile.webp"
    raised
>
```
