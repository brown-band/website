# Explanation of design decisions

## Why JSX? (Jed Fox, 2022)

JSX is the fourth template language I tried using while building this website. (The first three were Liquid, Nunjucks, and Handlebars.) The common issues I saw with all three were that auto-formatter support (in particular Prettier, but I did look around a bit for alternatives) was lacking, and that it was hard to do “real logic” in the templates.

Formatting was lacking, I think, because template languages are extremely difficult to write a formatter for. There is Prettier support for Handlebars, but it did not support all the language features, and being confident that it will always produce correct results is very hard. Fundamentally, a template language mixes two programming languages (in our case, Markdown or HTML and the language that defines the `{{ ... }}` and `{% ... %}` syntax) with no structure. Interpolations can theoretically contain any content, meaning that solving the parsing problem for all cases is impossible (and solving it for “reasonable” cases is extremely difficult). You could, for example, wrap an if statement around only the opening tag of an HTML tag. (That isn’t theoretical, while looking for test cases while trying to [improve Prettier’s Handlebars formatting support](https://github.com/prettier/prettier/pull/12037) I found real examples of this).

And logic, I believe, is lacking because writing programming languages is hard. There are projects like EJS which attempt to merge a “real” language like JavaScript with template content (but they encounter a much harder version of the formatting problem because both languages are highly complex). As a result, most template languages come up with their own mini-language for pulling properties off of objects and running helper functions. Since the top level of most template languages is defined to output literal content (for ease of use and readability reasons), there isn’t a good place to define helper functions. Handlebars came the closest here with its “inline partials,” but its language is otherwise quite limited.

I realized that JSX (used by React) solves many of these problems. The locations you can inject arbitrary expressions are quite tightly limited to only the “normal” places. Because of this (and because it is very widely used), formatter and tooling support is excellent. Because JavaScript is a full-featured language, you can easily write helper functions and share code across files. I was able to go from 5–6 “shortcodes” in Nunjucks (and 15–20 for Handlebars) to zero for JSX. Unfortunately, Eleventy doesn’t support JSX by default. So I spent a few days making a plugin that lets it do just that, which seems to work ok for the use case I’ve tested it on (namely, this site). It runs fairly quickly (only a bit slower than Handlebars) and mostly works as you’d expect.

## Why Eleventy? (Jed Fox, 2021)

I chose Eleventy for several reasons.

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
