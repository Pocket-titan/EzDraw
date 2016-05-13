var path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'app/main.js'),
  output: {
    filename: path.resolve(__dirname, 'production/bundle.js'),
  },
  devtool: 'source-map',
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
