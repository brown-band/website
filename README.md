# The Brown University Band’s website

Welcome to the repository for the Brown Band!

TODO:

- [ ] figure out what to do with `_redirects`

## Documentation

(this whole thing is probably somewhat out of date, so if you see any issues please correct them)

### Getting Started

This site is a static site powered by [Eleventy (11ty)](https://www.11ty.dev) and hosted on [TBD]. That means that the files in this repository are transformed by a build script producing a folder full of plain HTML files that any static site host can serve.

To get started, make sure you have [Node.js](https://nodejs.org/en/) installed. I recommend using something like [nvm](https://github.com/nvm-sh/nvm) (or my favorite, [asdf](https://asdf-vm.com)), which will automatically pick up the `.node-version` file in this repo and prompt you to install that version of Node.

In a terminal, run `npm install` from this project’s directory to install all dependencies. You can run one of several scripts via `npm run`:

- <code>npm run **start**</code> (or `npm start` for short): Runs Eleventy in development mode, starting a local server and rebuilding whenever you change a file.
- <code>npm run **build**</code>: Runs Eleventy once, ouptutting the generated site in the `public` folder. Run this before uploading the contents of that folder to a static site host. (There’s typically no need for you to do this, since a new build will be automatically triggered whenever you push updated code to GitHub)
- <code>npm run **format**</code>: Runs [Prettier](https://prettier.io) to ensure consistent code and document formatting. Ideally, set up your code editor to run Prettier whenever you save a file — check out their [editor integration docs](https://prettier.io/docs/en/editors.html) or search your editor’s package manager for a “Prettier” package.

(Note: I put the current LTS version of Node.js into the `.node-version` file — feel free to update it at any time (after checking to make sure the new version still works right!))

### File organization

- `assets`: miscellaneous static files
- `buttons`: contains folders for each class year
  - `buttons/*/labels.yml`: contains a mapping from college name → button description
- `data`: contains a combination of static data (`.yml` files) and scripts that produce the relevant data for the website (`.js` files)
  - `people/*.yml`: lists the section leaders, appointed positions, and members of band board.
  - `buttons.js`: scans the `buttons` folder and formats the buttons for display on the buttons page
  - `eleventyComputed.js`: handles automatically creating titles for pages that don’t specify them. (it might do other things too if this section is out of date, go check!)
  - `nav.yml`: contains the data for the nav bar
  - `quote.js`: selects the random quote displayed on the site header
  - `schoolColors.yml`: Contains the primary color used by many of the schools we’ve played in the past. The `color` property is used by the buttons page to tint the table headers and the script renderer to color the text of the page titles. The `type` property is used to help split the buttons page into categories.
  - `scripts.js`: scans the `pages/scripts` folder and formats the data for display both on the script index page and on individual semester indexes.
  - `site.yml`: global metadata for the website (currently just the title)
  - `specialButtons.yml`: list of buttons that don’t fit into any of the existing categories
- `includes`: can be imported using `{% include %}`
  - (note: included templates use the same output language as the page that includes them)
  - `button-table.njk`: code for rendering the tables on the button page
  - `nav.njk`: renders the navbar, and is responsible for highlighting the active item
  - `people-table.md`: used to make the section leader and appointed position tables
  - `person.md`: used to display band board and conductor bios
- `layouts`
  - `base.njk`: contains the basic page layout, including the navbar, page title, summary, and page content.
- `pages`: the pages on the website. Each page is automatically compiled into HTML by Eleventy.
  - `scripts`: show scripts. Contains a subfolder for each year’s scripts, with `fall` and `spring` subfolders.
  - `index.md`: the homepage
- `.eleventy.js`: configuration file for Eleventy. See docs inside the file for more details.
- `script-script-to-html.js`: converts Script Script (`.69`, an XML format) to HTML

### Common Tasks

#### Updating Leadership

To update the people page, edit the files in `data/people/`.

For band board and the conductors, provide the following properties:

- `position`:
  - for band board: an object with these properties
    - (this does not need to be updated when the person in the position changes)
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

1. Create a new folder inside `buttons `with the current year, i.e. `2031-2032`
2. Convert the button images from above to `.jpg` and add them to the new folder, with the same naming convention as the `.png` files above.
   - I (Jed) used 80% quality for my conversions, but feel free to pick an appropriate value!
3. Create a `labels.yml` file inside that folder.
   - Use the following format for each line: <code>_College Name (with proper spaces and capitalization)_: _Description on Button_</code>
   - For the description, include any text on the button. For graphic elements (such as images), enclose a brief description of the graphic in braces (`{}`). If the description starts with a brace or a quote, make sure you wrap it in quotes so YAML handles it properly.
   - Look at old buttons for examples of how to write the description!

That’s it! The build script will automatically pick up the new buttons and add them to the buttons page.

#### Adding/removing pages

1. Create a new `.md` file in the `pages` folder. The name of the file will be the URL (i.e. `about-us.md` is `/about-us`).
   - The title will be automatically created from the name of the file by replacing dashes with spaces and title-casing. If this behavior is incorrect, specify the `title` property in the front matter (front matter is described below)
   - Use the `.html` extension if you want to write HTML instead of Markdown.
2. (optional) Add [front matter](https://www.11ty.dev/docs/data-frontmatter/) (three dashes on a line, followed by some YAML, followed by three more dashes on a line, followed by the actual content of the file). You can specify any data here, but currently the website supports:
   - `title`: A custom title for the page. Specify `null` to hide the header and use the site title as the page title (the home page does this)
   - `layout`: defaults to `base` (`layouts/base.njk`). Specify a different layout if you want.
   - `summary`: italicized, indented text displayed between the title and the content
   - check out [Eleventy’s docs](https://www.11ty.dev/docs/data-configuration/) for additional options.
3. Add the page content, formatted using Markdown. You can use [Nunjucks template commands](https://mozilla.github.io/nunjucks/templating.html) to incorporate data into the page.
4. Add the page to the navbar:
   - To add it at the top level, edit `nav.njk` to add a link to the page (use the “Contact” link as an example)
   - To add it to a menu, edit `nav.yml` by adding an entry somewhere with `title` and `url` properties

---

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
