
const endpoint = process.argv[2]
const options = require('./libs/arg-options')([
    'operation',
    'output'
])

// Error: endpoint is null
if (endpoint == null) {
    console.error('Endpoint must be provided')
    process.exit(0)
}

// Schema from endpoint
const GQLSchema = require('./libs/gql-schema.js')
var schema = GQLSchema.get(endpoint)

// Filter from option 'operation'
const outputApis = options['operation'] ?
    schema.all.filter((api) => {
        return api.operationName == options['operation']
    }) :
    schema.all

// Error: check empty
if (outputApis.length == 0) {
    console.error('There is no output apis')
    process.exit(0)
}

// Get template
const gqlTemplate = require('./assets/gql.js')

// Check output is console
if (options['output'] == 'console') {
    outputApis.forEach(api => console.log(gqlTemplate.compose(api) + '\n'))
    process.exit(0)
}

// Output to file
const fs = require('fs')
const path = require('path')
outputApis.forEach(api => {
    const dir = path.join(options['output'] || './results/', api.operationType)
    const filepath = path.join(dir, api.operationName + '.gql')

    console.log("Writing api " + api.operationName + " to " + filepath)

    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filepath, gqlTemplate.compose(api), 'utf8')
})

console.log("Finish!")