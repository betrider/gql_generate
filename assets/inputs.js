const { root, sub, cond, template } = require("../libs/template.js")

module.exports = root([
  '# {{description}} - 참고용',
  sub("inputTypeFields", [
    "class {{name}}",
    template("fields",
      ["{"],
      ["  {{name}}: {{type}} # {{description}} / 필수여부: {{required}}", template("fields", 
        ["  {"],
        ["    {{name}}: {{type}} # {{description}} / 필수여부: {{required}}", template("fields",
          ["    {"],
          ["      {{name}}: {{type}} # {{description}} / 필수여부: {{required}}", template("fields",
            ["      {"],
            ["        {{name}}: {{type}} # {{description}} / 필수여부: {{required}}"],
            ["      }"]
          )],
          ["    }"]
        )],
        ["  }"]
      )],
    ["}"]
  )])
])