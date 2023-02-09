
const endpoint = process.argv[2]
const options = require("./libs/arg-options")([
    "operation",
    "output",
    "template"
])

const availableTemplates = {
    "gql": {
        "template": require("./assets/gql.js"),
        "extension": "gql"
    },
    "dart-custom": {
        "template": require("./assets/dart-custom.js"),
        "extension": "dart"
    },
    "inputs": {
        "template": require("./assets/inputs.js"),
        "extension": "gql"
    }
}
const selectedTemplate = options["template"] && availableTemplates[options["template"]] || availableTemplates["gql"]

// Error: endpoint is null
if (endpoint == null) {
    console.error("Endpoint must be provided")
    process.exit(0)
}

// Schema from endpoint
const GQLSchema = require("./libs/gql-schema.js")
var schema = GQLSchema.get(endpoint)

// Filter by option "operation"
const outputApis = options["operation"] ?
    schema.all.filter((api) => {
        return api.operationName == options["operation"]
    }) :
    schema.all

// Error: check if empty
if (outputApis.length == 0) {
    console.error("There is no output apis")
    process.exit(0)
}

// Output to console
if (options["output"] == "console") {
    outputApis.forEach(api => console.log(selectedTemplate.template.compose(api) + "\n"))
    process.exit(0)
}

// Output to file
const fs = require("fs")
const path = require("path")
outputApis.forEach(api => {
    const dir = path.join(options["output"] || "./results/", api.operationType)
    const filepath = path.join(dir, api.operationName + "." + (selectedTemplate.extension || "gql"))

    console.log("Writing api " + api.operationName + " to " + filepath)

    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filepath, selectedTemplate.template.compose(api), "utf8")
})

console.log("Finish!")