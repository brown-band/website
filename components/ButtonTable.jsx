const { createElement } = require("eleventy-hast-jsx");

module.exports = ({ id, name, mascot, buttons, color }) => (
  <>
    <a name={id}></a>
    <table class="table table-sm">
      <thead>
        <tr>
          <th
            colspan="2"
            style={`color: white; background-color: ${color}; text-align: center`}
          >
            {name}
            {mascot && `: ${mascot}`}
          </th>
        </tr>
      </thead>
      <tbody>
        {buttons.map((button) => (
          <tr>
            <td>{button.year}</td>
            <td>
              {button.image ? (
                <a href={button.image}>{button.label}</a>
              ) : (
                button.label
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);
