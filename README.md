# The Brown University Band’s website

Welcome to the repository for the Brown Band!

(this whole thing is probably somewhat out of date, so if you see any issues please correct them)

## Getting Started

This site is a static site powered by [Eleventy (11ty)](https://www.11ty.dev) and hosted on GitHub Pages. That means that the files in this repository are transformed by a build script producing a folder full of plain HTML files that any static site host can serve. If GitHub Pages ceases to exist, you should have a wide variety of competitors to choose from. Hopefully.

To get started making updates to the website, make sure you have [Node.js](https://nodejs.org/en/), [Git](https://git-scm.com), and [pnpm](https://pnpm.io) installed on your computer. I recommend using something like [nvm](https://github.com/nvm-sh/nvm) (or my favorite, [asdf](https://asdf-vm.com)), which will automatically pick up the `.node-version` file in this repository and prompt you to install that version of Node.

In a terminal, run `git clone https://github.com/brown-band/website` to copy the website to your computer. Then open a terminal to the folder that this README file is in, and run `pnpm install` to install most dependencies.

Next, copy the `.env.sample` file to `.env` and fill in the values by following the comments in the file.

Once you’ve done that, you can run one of several scripts via `pnpm`:

- <code>pnpm **start**</code>: Runs Eleventy in development mode, starting a local server and rebuilding whenever you change a file. Open https://localhost:8080 to view the website locally!
- <code>pnpm **build**</code>: Runs Eleventy once, outputting the generated site in the `public` folder. Run this before uploading the contents of that folder to a static site host. (There’s typically no need for you to do this, since a new build will be automatically triggered whenever you push updated code to GitHub)
- <code>pnpm **format**</code>: Runs [Prettier](https://prettier.io) to ensure consistent code and document formatting. Ideally, set up your code editor to run Prettier whenever you save a file — check out their [editor integration docs](https://prettier.io/docs/en/editors.html) or search your editor’s package manager for a “Prettier” package.
- <code>pnpm **start:book**</code> and <code>pnpm **build:book**</code>: like `pnpm start` and `pnpm build` but for the script book. See below!

(Why `pnpm` rather than npm? It is several times faster, especially when installing dependencies inside GitHub Actions.)

Optionally, check out the external documentation for packages this project uses for a deeper understanding of how things work (in approximately decreasing order of importance):

- [Eleventy](https://www.11ty.dev/docs/)
- [Node.js](https://nodejs.org/en/docs/)
- [`eleventy-hast-jsx`](https://github.com/j-f1/eleventy-hast-jsx)
- [Bootstrap](https://getbootstrap.com/docs/5.1/)
- [CommonMark](https://commonmark.org/help/)
- [unified](https://unifiedjs.com/learn/)
- [PurgeCSS](https://purgecss.com/configuration.html)
- [TOML](https://toml.io/en/)

If you’re a webmaster, make sure you have access to the Webmaster Folder on Google Drive, which has lots of interesting/useful stuff.

## File organization

This is intended as an overview; check out the individual files themselves as well as the other documentation sections below for more details.

Top-level folders:

- `assets`: miscellaneous static files (i.e. images, JS, CSS, and anything else that you need that isn’t a page)
  - `js`:
    - `handle-password.js`: checks the password provided for encrypted pages (currently just `recordings.html`)
    - `recordings.js`: renders the decrypted recordings page on the client side and enables playback.
    - `check-purged.js`: checks that CSS removed to reduce file size is not actually being used.
- `book`: handles printing the script books given to seniors at graduation. See below for details.
- `book-html`: the output directory for `pnpm run book:*`, not checked into Git.
- `buttons`: contains the labels for all the buttons. See below for more detailed instructions.
  - `buttons/[year].yml`: contains a mapping from college name → button description for that year
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
  - `bandstands.yml`: has info about all the issues of The Bandstand.
  - `buttons.js`: scans the `buttons` folder and the [`brown-band/buttons` repository](https://github.com/brown-band/buttons) and formats the buttons for display on the buttons page
  - `eleventyComputed.js`: (in order)
    - identifies the opponent (i.e. who Brown was playing) in all of our scripts
    - handles automatically creating titles for pages that don’t specify them.
    - figures out the right semesters to include in the book
    - (it might do other things too if this section is out of date, go check!)
  - `nav.yml`: contains the data for the nav bar
    - put just the path of the page (without a leading or trailing slash or extension) to automatically pick up the page’s title
    - use an object with `title` and `url` keys for external links
    - use an object with a `heading` key to add a section heading
    - use an object with a `disabled` key to add a disabled link
    - need to do something else? Add the necessary functionality to `components/Nav.jsx` (and make sure to document it here).
  - `quote.js`: selects the random quote displayed on the site header
  - `schoolColors.yml`: Contains the primary color used by most/all of the schools we’ve played in the past.
    - the `color` property is used by the buttons page to tint the table headers and the script renderer to color the college names in the script titles.
    - the `type` property is used to help split the buttons page into categories.
  - `site.yml`: global metadata for the website
    - `title`: the title of the website (“The Brown Band”)
    - `urls`: URLs for separately-hosted resources
      - `recordings`: the root URL for the encrypted media (see https://github.com/brown-band/recordings for details)
      - `buttons`: the root URL for the buttons page
  - `specialButtons.yml`: list of buttons that don’t fit into any of the existing categories
- `layouts`
  - `base.jsx`: contains the basic page layout (shared across print and web), including the page title, CSS/JS imports, and page content
  - `web.jsx`: contains the navbar and `container` (which sets the maximum width of the content) (inherits `base.jsx`)
  - `page.jsx`: renders the page title and summary (inherits `web.jsx`)
- `node_modules`: Created by `pnpm install`. Don’t change it yourself — instead use `pnpm` commands to add and remove packages.
- `pages`: the pages on the website. Each page is automatically compiled into HTML by Eleventy.
  - `scripts`: show scripts.
    - Contains a subfolder for each year’s scripts, with `fall` and `spring` subfolders.
    - Add an `.11tydata.yml` file (matching the name of the folder it goes into) to record the list of scriptwriters for a semester or year.
  - `index.md`: the homepage
  - `script-semester.jsx`: Eleventy copies this page for every semester for which we have scripts for.
- `public`: the output directory, not checked into Git. Eleventy creates and updates (but does not delete) files in this directory when you run `pnpm start` or `pnpm run build`.

Top-level files:

- `.editorconfig`: tells your editor how to indent code, using the [editorconfig.org](https://editorconfig.org/) format.
- `.env`, `.env.sample`: environment variables (i.e. configuration values that shouldn’t be made public for security reasons)
- `.gitignore`: tells Git which files to ignore.
- `.node-version`: the version of Node.js that the website is confirmed to build properly with. Feel free to update this any time (but make sure you double-check that things still work properly!).
- `.prettierignore`: tells Prettier to ignore output files.
- `.prettierrc.json`: configures Prettier. Avoid adding options here if possible.
- `brown-band.code-workspace`: If you clone all of the repos in the `brown-band` organization into a single folder, you can use this file to open them all at once in VS Code.
- `design-decisions.md`: see the bottom of this file
- `eleventy.config.js`, `eleventy-book.config.js`: configuration files for Eleventy. See the comments inside the files, as well as [Eleventy's docs](https://www.11ty.dev/docs/config/) for more details.
- `jsconfig.json`: used to configure TypeScript language features for editor integration (we’re not actually using TypeScript at this point, but the autocomplete it provides is sometimes helpful)
- `package.json`, `pnpm-lock.yaml`: lists the packages used by the website (both on the frontend and on the backend), and defines the scripts accessible using `pnpm`.
  - the convention I’ve tried to maintain is that packages from which one or more files are copied into `public/` during the build process get installed as `dependencies`, and everything else gets installed into `devDependencies`.
- `README.md`: congrats, you’ve found this file!

## Technical Overview

### Templates

You’ll notice three kinds of files in the `pages/` folder:

1. HTML files (`.html`). These are copied as-is (with the content injected into the appropriate layout) into `public/`.
2. Markdown files (`.md`). These are converted to HTML by Eleventy using the code in `config/markdown.mjs`, and then follow the HTML process.
3. JSX files (`.jsx`). These are handled by [`eleventy-hast-jsx`](https://www.npmjs.com/package/eleventy-hast-jsx) package, which has a bunch of documentation around how the JSX files are processed. Note that these are _not_ using React in any way, and are converted to HTML strings at build time. If you want to have an interactive web page, write some separate client-side JS (check out `recordings.jsx` and `recordings.js` for an example). See “Why JSX?” in [the design decisions doc](./design-decisions.md) for the rationale behind this choice.

You can use [Nunjucks template commands](https://mozilla.github.io/nunjucks/templating.html) in HTML and Markdown pages to incorporate data into the page, although you should switch to JSX if you’re doing anything fancy.

### Book

`paged.js` is used to convert a single long HTML page into a long PDF for printing. A second Eleventy config file `eleventy-book.config.js` is used because some configuration needs to be slightly different. The page used for printing (`pages/scripts/book.jsx`) is ignored by the main site’s Eleventy config.

### Components

…live in the `components` folder if they’re used by multiple files (or are intended to be shared). Otherwise, they generally go at the bottom of the page they are used on.

### Deployment

Deployment is via GitHub Pages because it is free for team projects (provided the repository is public). The workflow in `.github/workflows/deploy.yml` runs whenever you push to the `main` branch. It will overwrite any commits on the `gh-pages` branch, so avoid pushing anything there manually.

Builds currently (as of February 2022) take about 2–3 minutes to complete. If this significantly increases, consider looking into what is making things slow.

## Layouts

You probably won’t need to create a new one, but definitely feel free to do so! Remember that the `base.jsx` layout is used by both the website and the book, so make sure any changes you make there work with both.

## ES Modules

Currently, only one file uses the ES Modules syntax (which was first proposed in 2015 (!) and is very slowly being adopted across the ecosystem). Hopefully the ecosystem will catch up at some point! In that case, definitely feel free to move things over — or not.

If you’re reading this in the future, check in on ESM support in the main blocking dependencies ([`@11ty/eleventy`](https://github.com/11ty/eleventy/issues/836) and [`eleventy-hast-jsx`](https://github.com/j-f1/eleventy-hast-jsx/issues/1)). If Eleventy fully supports ES Modules and `eleventy-hast-jsx` doesn’t, ping Jed. :)

## Common Tasks

### Updating Leadership

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
- `bio`: bio provided by the person. Markdown is supported, so make sure to escape any special characters with a `\` (check by running `pnpm start` and then visiting http://localhost:8080/leadership/ to see if there’s anything that needs changing)

For section leaders and appointed positions, provide the following properties:

- `name`: the name of the position. Markdown is supported.
- `people`: a list of objects with these properties:
  - `name`: the person’s full name
  - `email`: their email
  - `year`: their graduation year (2 digits, represented as a number). See disclaimer above about this property.

### Adding Buttons

First, save a lossless copy of the button image to the [`brown-band/buttons`](https://github.com/brown-band/buttons) repository (do **not** convert this back from a `.jpg`, instead make sure you get a `.png` or vector graphic file from the corsec):

1. In the `buttons` repository, create a new folder inside `buttons` with the current year if it doesn’t already exist, i.e. `2031-2032`
2. Add `.png` (or `.svg` or any other lossless/vector format) files for each button to that folder, with lowercased names. Replace spaces in the name with dashes.

Next, back in this repo, create a new file inside the `buttons` folder with the current year and the `.yml` extension, i.e. `2031-2032.yml`:

- Use the following format for each line: <code>_College Name (with proper spaces and capitalization)_ = "_Description on Button_"</code>]
- If the college name has spaces, enclose it in quotes (`""`).
- For the description, include any text on the button. For graphic elements (such as images), enclose a brief description of the graphic in braces (`{}`).
- Look at old buttons for examples of how to write the description!

You might need to remove the `.cache` folder to tell Eleventy to re-download the list of buttons from the `buttons` repository.

That’s it! The build script will automatically pick up the new buttons and add them to the buttons page.

### Adding Scripts

1. Create a new folder for the current semester (in `pages/scripts`, following existing patterns) if necessary
2. Create a new `.md` file for the script, with the name based on either the opponent or the name of the event (check previous scripts for inspiration)
3. In the script file, add a front matter section with the following information (for more details on front matter and formatting in general, see the Adding/Removing Pages section below):
   - `sport`: the type of sport, lowercased. Leave this out if the script is for a non-sports-game event.
   - `teams`: the teams at the sports game. Again, leave this out for non-sports scripts. An object with two keys:
     - `home`: the team that was at home (if it was a home game for us, that will be Brown; otherwise, it will be the opponent)
     - `away`: the other team (i.e. the one that that was the away team for this game)
     - each team should be an object with these two keys:
       - `name`: The human-readable name of the college/university (usually abbreviated), e.g. `Harvard`, `Penn`, `Holy Cross`
       - `score` (optional): the score that team had at the end of the game. This can usually be found online pretty easily. But if not, just leave it off.
   - sometimes, you won’t know the score or whether we were home or away (this applies more to historical games than ones from the present). In that case, specify an `opponent` key instead of `teams`, and just give the name of the opponent (e.g. `opponent: Princeton`)
   - `date`: this is _very required_. Specify the date the event occurred on. Feel free to guess for historical events if necessary, but make sure you leave a comment (`# ....`) above the date describing your rationale so it doesn’t get treated as authoritative.
   - `title`: if the event is unusual in some way, set a custom title.
   - `subtitle`: optional, if there’s something special about this script, put it here.
     - for example: homecoming, parents’ weekend, or halloween
   - `location`: very optional. If the band played somewhere special, put that info here.

There are a few extensions to Markdown that this project uses to make it easier to encode scripts. Look at `directivesPlugin` in `config/markdown.mjs` for the code that powers this, and check out the [generic directives proposal](https://talk.commonmark.org/t/generic-directives-plugins-syntax/444) for a description of the syntax used.:

- `:script-tab` will insert a small chunk of blank space.
- `:break[…]` will force text inside the brackets to be broken at any character, rather than just word boundaries. This is only necessary if you have very long words (of at least 20-25 letters) in a script, and those words are long enough to break the page layout on mobile.
  - `:break[...]{hyphens}` will tell the browser to insert hyphens at syllable boundaries instead of breaking the text willy-nilly. This can sometimes be better, so try both ways and see what works well. Hyphenation is great for real words, while arbitrary-character breaks are great for fake ones.
- `:sd[...]` italicizes the text wrapped in brackets, and adds some fancy brackets around the text. Use this whenever the script tells the band to do something (like make a form or play a song) or otherwise gives non-spoken directions.
- Put `::script-note[...]` around a paragraph to mark it as being context or commentary.
  - You can also use a `:::script-note` block to wrap multiple paragraphs
- For lists (“A-B-C-D-E-F The Princeton Band!”), use a `:::script-list` block.
  - Leave blank lines between the `:::` lines and the list items, to make Prettier work right.
  - Use a single unordered list (i.e. `- blah`) inside the block with as many items as you’d like, and write in the delimiters yourself. This allows for flexibility regarding the progression of letters, which scriptwriters sometimes use creatively.

### Compiling senior script books

1. In `eleventy-book.config.js`, update `graduationYear` (to the desired graduation year, with a .5 if the book is for a .5er) and `extraYear` (to `true` if you’re making it for someone who took an extra year, `false` otherwise)
2. Install the required fonts:
   - Meta Serif Pro (from [Adobe Fonts](https://fonts.adobe.com/fonts/ff-meta-serif))
   - Fira Sans (from [Adobe Fonts](https://fonts.adobe.com/fonts/fira-sans) or [Font Squirrel](https://www.fontsquirrel.com/fonts/fira-sans))
   - Brown has [instructions](https://ithelp.brown.edu/kb/articles/install-adobe-creative-cloud-desktop-application) to set up a free Creative Cloud account to access Adobe Fonts
3. Run `pnpm build:book`, then open `book/book.pdf` in your favorite PDF viewer. Expect it to be around 100 pages.
4. Make sure there are no typos and everything is laid out decently
   - If you have to make changes, run `pnpm start:book` and open http://localhost:8080 in your browser to get a live preview of what the book will look like. Note that you will have to manually refresh to get CSS changes to apply, due to the way the library that slices the HTML into pages works.
5. View remaining steps in the Webmaster Reference Document, under the “Making script books” section

### Adding/removing pages

1. Create a new file in the `pages` folder. The name of the file will be the URL (i.e. `about-us.md` is `/about-us/`).
   - See the “Templates” section above to help you decide what file extension to use.
2. (optional) Add [front matter](https://www.11ty.dev/docs/data-frontmatter/) (three dashes on a line, followed by some YAML, followed by three more dashes on a line, followed by the actual content of the file). You can specify any data here, but currently the website supports:
   - `title`: A custom title for the page. By default, it will be generated from the file name, so in most cases you won’t need to manually specify it.
     - if the default title is only wrong due to mis-capitalizing an acronym or similar, add the correct capitalization to the `special` array at the end of the `title` function in `eleventyComputed.js` and it will be used instead.
   - `layout`: defaults to `page.jsx` (i.e. `layouts/page.jsx`). Specify a different layout if you want.
   - `summary`: text displayed between the title and the content, with a bracket to set it apart
   - `showHeader`: disable the default header. for when you want a something custom
   - `toc`: By default, a table of contents will be generated for any page with at least one header with an `id` property (put <code>{#_id_}</code> at the end of a heading to set an ID). You can override this by specifying `toc: false` to disable the table of contents, or pass an array of custom headings (check out `buttons.jsx` for an example of this).
   - (there are a bunch more for scripts, described above)
   - check out [Eleventy’s docs](https://www.11ty.dev/docs/data-configuration/) for additional options.
3. Add the page content, formatted using the language you chose.
4. Add the page to the navbar:
   - To add it to a menu, edit `nav.yml` by adding an entry somewhere with the path of the page (without the file extension; use the others as an example). The title will be automatically picked up.
   - To add it at the top level, edit `Nav.jsx` to add a link to the page (use the “Contact” link as an example)

### Adding an issue of The Bandstand

1. Add an entry to `bandstands.yml` (in the `new` section, unless you’ve recovered an old Bandstand!):
   - `volume` and `issue`: take this from the first or second page of the PDF
   - `date`: whatever the PDF says (such as “April 1980” or “Fall 2018”)
   - Make sure to keep the file in chronological order.
2. Rename the PDF to <code>_volume_-_issue_.pdf</code> (e.g. `1-1.pdf`)
3. Connect to `students.brown.edu` over SSH and upload the PDF to the appropriate folder of `/var/www/html/Brown_Band/the-bandstand/` (either `old` or `new`, corresponding to the key under which you listed it in `bandstands.yml`).
4. Commit and push the changes to this repository.

### Adding an icon

To add a new icon to `assets/icons.svg`:

1. Find the icon you want online, in SVG format. Make sure it has a free/permissive license!
2. Create a new `<symbol>` element in `assets/icons.svg`:
   - The `id` property should be the ID used to reference the icon from templates (use `kebab-case` and avoid spaces).
   - The `viewBox` property should match the one on the `<svg>` tag of the SVG you’re copying
     - if there isn’t a `viewBox` property, `0 0 width height` (where `width` and `height` are replaced by those properties on the SVG) should work.
3. Paste everything inside of the `<svg>` tag into the `<symbol>`.

---

Also check out [`design-decisions.md`](./design-decisions.md) for more insight into why things are the way the are. Feel free to add sections when you make new decisions so future webmasters can have context!

If you ever get really stuck with something, you can always [reach out to me](mailto:jed@jedfox.com) and I’ll do my best to lend a hand!
