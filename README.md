# Dingdongu Api Sample GQL Generator

## Usage

### Command
* 3rd argument must be ```endpoint url```
* things behind url argument,
  * output=```output-path```
    * generate gql samples to under ```output-path```
  * operation=```specific-operation```
    * generate gql sample, only ```specific-operation```


### Examples
#### Output ```all``` graphql api of endpoint to files in ```specific directory```
* default directory is ```./result```

``` bash
npm run generate "http://dev-api-auth.dingdongu.com/v1/graphql" output=./results/auth
```

#### Output ```all``` graphql api of endpoint to ```console```
* default directory is ```./result```

``` bash
npm run generate "http://dev-api-auth.dingdongu.com/v1/graphql" output=console
```

#### Output ```specific``` graphql api of endpoint to ```default directory```
``` bash
npm run generate "http://dev-api-auth.dingdongu.com/v1/graphql" operation=signIn
```

#### Output ```specific``` graphql api of endpoint to ```console```
``` bash
npm run generate "http://dev-api-auth.dingdongu.com/v1/graphql" operation=signIn output=console
```