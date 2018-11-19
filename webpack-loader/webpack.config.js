const path = require('path');
const Plugin1 = require('./plugins/plugin1.js');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'xxx.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.xxx$/,
        use: [
          'loader2',
          {
            loader: 'loader1',
            options: {
              name: 'Alice'
            }
          }
        ]
      }
    ]
  },
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'loaders')
    ]
  },
  plugins: [
    new Plugin1()
  ]
};