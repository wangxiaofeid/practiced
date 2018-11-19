const { getOptions } = require('loader-utils');

module.exports = function(source) {
  const callback = this.async();
  const options = (getOptions(this));
  console.log('替换前', source);
  source = source.replace(/\[name\]/g, options.name);
  console.log('替换后', source);

  callback(
    null,
    'module.exports = ' + JSON.stringify(source)
  )
}