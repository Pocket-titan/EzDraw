var path = require('path')

module.exports = {
  entry: './app/main.js',
  output: {
    filename: './production/bundle.js',
  },
  devServer: {
    inline: true,
    port: 3333,
  },
  scripts: {
    'start': 'webpack-dev-server',
  },
  devtool: 'source-maps',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015'],
          plugins: ['transform-class-properties'],
        },
      },
    ],
  },
}
