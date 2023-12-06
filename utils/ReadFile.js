const fs = require('fs')
const readline = require('readline')
/**
 * Wrapper for the readline service
 * @param {*} fileName the text path of the file
 * @param {*} lineFn function to run on every line
 *     takes one argument - the line string
 * @param {*} endFn function to run at the end of the file
 *     takes no arguments
 */
function readFile(fileName, lineFn, endFn) {
  const inputStream = fs.createReadStream(fileName)
  const rl = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  })
  rl.on('line', lineFn)
  rl.on('close', () => endFn())
}

module.exports = readFile