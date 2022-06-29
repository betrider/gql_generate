const { root, sub, cond, template } = require("../libs/template.js")

module.exports = root([
  "# {{description}}",
  cond(data => data.inputTypeName, [
    "{{operationType}} {{operationName}}(",
    "  $input: {{inputTypeName}}!",
    ") {",
    cond(data => !data.isPrimitiveOutputType, [
      "  {{operationName}}(input: $input) {",
    ], [
      "  {{operationName}}(input: $input)",
    ])
  ], [
    "{{operationType}} {{operationName}} {",
    cond(data => !data.isPrimitiveOutputType, [
      "  {{operationName}} {",
    ], [
      "  {{operationName}}",
    ]),
  ]),
  cond(data => !data.isPrimitiveOutputType, [
    "    ... on {{outputTypeName}} {",
    sub("outputTypeFields",
      [
        "      {{name}}",
        template("fields",
          ["      {"], // head
          [
            "        {{name}}",
            template("fields",
              ["        {"], // head
              [
                "          {{name}}",
                template("fields",
                  ["          {"], // head
                  [
                    "            {{name}}",
                    template("fields",
                      ["            {"], // head
                      [
                        "              {{name}}",
                        template("fields",
                          ["              {"], // head
                          [
                            "                {{name}}",
                            template("fields",
                              ["                {"], // head
                              [
                                "                  {{name}}",
                              ],
                              ["                }"] // tail
                            ),
                          ],
                          ["              }"] // tail
                        ),
                      ],
                      ["            }"] // tail
                    ),
                  ],
                  ["          }"] // tail
                ),
              ],
              ["        }"] // tail
            ),
          ],
          ["      }"] // tail
        ),
      ]
    ),
    "    }",
    "  }",
  ]),
  "}",
])