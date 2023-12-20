const readFile = require('../utils/ReadFile')
const Platform = require('./Platform')

let platform = new Platform()

function forLine(line) {
  platform.addRow(line)
}

function afterFile() {
  platform.tiltNorth()
  console.log(`Part 1: ${platform.calculateLoad()}`)
  console.log(`Part 2: ${platform.findLoadAt(1000000000)}`)
}

readFile(
  'input.txt',
  forLine,
  afterFile,
)
