module.exports = async ({ content }) => {
  const { processor } = await import("../config/markdown.mjs");

  return (await processor.run(processor.parse(content))).children;
};
