const request = require('sync-request')
const path = require('path')
const fs = require('fs')

const introspectionQuery = fs.readFileSync(path.join(__dirname, 'gql', 'IntrospectionQuery.gql'), 'utf-8').toString()

function get(url) {
  const schema = query(url)
  if (!schema) {
    return {
      query: [],
      mutation: [],
      all: []
    }
  }

  const schemaObjectsMap = schema.data.__schema.types.reduce((result, item, i) => ((result[item.name] = item), result), {})

  try {
    const query = getApiList('Query', schemaObjectsMap)
    const mutation = getApiList('Mutation', schemaObjectsMap)

    return {
      query: query,
      mutation: mutation,
      all: [...query, ...mutation]
    }
  } catch (e) {
    console.log(e)
  }

  return {
    query: [],
    mutations: [],
    all: []
  }
}

function query(url) {
  try {
    const response = request('POST', url, {
      json: {
        // 'operationName': options.operationName,
        'query': introspectionQuery,
        // 'variables': options.variables
      },
      headers: { 'authorization': undefined }
    })

    const body = response.body

    const result = JSON.parse(body)

    return result
  } catch (e) {
    //
  }
  return null
}

function getApiList(optype, schemaObjectsMap) {
  var apiObject = schemaObjectsMap[optype]
  var apiList = apiObject && apiObject.fields || []
  return apiList.map(item => {
    var input = item.args[0] && item.args[0].type.ofType?.name
    var output = item.type.name || (item.type.ofType && item.type.ofType.name)
    var inputsAll = getInputTypeIncludeSubs(input, schemaObjectsMap)
    var outputsAll = getOutputTypeIncludeSubs(output, schemaObjectsMap)
    var refinedItem = {
      operationType: optype.toLowerCase(),
      operationName: item.name,
      description: item.description,
      inputTypeName: input,
      outputTypeName: output,
      isPrimitiveInputType: ['String', 'Boolean', 'Int'].includes(input),
      isPrimitiveOutputType: ['String', 'Boolean', 'Int'].includes(output),
      inputTypeFields: inputsAll,
      outputTypeFields: outputsAll[0] && outputsAll[0].fields || [],
    }
    return refinedItem
  })
}

function getInputTypeIncludeSubs(name, schemaObjectsMap) {
  const results = {}

  getInputTypeIncludeSubsLoop(name, schemaObjectsMap, results)

  return Object.keys(results).map(name => ({
    name: name,
    fields: results[name]
  })).reverse()
}

function getInputTypeIncludeSubsLoop(name, schemaObjectsMap, results) {
  var tn = name && name.replace(/[\[\]]/g, '')
  if (results[tn]) {
    return results[tn]
  }
  var obj = schemaObjectsMap[tn]
  const fields = obj && obj.inputFields && obj.inputFields.map(field => {
    var type = getTypeName(field.type)
    return {
      name: field.name,
      description: field.description || '',
      type: type.name,
      kind: type.kind,
      required: field.type.kind == 'NON_NULL',
      fields: name != type.name ? getInputTypeIncludeSubsLoop(type.name, schemaObjectsMap, results) : null,
    }
  })
  if (obj && obj.kind == 'INPUT_OBJECT') {
    results[tn] = fields
  }
  return fields
}

function getOutputTypeIncludeSubs(name, schemaObjectsMap) {
  const results = {}

  getOutputTypeIncludeSubsLoop(name, schemaObjectsMap, results)

  return Object.keys(results).map(name => ({
    name: name,
    fields: results[name]
  })).reverse()
}

function getOutputTypeIncludeSubsLoop(name, schemaObjectsMap, results) {
  var tn = name && name.replace(/[\[\]]/g, '')
  if (results[tn]) {
    return results[tn]
  }
  var obj = schemaObjectsMap[tn]
  var fields = obj && obj.fields && obj.fields.map(field => {
    var type = getTypeName(field.type)
    return {
      name: field.name,
      description: field.description || '',
      type: type.name,
      kind: type.kind,
      required: field.type.kind == 'NON_NULL',
      fields: name != type.name ? getOutputTypeIncludeSubsLoop(type.name, schemaObjectsMap, results) : null,
    }
  })
  if (obj && obj.kind == 'OBJECT') {
    results[tn] = fields
  }
  return fields
}

function getInputType(name, schemaObjectsMap) {
  var tn = name && name.replace(/[\[\]]/g, '')
  var obj = schemaObjectsMap[tn]
  return obj && obj.inputFields && obj.inputFields.map(field => {
    var type = getTypeName(field.type)
    return {
      name: field.name,
      description: field.description,
      type: type.name,
      kind: type.kind,
      required: field.type.kind == 'NON_NULL' ? 'Yes' : 'No',
      fields: name != type.name ? getInputType(type.name, schemaObjectsMap) : null,
    }
  })
}

function getObjectType(name, schemaObjectsMap) {
  var tn = name && name.replace(/[\[\]]/g, '')
  var obj = schemaObjectsMap[tn]
  return obj && obj.fields && obj.fields.map(field => {
    var type = getTypeName(field.type)
    return {
      name: field.name,
      description: field.description,
      type: type.name,
      kind: type.kind,
      required: field.type.kind == 'NON_NULL' ? 'Yes' : 'No',
      fields: name != type.name ? getObjectType(type.name, schemaObjectsMap) : null,
    }
  })
}

function getTypeName(type) {
  var name = getTypeNameLoop(type)
  return name
}

function getTypeNameLoop(type, isArray) {
  if (type.name) {
    if (isArray) {
      return {
        name: '[' + type.name + ']',
        kind: type.kind
      }
    }
    return {
      name: type.name,
      kind: type.kind
    }
  }
  if (type.ofType) {
    return getTypeNameLoop(type.ofType, isArray || type.kind == 'LIST')
  }
  return null
}

module.exports = { get }