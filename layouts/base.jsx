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

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/assets/images/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/assets/images/favicons/32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/assets/images/favicons/16.png"
        />
        <link rel="manifest" href="/brown-band.webmanifest" />
        <meta
          name="theme-color"
          content="#382710"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#483314"
          media="(prefers-color-scheme: dark)"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Niconne&text=The%20Brown%20Band&display=block"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=optional"
          rel="stylesheet"
        />
      </head>
      <body {...bodyAttrs}>
        <Raw html={content} />
      </body>
    </html>
  </>
);
