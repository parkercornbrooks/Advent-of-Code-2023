const readFile = require('../utils/ReadFile')
const Platform = require('./Platform')

let platform = new Platform()

function forLine(line) {
  platform.addRow(line)
}

function afterFile() {
  platform.tiltNorth()
  console.log(`Part 1: ${platform.calculateLoad()}`)
}

readFile(
  'input.txt',
  forLine,
  afterFile,
)
