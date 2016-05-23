var path = require('path')

module.exports = {
  entry: './app/main.js',
  output: {
    path: './production',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel?presets[]=react,presets[]=es2015,presets[]=stage-2',
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      {
        test: /\.[^j][^s][^.]*$/,
        loader: path.join(__dirname, '/backup-file-loader.js?hash=sha512&digest=hex&name=[hash].[ext]'),
      },
    ],
  },
}
