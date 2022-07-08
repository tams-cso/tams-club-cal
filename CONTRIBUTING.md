# How to Contribute to TAMS Club Calendar

Welcome! We are a completely open-source project, so feel free to contributue as much or as little as you would like! 

## :flight_departure: Where to start

If this is your first time working on an open source project, you can check out the [good first issue label](https://github.com/MichaelZhao21/tams-club-cal/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) for easier or smaller bits of code you can work on. You can also just look through this page and the READMEs and fix some inconsistent or incorrect information. We are, after all, developers and not english majors, so there's always room for our documentation to improve! For the more veteran contributors, please feel free to look around at the issues page for a good issue to work on.

To request to work on an issue, simply comment on the given issue. An admin will change the status of the issue, and you are free to work on the issue. Make sure to keep up with the comment thread of the issue, in case there are others interested in working on the same issue or comments by the project maintainers. If you are a contributor for this repo, make sure you are assigning the issue to yourself -- this will automatically run a workflow that updates the issue status.

## :floppy_disk: Technologies we Use

### Frontend

The frontend site is mainly bootstrapped through the **Next.js** framework, which builds off of the **React.js** component system. Next.js allows us to easily manage routing as well as Server-Side Rendering (SSR). On top of this framework, we also use **Material UI** to make writing CSS and components easier. Material UI has a ton of great built-in components that we use, as well as an intuitive CSS-in-JSS system built off of **Emotion**. To actually write our code, we use the modern **Typescript** language, which is simply a safer and typed Javascript (and it [transpiles](https://en.wikipedia.org/wiki/Source-to-source_compiler) into Javascript). Some other smaller libraries include **dayjs** for date formatting, **react-hook-form** for managing a lot of the form inputs, and **universal-cookie** for managing cookies.

* [Next.js](https://nextjs.org) - Main frontend framework
* [React.js](https://reactjs.org) - Virtual DOM and component library for frontend
* [Material UI](https://mui.com) - CSS library providing tons of prebuilt components
* [Emotion](https://emotion.sh/docs/introduction) - CSS-in-JS library (built into Material-UI)
* [Typescript](https://www.typescriptlang.org/) - Typed Javascript!

### Backend

The backend server runs almost entirely using the **Express** framework. For simplicity’s sake, we have decided to use the same language, Typescript, for both the frontend and backend. The other major library that we use is **Mongoose**, which is how we interact with our NoSQL MongoDB database. In addition to these two, we also utilize a lot of useful libraries: middleware libraries (**cors**, **compression**, **helmet**, **cookie-parser**, **morgan**), **dayjs** (date formatting), **multer** (form data parsing), **sharp** (image processing), **uuid** (generating uuidv4), and **aws-sdk** (accessing AWS S3 resource).

* [Express](https://expressjs.com/) - Complete Node.js backend REST server framework
* [Mongoose ODM](https://mongoosejs.com/) - Object modeling for accessing MongoDB

### Build

To build the application for deployment, we use **esbuild**. Additionally, we use **fs-extra** to copy over files quickly. The Next.js CLI (Command Line Interface) also provides a painless build command that will completely build the frontend app! Using these tools, we bring it all together using **Docker**. Docker will build all of our files into a [container](https://www.docker.com/resources/what-container/), which can be run with a single command on the deployment server.

* [esbuild](https://esbuild.github.io/) - Super fast transpiler and bundler to create production builds
* [Docker](https://www.docker.com/) - Container build and deployment

### CI/CD

CI/CD stands for continuous integration, continuous deployment. This is what allows us to efficiently write new features, review contributor code, and deploy updates to the production environment. We do this using a couple of extremely helpful platforms. The main CI/CD tool used is **Github Actions**, which runs short build scripts on Github’s servers that can automatically build and deploy the source code given a certain condition. Our Action will create a staging build for all merged pull requests and a production build for all new releases. There are also actions for managing issues such as adding/removing the status tags. All actions are located in the `.github/workflows` directory.

* [Github Actions](https://github.com/features/actions) - Handles CI/CD through automated workflows

## Deployment

There are a multitude of platforms that help tams.club run smoothly. First of all, **Github** hosts all the code and manages contributions through the issue and pull request system. All the text data is stored on **MongoDB**, a NoSQL database that is hosted through their **MongoDB Atlas** platform. We also use an **AWS S3 Bucket** to hold our images, from club cover images to profile pictures. These are served through the CDN provided from **AWS Cloudfront**. Both these AWS services are basically free, based on our minimal usage. Our app also connects with the **Google Cloud Platform** to sync event data with TAMS Club Calendar Google Calendar, as well as provide the "Login with Google" functionality. Finally, the entire website (both frontend and backend Docker instances) are being hosted on a **DigitalOcean Droplet**. I ([Michael Zhao](https://github.com/MichaelZhao21)) am actually hosting both these instances on my personal droplet (server), which costs me about $5/month and gives 25GB of disk and 1GB of RAM.

* [Github](https://www.github.com) - Probably the website you are on right now
* [MongoDB](https://www.mongodb.com/) - NoSQL Database
* [MongoDB Atlas](https://www.mongodb.com/atlas) - MongoDB in the cloud!
* [AWS S3](https://aws.amazon.com/s3/) - AWS Blob Storage solution
* [AWS Cloudfront](https://aws.amazon.com/cloudfront/) - AWS content delivery network
* [Google Cloud Platform](https://cloud.google.com/) - All of Google's cloud computing resources
* [DigitalOcean](https://www.digitalocean.com/) - Cloud server hosting provider

## :ant: Bug Reports

Bugs are common in programs that are constantly being developed! Once you have identified a bug, please fill out an issue for the relavent bug. Try to describe the bug in as much detail as possible, so that other people have an easier time resolving it. If you would like to resolve the bug report you have just created, see [Resolving Bugs or Tackling Issues](#resolving-bugs-or-tackling-issues). There is also a form on the actual site on the [About page](https://tams.club/about) which will log feedback internally. Those requests might take much longer to resolve as an admin will need to manually check and act on those points of feedback. We suggest you create an issue on the Github repo for the fastest results!

## :bulb: New Ideas or Feature Requests

We welcome all new ideas! Please follow the issue template for a feature request to make sure that it can be worked on properly. Again, just like with bug reports, please be **as specific as possible**. It can be hard sometimes to describe what you are thinking in just words, so we have a section at the bottom for you to attach media, links, or other resources that can help visualize your idea. If you would like to work on the proposed idea, see [Resolving Bugs or Tackling Issues](#resolving-bugs-or-tackling-issues). Otherwise, someone will hopefully come along and tackle the issue. Make sure you check in on your issues as an admin might comment on the issue asking for more elaboration -- these will be tagged with `Status: Needs More Info`.

## :open_book: Resolving Bugs or Tackling Issues

So you see an issue that you like? As Beyoncé famously said, "_If you like it, then you shoulda put a ring on it._" In other words, **make sure you claim an issue _BEFORE_ you start working on it.** This will guarentee that two people won't be working on the same issue at the same time. You can simply comment "I want to work on this issue" (or some variant of this) on the issue you want to work on, and an admin will come and update the status of the issue. When creating a pull request, make sure to reference the issue next to the `Fixes #` section. Typing the number after the hashtag should automatically link and close the issue when the pull request is merged.

## :pencil: Submitting Changes

Once you've made the changes that you need, please use the pull request template to create a pull request. Keep you title short and simple (but still descriptive enough to know what the pull request addresses). There is more space within the template to describe in detail what you have changed.

## :computer: Coding Conventions

I am formatting the code with [Prettier](https://prettier.io/) as the [VSCode extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) (There are probably similar extensions in other IDEs as well). The `.prettierrc` file contains the
formatting rules for Prettier and will be automatically applied when formatting with the VSCode extension. This is highly recommended as messy code can lead to hours of lost time for everyone involved.

### File and Organization Conventions

All files will be named with **lowercase** letters and **dash-seperated** (called **kebab case**!). This is because on legacy systems, capital letters will be ignored in file names. In terms of file organization, the client and server top-level folders contain each individual program, with seperate `package.json` files and `node_modules` folders. The file organization is detailed below:

```
.github - Contains all workflows and issue templates
client - Contains client (frontend) code
    | pages - All page components representing routes in the app, see https://nextjs.org/docs/basic-features/pages
    | public - Public resources such as images, favicons, and the manifest
    | src - Location of other main source code for the frontend
        | components - Folder for all components that are used in the pages, grouped by page
        | api.ts - Functions for backend API calls
        | data.json - Main hardcoded data for the site
        | types - All type declarations for the frontend (most are type declaration files; no need to import!)
            | global.d.ts - General and misc type declarations
            | admin.d.ts - Admin type declarations
            | club.d.ts - Club type declarations
            | event.d.ts - Event type declarations
            | history.d.ts - History type declarations
            | response.d.ts - Fetch response type declarations
            | textData.d.ts - Text data type declarations (eg. external links)
            | volunteering.d.ts - Volunteering type declarations
            | enums.ts - <EXCEPTION> Enums cannot be in .d.ts files, so enums need to be IMPORTED!
        | theme.ts/darkTheme.ts - Theme definitions
        | util - All utility functions
            | constructors.ts - Constructor functions for all objects
            | cssUtil.ts - CSS utility funtions
            | dataParsing.tsx - Parsing functions for data (mostly event data)
            | datetime.ts - Functions for parsing and formatting date/time
            | miscUtil.ts - Miscellaneous util functions
    | next.config.js - Next.js configuration file, see https://nextjs.org/docs/api-reference/next.config.js/introduction
    | tsconfig.json - Configuration file for typescript settings
server - Contains server (backend) code
    | files - env and status JSON files for mapping values
    | functions - Function definitions, used in routes
    | models - Mongoose models
    | routes - Main Express routers
    | types - Type declaration files
    | .env - Not in Git but required for backend development, contains all the environmental variables
    | app.ts - Entry point script for backend server
    | esbuild.js - Build script for backend
.dockerignore - Ignore file for Docker
.gitignore - Ignore file for Git
.prettierrc - Formatting file used by the Prettier VSCode extension
docker-runner.sh - Script to run both the client and server in the docker container
Dockerfile - Main docker build config file
package.json - Main Node.js package file with all dependencies, dev dependencies, and yarn scripts
typedoc.json - Configuration file for typedoc
yarn.lock - Dependency tree file, AUTOGENERATED BY YARN
```

### JS/JSX Conventions

Most of the standard JS formatting will be taken care of by the extension (such as spaces around operators, bracket style, and whitespace). However, there are a few rules that cannot be detected by a formatter:

- There should be a space around each function/method definition
- In components, try to keep all const definitions (such as state variables) at the top. All `useEffect` and similar hooks should be placed right before the return statement
- If code is used multiple times across components or js files, place it in the `util.js` file in its own function
- All functions outside of React components **must** have TSDoc written, describing in detail what the function does, its parameters, and the return methods. See the [TSDoc website](https://tsdoc.org/) for more information. A great example of this is the [Paragraph component](https://github.com/MichaelZhao21/tams-club-cal/blob/master/client/src/components/shared/paragraph.tsx), which has a great block comment describing the function, as well as an interface with comments describing the props that are passed in
- As shown in the point above, [Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html) are used to describe the `props` object that can be passed into each React component. Since documentation is generated from these comments and IntelliSense uses these comments for coding hints, it is **imperative** you have well-written comments for all components!

**Imports** should be grouped together in the following order:

1. At the top, you should `import React from 'react'`, along with all other **function** imports
2. In the second group, put all **components** should be imported (MUI Components then local components)
4. In the fourth group, JSON and image file imports

Note that all external libraries should be imported _before local libraries_ (see the first group in the example below).

See the example below from the [EditEvents component](https://github.com/MichaelZhao21/tams-club-cal/blob/master/client/pages/edit/events/%5B%5B...id%5D%5D.tsx):

```js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';
import dayjs, { Dayjs } from 'dayjs';
import { createPopupEvent, createEvent, darkSwitch } from '../../../src/util';
import { getEvent, getOverlappingReservations, postEvent, putEvent } from '../../../src/api';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import DateTimeInput from '../../../src/components/edit/events/date-time-input';
import ControlledCheckbox from '../../../src/components/edit/events/controlled-checkbox';
import ControlledTextField from '../../../src/components/edit/shared/controlled-text-field';
import UploadBackdrop from '../../../src/components/edit/shared/upload-backdrop';
import TwoButtonBox from '../../../src/components/shared/two-button-box';
import LocationSelect from '../../../src/components/edit/events/location-select';
import DateInput from '../../../src/components/edit/events/date-input';
import AddButton from '../../../src/components/shared/add-button';
import FormWrapper from '../../../src/components/edit/shared/form-wrapper';
import Spacer from '../../../src/components/shared/spacer';
import Popup from '../../../src/components/shared/popup';
import EditWrapper from '../../../src/components/edit/shared/edit-wrapper';
import Link from '../../../src/components/shared/Link';
import TitleMeta from '../../../src/components/meta/title-meta';
import RobotBlockMeta from '../../../src/components/meta/robot-block-meta';

import data from '../../../src/data.json';
```

Special note for **Material UI Component Imports**: Instead of importing from the entire `@mui/material` library, it is better practice to import a specific subpackage within that library.

Instead of:

```js
import { [component] } from '@mui/material';
```

**Do this**:

```js
import [component] from '@mui/material/[component]'; 
```

### CSS Formatting

Well, this isn't the CSS you might be used to, but CSS-in-JS is a *LOT* easier, in my opinion. I won't explain it here, but the [Material UI documentation](https://mui.com/system/the-sx-prop/) has a great explanation. Essentially, we embed the CSS in the JSX code as an object. All CSS properties are therefore keys, and their string values are the property values. In this way, we simply need to follow the formatting rules for JS!

However, there are a few specifics with Material UI. We use a theming system across the site, so almost all colors will need to come from the main theme (see [theme.js](https://github.com/MichaelZhao21/tams-club-cal/blob/master/client/src/theme.ts)). To use the theme, import it into your file and use the `theme` object instead of a hardcoded string. See the [CalendarDay component](https://github.com/MichaelZhao21/tams-club-cal/blob/master/client/src/components/calendar/calendar-day.tsx) for an example of this. All fonts should be set in the same `theme.ts` file, but if needed, use `em` and `rem` for fonts, as that scales with the main font scaling and helps with accessibility.

A lot of the formatting still comes down to coder discretion but just keep in mind that you won't be the only person reading the code! As long as it makes sense and another programmer can figure out what your CSS does, it shouldn't be too much of a concern.

### Final Coding Tips

Remember that these coding conventions are put in place not neccessarily to help you code faster, but to make your code more readable and easier to follow for *other people*. Especially given that this is an open-source project, it's imperative that your code can be understood quickly and easily by others! If there is a place where you need to break away from the above formatting because it makes more sense to, feel free to do it. We are going for **maximum re-readability**. If you have any questions, do not hesitate to ask one of the admin or contact [Michael Zhao](https://MichaelZhao21). Have fun working on our project, and we look forward to seeing your innovative contributions!
