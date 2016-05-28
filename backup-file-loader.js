'use strict'

let fileLoader = require('file-loader')

let backupFileLoader = function() {
  let fileparts = (this.request || '').split('!')
  let file = fileparts[fileparts.length - 1]

  if (this.loaders.length === 1 && !/\.js(\?|$)/.test(file)) {
    return fileLoader.apply(this, arguments)
  } else {
    let args = Array.prototype.slice.apply(arguments)
    this.callback.apply(this, [null].concat(args));
  }
}

module.exports = backupFileLoader
module.exports.raw = true
