# How to Contribute to TAMS Club Calendar

Welcome! We are a completely open-source project, so feel free to contributue as much or as little as you would like! 

## :flight_departure: Where to start

If this is your first time working on an open source project, you can check out the [good first issue label](https://github.com/MichaelZhao21/tams-club-cal/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) for easier or smaller bits of code you can work on. You can also look around the documentation and make some grammar and sentence flow changes. We are, after all, developers and not english majors, so our documentation can always improve! For the more veteran contributors, please feel free to look around at the issues page for a good issue to work on.

## :floppy_disk: Technologies we Use

This project is completely written in [Javascript](https://www.javascript.com/), [HTML5](https://html.com/html5/), and [Sass (SCSS)](https://sass-lang.com/)! We are running both our frontend and backend javascript on [Nodejs 14 (lts/fermium)](https://nodejs.org/en/). All in all, we use a pretty standard MERN stack.

The frontend uses these main libraries:

-   [React.js](https://reactjs.org/) - main framework for the site
-   [Redux](https://redux.js.org/) - global state management (because React is a little lacking in that department)
-   [Material UI](https://material-ui.com) - component library and styling library all wrapped in one; replaces traditional CSS and provides lots of useful components
-   [React Hook Form](https://react-hook-form.com/) - library for managing forms such as the add/edit forms, as well as other inputs used throughout the site

The backend uses these main libraries:

-   [Express.js](https://expressjs.com/) - framework for managing API calls and routes
-   [Mongoose ODM](https://mongoosejs.com/) - library used to access MongoDB documents and manage their schemas

## :ant: Bug Reports

Bugs are common in programs that are constantly being developed! Once you have identified a bug, please fill out an issue for the relavent bug. Try to describe the bug in as much detail as possible, so that other people have an easier time resolving it. If you would like to resolve the bug report you have just created, see [Resolving Bugs or Tackling Issues](#resolving-bugs-or-tackling-issues).

## :bulb: New Ideas or Feature Requests

We welcome all new ideas! Please follow the issue template for a feature request to make sure that it can be worked on properly. Again, just like with bug reports, please be **as specific as possible**. It can be especially hard to describe what you are thinking in just words, so we have a section at the bottom for you to attach media, links, or other resources that can help visualize your idea. If you would like to work on the proposed idea, see [Resolving Bugs or Tackling Issues](#resolving-bugs-or-tackling-issues).

## :open_book: Resolving Bugs or Tackling Issues

So you see an issue that you like? As Beyoncé famously said, "_If you like it, then you shoulda put a ring on it._" In other words, **make sure you claim an issue _BEFORE_ you start working on it.** This will guarentee that two people won't be working on the same issue at the same time. You can simply comment "I want to work on this issue" (or some variant of this) on the issue you want to work on.

## :pencil: Submitting Changes

Once you've made the changes that you need, please use the pull request template to create a pull request. Keep you title short and simple (but still descriptive enough to know what the pull request addresses). There is more space within the template to describe in detail what you have changed.

## :computer: Coding Conventions

I am formatting the code with [Prettier](https://prettier.io/) as the [VSCode extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) (There are probably similar extensions in other IDEs as well). The `.prettierrc` file contains the
formatting rules for Prettier and will be automatically used when formatting with the VSCode extension.

### File and Organization Conventions

All files will be named with **lowercase** letters and **dash-seperated**. This is because on some systems, capital letters will be ignored in file names. In terms of file organization, the client and server top-level folders contain each individual program, with
seperate `package.json` files and `node_modules` folders. See the [documentation site](https://docs.tams.club) for more specific
information on file structure.

### JS/JSX Conventions

Most of the standard JS formatting will be taken care of by the extension (such as spaces around operators, bracket style, and whitespace). However, there are a few rules that cannot be detected by a formatter:

- There should be a space around each function/method definition
- In components, try to keep all const definitions (such as state variables) at the top. All `useEffect` and similar hooks should be placed right before the return statement.
- If code is used multiple times across components or js files, place it in the `util.js` file in its own function
- All functions outside of React components **must** have JSDoc written, describing in detail what the function does, its parameters, and the return methods. For standard functions, see the [basic JSDoc instructions](https://jsdoc.app/about-getting-started.html). If you are returning an object, please define a [typedef](https://jsdoc.app/tags-typedef.html)

### CSS Formatting

CSS is generally extremely difficult to format, and it can be extremely hard to read your own written css, let alone someone else's! That's why I am going to outline the css convention that will be used in _this project_. Remember that a lot of these standards are my personal preference, and there are many ways that people will format css.

This project uses Material UI's CSS-in-JS to style components. Material UI's components already come with a lot of styles, such as `import Button from '@material-ui/core/Button'`. However, we extend this styling using their [themeing system](https://material-ui.com/customization/theming/), as well as applying styles to each component individually using the [makeStyles function](https://material-ui.com/styles/api/#makestyles-styles-options-hook). An example is shown below from `/client/src/components/clubs/club-table.js`:

```js
const useStyles = makeStyles((theme) => ({
    tableLink: {
        textDecoration: 'none',
        color: 'inherit',
        transition: '0.3s',
        '&:hover': {
            backgroundColor: darkSwitch(theme, theme.palette.grey[200], theme.palette.grey[700]),
        },
    },
    advised: {
        color: theme.palette.primary.main,
    },
    independent: {
        color: theme.palette.secondary.main,
    },
}));
```

**CSS Tip!**

Again, a lot of the formatting still comes down to coder discretion but just keep in mind that you won't be the only person reading the code! As long as it makes sense and another programmer can figure out what your CSS does, it shouldn't be too much of a concern.

### Final Coding Tips

Remember that these coding conventions are put in place not neccessarily to help you code faster, but to make your code more readable and easier to follow for *other people*. Especially given that this is an open-source project, it's imperative that your code can be understood quickly and easily by others! If there is a place where you need to break away from the above formatting because it makes more sense to, feel free to do it. Again, we are going for maximum re-readability. Have fun working on our project, and we look forward to your contributions!