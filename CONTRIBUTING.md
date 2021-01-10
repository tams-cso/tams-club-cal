# How to Contribute to TAMS Club Calendar

Welcome! We are a completely open-source project, so feel free to contributue as much or as little as you would like! :smile:

| :warning: | These contributing guidelines are incomplete! If you would like to add anything, simply make a pull request for this file :) |
| --------- | ---------------------------------------------------------------------------------------------------------------------------- |

## :flight_departure: Where to start

If this is your first time working on an open source project, you can check out the [good first issue label](https://github.com/MichaelZhao21/tams-club-cal/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) for easier or smaller bits of code you can work on. For the more veteran contributors, please feel free to look around at the issues page for a good issue to work on!

## :floppy_disk: Technologies we Use

This project is completely written in [Javascript](https://www.javascript.com/), [HTML5](https://html.com/html5/), and [Sass (SCSS)](https://sass-lang.com/)! We are running both our frontend and backend javascript on [Nodejs 14 (lts/fermium)](https://nodejs.org/en/).

The frontend uses these main libraries:

-   [React.js](https://reactjs.org/) for the main framework of the entire site
-   [Redux](https://redux.js.org/) for the global state management (because React is a little lacking in that department)

The backend uses these main libraries:

-   [Express.js](https://expressjs.com/) as the framework for managing API calls and routes
-   [MongoDB Node.js API](https://docs.mongodb.com/drivers/node/) to store information in a secure database

## :beetle: Bug Reports

Bugs are common in programs that are constantly being developed! Once you have identified a bug, please fill out an issue for the relavent bug. Try to describe the bug in as much detail as possible, so that other people have an easier time resolving it. If you would like to resolve the bug report you have just created, see [Resolving Bugs or Tackling Issues](#resolving-bugs-or-tackling-issues).

## :bulb: New Ideas or Feature Requests

We welcome all new ideas! Please follow the issue template for a feature request to make sure that it can be worked on properly. Again, just like with bug reports, please be **as specific as possible**. It can be especially hard to describe what you are thinking in just words, so we have a section at the bottom for you to attach media, links, or other resources that can help visualize your idea. If you would like to work on the proposed idea, see [Resolving Bugs or Tackling Issues](#resolving-bugs-or-tackling-issues).

## :open_book: Resolving Bugs or Tackling Issues

So you see an issue that you like? As Beyoncé famously said, "_If you like it, then you shoulda put a ring on it._" In other words, **make sure you claim an issue _BEFORE_ you start working on it.** This will guarentee that two people won't be working on the same issue at the same time. You can simply comment "I want to work on this issue" (or some variant of this) on the issue you want to work on.

## :pencil: Submitting Changes

Once you've made the changes that you need, please use the pull request template to create a pull request. Keep you title short and simple (but still descriptive enough to know what the pull request addresses). There is more space within the template to describe in detail what you have changed.

## :computer: Coding Conventions

We will auto-format code with [Prettier](https://prettier.io/) when a pull request is merged, but you can also use it if you install the [extension on VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) (and probably other IDEs as well).

More will be added to this section in the future for standardized Javascript coding conventions (such as spaces after commas and around operators).
