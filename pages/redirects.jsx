exports.data = {
  pagination: {
    data: "redirects",
    size: 1,
    alias: "key",
  },
  title: "Redirecting…",
  permalink: ({ key }) => key + "/",
  showHeader: false,
};

exports.default = ({ key, redirects }) => {
  const dest = redirects[key];
  return (
    <p>
      Redirecting to <a href={dest}>{dest}</a>&hellip;
      <head>
        <link rel="canonical" href={dest} />
        <meta name="robots" content="noindex" />
        <meta http-equiv="refresh" content={`0; url=${dest}`} />
      </head>
    </p>
  );
};
