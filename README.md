# Dingdongu Api Sample GQL Generator

## Usage

### Command
* 3rd argument must be ```endpoint url```
* things behind url argument,
  * output=```output-path```
    * generate gql samples to under ```output-path```
    * default directory is ```./result```
  * operation=```specific-operation```
    * generate gql sample, only ```specific-operation```
  * template=```specific-template```
    * generate gql sample by specific template


### Examples
#### Output ```all``` graphql apis of endpoint to files in ```specific directory```
``` bash
npm run generate "https://dev-api-auth.dingdongu.com/v1/graphql" output=./results/auth
```

#### Output ```all``` graphql apis of endpoint to ```console```
``` bash
npm run generate "https://dev-api-auth.dingdongu.com/v1/graphql" output=console
```

#### Output ```specific``` graphql api of endpoint to ```default directory```
``` bash
npm run generate "https://dev-api-auth.dingdongu.com/v1/graphql" operation=signIn
```

#### Output ```specific``` graphql api of endpoint to ```console```
``` bash
npm run generate "https://dev-api-auth.dingdongu.com/v1/graphql" operation=signIn output=console
```

#### Output all graphql apis of endpoint to default directory by ```specific template```
``` bash
npm run generate "https://dev-api-auth.dingdongu.com/v1/graphql" template=dart-custom
```


### Customize template
* with javascript
* in directory ```./assets```

``` javascript
const template = root([
  "first line",
  "second line",
  cond(data => data.test != null, [
    "test",
    "is",
    "not",
    "null",
    cond(data => data.test2 == null, [
      "test2",
      "is",
      "null"
    ], [
      "test2",
      "is",
      "not",
      "null",
      sub("test2", [
        "this is data.test2"
        "print data.test2.name {{name}}",
      ]
    ])
  ]
```