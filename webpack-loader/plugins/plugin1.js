function FileListPlugin(options) {
  this.options = options;
}
FileListPlugin.prototype = {
  apply: function(compiler) {
    compiler.hooks.emit.tapAsync(
      'afterCompile',
      (compilation, callback) => {
        console.log('This is an example plugin!');
        console.log('Here’s the `compilation` object which represents a single build of assets:', compilation.assets);

        // 使用 webpack 提供的 plugin API 操作构建结果
        // compilation.addModule(/* ... */);

        callback();
      }
    );
  }
}

module.exports = FileListPlugin;