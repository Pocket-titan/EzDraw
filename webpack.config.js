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
        loader: 'babel?presets[]=react,presets[]=es2015,presets[]=stage-2',
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/, exclude: /node_modules/, loader: 'url-loader?importLoaders=1&limit=100000' },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
        ],
      },
      {
        test: /\.(woff2?|ttf|eot)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
        ],
      },
    ],
  },
}
