# The Brown University Band’s website

Welcome to the repository for the Brown Band!

## Documentation

(this whole thing is probably somewhat out of date, so if you see any issues please correct them)

### Getting Started

This site is a static site powered by [Eleventy (11ty)](https://www.11ty.dev) and hosted on [TBD]. That means that the files in this repository are transformed by a build script producing a folder full of plain HTML files that any static site host can serve. If [TBD] ceases to exist, you should have a wide variety of competitors to choose from. Hopefully.

To get started making updates to the website, make sure you have [Node.js](https://nodejs.org/en/) and [Git](https://git-scm.com) installed on your computer. I recommend using something like [nvm](https://github.com/nvm-sh/nvm) (or my favorite, [asdf](https://asdf-vm.com)), which will automatically pick up the `.node-version` file in this repository and prompt you to install that version of Node.

In a terminal, run `git clone https://github.com/brown-band/website` to copy the website to your computer. Then open a terminal to the folder that this README file is in, and run `npm install` to install most dependencies. Once that finishes, you can run one of several scripts via `npm run`:

- <code>npm run **start**</code> (or `npm start` for short): Runs Eleventy in development mode, starting a local server and rebuilding whenever you change a file. Open https://localhost:8080 to view the website locally!
- <code>npm run **build**</code>: Runs Eleventy once, outputting the generated site in the `public` folder. Run this before uploading the contents of that folder to a static site host. (There’s typically no need for you to do this, since a new build will be automatically triggered whenever you push updated code to GitHub)
- <code>npm run **format**</code>: Runs [Prettier](https://prettier.io) to ensure consistent code and document formatting. Ideally, set up your code editor to run Prettier whenever you save a file — check out their [editor integration docs](https://prettier.io/docs/en/editors.html) or search your editor’s package manager for a “Prettier” package.
- <code>npm run **start:book**</code> and <code>npm run **build:book**</code>: like `npm start` and `npm run build` but for the script book. See below!

### File organization

- `assets`: miscellaneous static files (i.e. images, JS, CSS, and anything else that you need that isn’t a page)
  - `handle-password.js`: checks the password provided for encrypted pages (currently just `recordings.html`)
  - `recordings.js`: renders the decrypted recordings page on the client side and enables playback.
  - `check-purged.js`: checks that CSS removed to reduce file size is not actually being used.
- `book`: handles printing the script books given to seniors at graduation. See below for details.
- `book-html`: the output directory for `npm run book:*`, not checked into Git.
- `buttons`: contains folders for each class year. See below for more detailed instructions.
  - `buttons/[year]/labels.yml`: contains a mapping from college name → button description for that year
- `components`: See each file for a description of the props it expects
  - `CryptoWall.jsx`: password field, currently only used by the recordings page
  - `Footer.jsx`: the page footer
  - `Icon.jsx`: renders icons from `icons.svg`
  - `Markdown.jsx`: helper for rendering Markdown to HTML
  - `Nav.jsx`: renders the navbar, and is responsible for highlighting the active item
  - `Script.jsx`: displays the metadata and content for a single show script
  - `Toc.jsx`: renders a table of contents
  - `TocButton.jsx`: the button for toggling the table of contents on mobile
- `config`: things that make Eleventy work the way we want. Includes functionality common to both the book and the website.
  - `index.js`: various config things. If you’re adding new config, consider putting it here unless it only applies to the website (i.e. not the book)
  - `markdown.mjs`: Uses [remark](https://remark.js.org) to handle all the Markdown files
  - `minify.js`: Slims down Bootstrap by removing unused CSS classes. It should pick up most things you use automatically, but if you dynamically add Bootstrap classes using JS, make sure to add them to the `safelist` so they work properly. Also, either minifies or formats the HTML being output.
  - `scripts.js`: Creates collections of the scripts for every semester (used to render the script pages) and a list of those collections (used to render the scripts homepage).
  - `templates.js`: Loads in the template config
- `data`: contains a combination of static data (`.yml` files) and scripts that produce the relevant data for the website (`.js` files)
  - `people/*.yml`: lists the section leaders, appointed positions, conductors, and members of band board.
  - `buttons.js`: scans the `buttons` folder and formats the buttons for display on the buttons page
  - `eleventyComputed.js`: (in order)
    - identifies the opponent (i.e. who Brown was playing) in all of our scripts
    - handles automatically creating titles for pages that don’t specify them.
    - figures out the right semesters to include in the book
    - (it might do other things too if this section is out of date, go check!)
  - `nav.yml`: contains the data for the nav bar
  - `quote.js`: selects the random quote displayed on the site header
  - `schoolColors.yml`: Contains the primary color used by most/all of the schools we’ve played in the past. The `color` property is used by the buttons page to tint the table headers and the script renderer to color the college names in the script titles. The `type` property is used to help split the buttons page into categories.
  - `site.yml`: global metadata for the website (currently just the title)
  - `specialButtons.yml`: list of buttons that don’t fit into any of the existing categories
- `layouts`
  - `base.jsx`: contains the basic page layout (shared across print and web), including the page title, CSS/JS imports, and page content
  - `web.jsx`: contains the navbar and `container` (which sets the maximum width of the content) (inherits `base.jsx`)
  - `page.jsx`: renders the page title and summary (inherits `web.jsx`)
- `node_modules`: Created by `npm install`. Don’t change it yourself — instead use `npm` commands to add and remove packages.
- `pages`: the pages on the website. Each page is automatically compiled into HTML by Eleventy.
  - `scripts`: show scripts. Contains a subfolder for each year’s scripts, with `fall` and `spring` subfolders.
  - `index.md`: the homepage
  - `script-semester.jsx`: Eleventy copies this page for every semester for which we have scripts for.
- `public`: the output directory, not checked into Git. Eleventy creates and updates (but does not delete) files in this directory when you run `npm start` or `npm run build`.
- `.node-version`: the version of Node.js that the website is confirmed to build properly with. Feel free to update this any time (but make sure you double-check that things still work properly!).
- `eleventy.config.js`, `eleventy-book.config.js`: configuration files for Eleventy. See docs inside the file for more details.
- `jsconfig.json`: used to configure TypeScript language features for editor integration (we’re not actually using TypeScript at this point, but the autocomplete it provides is sometimes helpful)
- `package.json`, `package-lock.json`: lists the packages used by the website (both on the frontend and on the backend), and defines the scripts accessible using `npm run`.
  - the convention I’ve tried to maintain is that packages from which one or more files are copied into `public/` during the build process get installed as `dependencies`, and everything else gets installed into `devDependencies`.

### Technical Overview

#### Templates

You’ll notice three kinds of files in the `pages/` folder:

1. HTML files (`.html`). These are copied as-is (with the content injected into the appropriate layout) into `public/`.
2. Markdown files (`.md`). These are converted to HTML by Eleventy using the code in `config/markdown.mjs`, and then follow the HTML process.
3. JSX files (`.jsx`). These are handled by [`eleventy-hast-jsx`](https://www.npmjs.com/package/eleventy-hast-jsx) package, which has a bunch of documentation around how the JSX files are processed. Note that these are _not_ using React in any way, and are converted to HTML strings at build time. If you want to have an interactive web page, write some separate client-side JS (check out `recordings.jsx` and `recordings.js` for an example). See “Why JSX?” below for the rationale behind this somewhat unusual choice.

#### Book

`paged.js` is used to convert a single long HTML page into a long PDF for printing. A second Eleventy config file `eleventy-book.config.js` is used because some configuration needs to be slightly different. The page used for printing (`pages/scripts/book.jsx`) is ignored by the main site’s Eleventy config.

#### Components

…live in the `components` folder if they’re used by multiple files (or are intended to be shared). Otherwise, they generally go at the bottom of the page they are used on.

### Layouts

You probably won’t need to create a new one, but definitely feel free to do so! Remember that the `base.jsx` layout is used by both the website and the book, so make sure any changes you make there work with both.

### ES Modules

Currently, only one file uses the ES Modules syntax (which was first proposed in 2015 (!) and is very slowly being adopted across the ecosystem). Hopefully the ecosystem will catch up at some point! In that case, definitely feel free to move things over — or not.

If you’re reading this in the future, check in on ESM support in the main blocking dependencies (`@11ty/eleventy` and `eleventy-hast-jsx`). If Eleventy fully supports ES Modules and `eleventy-hast-jsx` doesn’t, ping Jed. :)

### Common Tasks

#### Updating Leadership

To update the people page, edit the files in `data/people/`.

For band board and the conductors, provide the following properties:

- `position`:
  - this does not need to be updated when the person in the position changes
  - for band board: an object with these properties
    - `name`: the name of the position
    - `sec`: the section of the constitution that creates this position
    - `role`: a sentence describing the role of this position
  - for conductors: just a string containing the name of the position
- `name`: full name
- `email`: email
- `link`: apostrophe link provided by the person
- `year` graduation year (2 digits, represented as a number)
  - If you’re seeing unexpected behavior because people are graduating on or after 2100, I’m sorry. (actually I’m probably dead and therefore not capable of being sorry)
- `bio`: bio provided by the person. Uses a YAML [“literal block scalar”](https://web.archive.org/web/20211119210045/https://yaml-multiline.info) to preserve newlines. Make sure to keep the `|` after the `:`, and start the bio on the next line.

For section leaders and appointed positions, provide the following properties:

- `name`: the name of the position.
- `people`: a list of objects with these properties:
  - `name`: the person’s full name
  - `email`: their email
  - `year`: their graduation year (2 digits, represented as a number). See disclaimer above about this property

#### Adding Buttons

First, save a lossless copy of the button image for posterity (do **not** convert this back from the `.jpg`, instead make sure you get a `.png` or vector graphic file from the corsec)

1. In the `band-media` repository, create a new folder inside `buttons` with the current year, i.e. `2031-2032`
2. Add `.png` files for each button to that folder, with lowercased names. Replace spaces in the name with dashes.

Next, back in this repo:

1. Create a new folder inside `buttons` with the current year, i.e. `2031-2032`
2. Convert the button images from above to `.jpg` and add them to the new folder, with the same naming convention as the `.png` files above.
   - I (Jed) used 80% quality for my conversions, but feel free to pick an appropriate value!
   - This is done because JPEGs are significantly (~90%) smaller than the original PNGs. Git is annoying to use with huge files, so I leave that issue for the (hopefully less-frequently-updated) media repo. Feel free to swap out the JPEGs for whatever fancy new format the people from your time have cooked up! Just make sure you encode from the original PNGs rather than re-encoding the JPEGs.
3. Create a `labels.yml` file inside that folder.
   - Use the following format for each line: <code>_College Name (with proper spaces and capitalization)_: _Description on Button_</code>
   - For the description, include any text on the button. For graphic elements (such as images), enclose a brief description of the graphic in braces (`{}`). If the description starts with a brace or a quote, make sure you wrap it in quotes so YAML handles it properly.
   - Look at old buttons for examples of how to write the description!

That’s it! The build script will automatically pick up the new buttons and add them to the buttons page.

#### Adding Scripts

1. Create a new folder for the current semester (in `pages/scripts`, following existing patterns) if necessary
2. Create a new `.md` file for the script, with the name based on either the opponent or the name of the event (check previous scripts for inspiration)
3. In the script file, add a front matter section with the following information:
   - `sport`: the type of sport — either `football` or `hockey`. Leave this out if the script is for a non-sports-game event.
   - `teams`: the teams at the sports game. Again, leave this out for non-sports scripts. An object with two keys:
     - `home`: the team that was at home (if it was a home game for us, that will be Brown; otherwise, it will be the opponent)
     - `away`: the other team (i.e. the one that that was the away team for this game)
     - each team should be an object with these two keys:
       - `name`: The human-readable name of the college/university (usually abbreviated), e.g. `Harvard`, `Penn`, `Holy Cross`
       - `score` (optional): the score that team had at the end of the game. This can usually be found online pretty easily. But if not, just leave it off.
   - sometimes, you won’t know the score or whether we were home or away (this applies more to historical games than ones from the present). In that case, specify an `opponent` key instead of `teams`, and just give the name of the opponent (e.g. `opponent: Princeton`)
   - `title`: if the event is unusual in some way, set a custom title.
   - `date`: this is _very required_ and the site will not build without it. Specify the date the event occurred on. Feel free to guess for historical events if necessary, but make sure you leave a comment (`# ....`) above the date describing your rationale so it doesn’t get treated as authoritative.

#### Compiling senior script books

1. In `eleventy-book.config.js`, update `graduationYear` (to the desired graduation year, with a .5 if the book is for a .5er) and `extraYear` (to `true` if you’re making it for someone who took an extra year, `false` otherwise)
2. Run `npm run build:book`, then open `book/book.pdf` in your favorite PDF viewer. Expect it to be around 100 pages.
3. Make sure there are no typos and everything is laid out decently, then…
   - If you have to make changes, run `npm run start:book` and open http://localhost:8080 in your browser to get a live preview of what the book will look like. Note that you will have to manually refresh to get CSS changes to apply, due to the way the paging library works.
4. [TODO: fill out this step once I figure out how to print it out]

#### Adding/removing pages

1. Create a new `.md` file in the `pages` folder. The name of the file will be the URL (i.e. `about-us.md` is `/about-us`).
   - The title will be automatically created from the name of the file by replacing dashes with spaces and title-casing. If this behavior is incorrect, specify the `title` property in the front matter (front matter is described below)
   - Use the `.html` extension if you want to write HTML instead of Markdown.
2. (optional) Add [front matter](https://www.11ty.dev/docs/data-frontmatter/) (three dashes on a line, followed by some YAML, followed by three more dashes on a line, followed by the actual content of the file). You can specify any data here, but currently the website supports:
   - `title`: A custom title for the page. By default, it will be generated from the file name, so in most cases you won’t need to manually specify it.
     - if the default title is only wrong due to mis-capitalizing an acronym or similar, add the correct capitalization to the `special` array at the end of the `title` function in `eleventyComputed.js` and it will be used instead.
   - `layout`: defaults to `page.njk` (i.e. `layouts/page.njk`). Specify a different layout if you want.
   - `summary`: italicized, indented text displayed between the title and the content
   - `showHeader`: disable the default header. for when you want a something custom
   - `toc`: By default, a table of contents will be generated for any page with at least one header with an `id` property (put `{#id}` at the end of a heading to set an ID). You can override this by specifying `toc: false` to disable the table of contents, or pass an array of custom headings (check out `buttons.html` for an example of this).
   - (there are a bunch more for scripts, described below)
   - check out [Eleventy’s docs](https://www.11ty.dev/docs/data-configuration/) for additional options.
3. Add the page content, formatted using Markdown. You can use [Nunjucks template commands](https://mozilla.github.io/nunjucks/templating.html) to incorporate data into the page.
4. Add the page to the navbar:
   - To add it at the top level, edit `Nav.jsx` to add a link to the page (use the “Contact” link as an example)
   - To add it to a menu, edit `nav.yml` by adding an entry somewhere with the path of the page (without the file extension; use the others as an example). The title will be automatically picked up.

#### Adding an icon

To add a new icon to `assets/icons.svg`:

1. Find the icon you want online, in SVG format. Make sure it has a free/permissive license!
2. Create a new `<symbol>` element in `assets/icons.svg`:
   - The `id` property should be an ID (use `kebab-case` and avoid spaces).
   - The `viewBox` property should match the one on the `<svg>` tag of the SVG you’re copying
     - if there isn’t a `viewBox` property, `0 0 width height` (where `width` and `height`) are replaced by those properties on the SVG) should work.
3. Paste everything inside of the `<svg>` tag into the `<symbol>`.

---

## Descriptions of design decisions

### Why Eleventy?

I (Jed) chose Eleventy for several reasons.

- I hadn’t used it before and wanted to try something new
- I like JavaScript and am comfortable writing it
- Eleventy is a few years old but still quite modern and actively maintained
- Very little of the content of this repo is actually specific to Eleventy.
  - Most static site generators have a concept of front matter, data files, layouts, includes, and assets.
  - The templates are written in a popular template language (Nunjucks), which is quite similar to Liquid (used by Jekyll and others) and Handlebars.
- Unlike static site generators that offer framework integration (Gatsby, Next.js, Nuxt, …), Eleventy does not impose any requirements or restrictions on the frontend.
  - For what the band site does now, plain old static HTML with a little vanilla JS sprinkled on top is perfectly adequate.
  - I built a site with Gatsby once and it is so unnecessarily complicated. Most of the code in this repo is about making a site for the band, not appeasing the framework.
- The previous website was built with Drupal. PHP bad.

One downside of Eleventy is that, because it’s code-based with no graphical editor, it is less accessible to people with no coding background. However, Markdown is becoming more and more common, and I doubt the band will have a shortage of CS students anytime soon.

While I think I’ve made a sound technical decision in late 2021, I’m not naïve enough to believe that Eleventy will always be the best option. Use your own judgement! Hopefully the work I put into converting the various pieces of historical data into a reasonable format will make it reasonably easy to switch over to a new platform/framework. If the website just needs a fresh coat of paint, you can rewrite `layouts` and `includes` (and throw out Bootstrap if you want) while still keeping Eleventy around.

If you ever get really stuck with something, you can always [reach out to me](mailto:jed@jedfox.com) and I’ll do my best to lend a hand!

### Why JSX?

JSX is the fourth template language I tried using while building this website. (The first three were Liquid, Nunjucks, and Handlebars.) The common issues I saw with all three were that auto-formatter support (in particular Prettier, but I did look around a bit for alternatives) was lacking, and that it was hard to do “real logic” in the templates.

Formatting was lacking, I think, because template languages are extremely difficult to write a formatter for. There is Prettier support for Handlebars, but it did not support all the language features, and being confident that it will always produce correct results is very hard. Fundamentally, a template language mixes two programming languages (in our case, Markdown or HTML and the language that defines the `{{ ... }}` and `{% ... %}` syntax) with no structure. Interpolations can theoretically contain any content, meaning that solving the parsing problem for all cases is impossible (and solving it for “reasonable” cases is extremely difficult). You could, for example, wrap an if statement around only the opening tag of an HTML tag. (That isn’t theoretical, while looking for test cases while trying to [improve Prettier’s Handlebars formatting support](https://github.com/prettier/prettier/pull/12037) I found real examples of this).

And logic, I believe, is lacking because writing programming languages is hard. There are projects like EJS which attempt to merge a “real” language like JavaScript with template content (but they encounter a much harder version of the formatting problem because both languages are highly complex). As a result, most template languages come up with their own mini-language for pulling properties off of objects and running helper functions. Since the top level of most template languages is defined to output literal content (for ease of use and readability reasons), there isn’t a good place to define helper functions. Handlebars came the closest here with its “inline partials,” but its language is otherwise quite limited.

I realized that JSX (used by React) solves many of these problems. The locations you can inject arbitrary expressions are quite tightly limited to only the “normal” places. Because of this (and because it is very widely used), formatter and tooling support is excellent. Because JavaScript is a full-featured language, you can easily write helper functions and share code across files. I was able to go from 5–6 “shortcodes” in Nunjucks (and 15–20 for Handlebars) to zero for JSX. Unfortunately, Eleventy doesn’t support JSX by default. So I spent a few days making a plugin that lets it do just that, which seems to work ok for the use case I’ve tested it on (namely, this site). It runs fairly quickly (only a bit slower than Handlebars) and mostly works as you’d expect.
