function makeRootTemplate(list) {
  return makeTemplate(null, null, list, null)
}

function makeSubTemplate(name, list) {
  return makeTemplate(name, null, list, null)
}

function makeCondition(cond, clist, elist) {
  return {
    type: 'COND',
    cond: cond,
    clist: clist || [],
    elist: elist || []
  }
}

function makeTemplate(name, head, list, tail) {
  return {
    type: 'LIST',
    name: name,
    head: head,
    list: list,
    tail: tail,
    compose: function (data) { return compose(this, data) }
  }
}

function compose(template, data) {
  var lines = []
  composeLoop(template, data instanceof Array ? data : [data], lines)
  return lines.join('\n')
}

function composeLoop(template, datalist, lines) {
  var head = template.head
  var list = template.list
  var tail = template.tail

  if (list && list.length > 0 && datalist.length > 0) {
    if (head) {
      for (var line of head) {
        lines.push(line)
      }
    }

    for (var data of datalist) {
      for (var line of list) {
        if (typeof (line) == 'string') {
          lines.push(format(line, { '$': String(data), ...data }))
        } else {
          if (line.type == 'LIST') {
            var subdatalist = data[line.name] || []
            composeLoop(line, subdatalist, lines)
          } else if (line.type == 'COND') {
            if (line.cond(data)) {
              composeLoop({ list: line.clist }, [data], lines)
            } else {
              composeLoop({ list: line.elist }, [data], lines)
            }
          }
        }
      }
    }

    if (tail) {
      for (var line of tail) {
        lines.push(line)
      }
    }
  }
}

function format(text, obj) {
  return Object.keys(obj).reduce((result, key) => result.split('{{' + key + '}}').join(obj[key] || ''), text)
}

module.exports = {
  root: makeRootTemplate,
  sub: makeSubTemplate,
  cond: makeCondition,
  template: makeTemplate
}