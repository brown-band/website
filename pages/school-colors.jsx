exports.default = ({ schoolColors }) => (
  <ul>
    {Object.entries(schoolColors).map(([name, color]) => (
      <li
        class="school-color"
        style={`--color: ${color.color}; ${
          color.darkColor ? `--dark-color: ${color.darkColor};` : ""
        }`}
      >
        {name}
      </li>
    ))}
  </ul>
);
