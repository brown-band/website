const { createElement, Raw, DOCTYPE } = require("eleventy-hast-jsx");

exports.default = ({ title, site, bodyAttrs, content }) => (
  <>
    <DOCTYPE />
    <html lang="en" class="h-100">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <meta name="color-scheme" content="light dark" />

        <title>{title ? `${title} | ${site.title}` : site.title}</title>

        <script async src="/assets/bootstrap.min.js"></script>
        <link rel="stylesheet" href="/assets/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/base.css" />
      </head>
      <body {...bodyAttrs}>
        <Raw html={content} />
      </body>
    </html>
  </>
);
