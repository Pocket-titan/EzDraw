'use strict'

let fileLoader = require('file-loader')

let backupFileLoader = function() {
 if (this.loaders.length === 1) {
   return fileLoader.apply(this, arguments)
 } else {
   let args = Array.prototype.slice.apply(arguments)
   this.callback.apply(this, [null].concat(args));
 }
}

module.exports = backupFileLoader
