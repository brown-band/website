/**
 * Note: This component is async and must be used like {await (<Markdown content={...} />)}
 * @param {Object} props
 * @param {string} props.content The Markdown content to render
 */
module.exports = async ({ content }) => {
  const { processor } = await import("../config/markdown.mjs");

  return (await processor.run(processor.parse(content))).children;
};
