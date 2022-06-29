module.exports = function getOptions(reservedKeys) {
  const options = {}
  process.argv.forEach(arg => {
    const separatorIndex = arg.indexOf('=')
    if (separatorIndex != -1) {
      const key = arg.slice(0, separatorIndex)
      const value = arg.slice(separatorIndex + 1)
      options[key] = value
    }
  })
  return options
}