# The Brown University Band’s website

Welcome to the repository for the Brown Band!

TODO:

- [ ] move templates into `layouts`
- [ ] figure out what to do with `_redirects`

## Documentation

(this whole thing is probably somewhat out of date, so if you see any issues please correct them)

### File organization

(files in **bold** are likely to have to be frequently updated)

- `assets`: miscellaneous static files
- **`buttons`**: contains folders for each class year
  - `buttons/*/labels.yml`: contains a mapping from college name → button description
  - add a new subfolder for each year's buttons
- `data`: contains a combination of static data (`.yml` files) and scripts that produce the relevant data for the website (`.js` files)
  - **`people/*.yml`**: lists the section leaders, appointed positions, and members of band board.
  - `buttons.js`: scans the `buttons` folder and formats the buttons for display on the buttons page
  - `eleventyComputed.js`: handles automatically creating titles for pages that don’t specify them. (it might do other things too if this section is out of date, go check!)
  - **`nav.yml`**: contains the data for the nav bar
  - **`quote.js`**: selects the random quote displayed on the site header
  - `schoolColors.yml`: Contains the primary color used by many of the schools we’ve played in the past. The `color` property is used by the buttons page to tint the table headers and the script renderer to color the text of the page titles. The `type` property is used to help split the buttons page into categories.
  - `scripts.js`: scans the `pages/scripts` folder and formats the data for display both on the script index page and on individual semester indexes.
  - `site.yml`: global metadata for the website (currently just the title)
  - `specialButtons.yml`: list of buttons that don’t fit into any of the existing categories
- `includes`: templates and layouts
  - `base.njk`: contains the basic page layout, including the navbar, page title, summary, and page content.
  - `button-table.njk`: code for rendering the tables on the button page
  - `nav.njk`: renders the navbar, and is responsible for highlighting the active item
  - `people-table.md`: used to make the section leader and appointed position tables
  - `person.md`: used to display band board and conductor bios
- `pages`: the pages on the website. Each page is automatically compiled into HTML by Eleventy.
  - **`scripts`**: show scripts. Add a new subfolder for each year’s scripts. See below for documentation on the script file format.
  - `index.md`: the homepage
- `.eleventy.js`: configuration file for Eleventy. See docs inside the file for more details.
- `script-script-to-html.js`: converts Script Script (`.69`, an XML format) to HTML
