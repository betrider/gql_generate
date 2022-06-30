const { root, sub, cond, template } = require("../libs/template.js")

module.exports = root([
  "# {{operationName}}",
  "# {{description}}"
])