const readFile = require('../utils/ReadFile')
const AlmanacParser = require('./AlmanacParser')
const Almanac = require('./Almanac')
const inputFile = 'input.txt'

const almanac = new Almanac()

function forLine(line) {
  const parser = new AlmanacParser(line)
  if (parser.isSeedLine()) {
    const seeds = parser.parseNumbers()
    almanac.setSeeds(seeds)
  }
  else if (parser.isTitleLine()) {
    const title = parser.parseTitle()
    almanac.initializeMapGroup(title)
  }
  else if (parser.isMapLine()) {
    const map = parser.parseMap()
    almanac.addMap(map)
  }
}

function afterFile() {
  console.log(`Part 1: ${almanac.getLowestLocation()}`)
}

readFile(
  inputFile,
  forLine,
  afterFile,
)