const { getOptions } = require('loader-utils');

module.exports = function(source) {
  const callback = this.async();
  const options = (getOptions(this));
  console.log('参数', options)
  console.log('收到的内容', source);

  callback(
    null,
    'module.exports = ' + JSON.stringify(source)
  )
}