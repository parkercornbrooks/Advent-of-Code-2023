const readFile = require('../utils/ReadFile')
const Pattern = require('./Pattern')


let currentPattern = new Pattern()
const patterns = [
  currentPattern
]

function newPattern() {
  currentPattern = new Pattern()
  patterns.push(currentPattern)
}

function forLine(line) {
  if (!line) {
    newPattern()
    return
  }

  currentPattern.addLine(line)
}

function afterFile() {
  let partOneTotal = 0
  patterns.forEach((pattern, i) => {
    //console.log(`assessing pattern ${i+1}`)
    const reflection = pattern.assess()
    partOneTotal += reflection
  })
  console.log(`Part 1: ${partOneTotal}`)
}

readFile(
  'input.txt',
  forLine,
  afterFile,
)