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

        <script async src="/assets/vendor/bootstrap.min.js" />
        <link rel="stylesheet" href="/assets/vendor/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/base.css" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Niconne&family=Quicksand:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body {...bodyAttrs}>
        <Raw html={content} />
      </body>
    </html>
  </>
);
