import backupFileLoader from './backupFileLoader.js'

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
      { test: /\.[^j][^s][^.]*$/, loader: backupFileLoader },
    ],
  },
}
