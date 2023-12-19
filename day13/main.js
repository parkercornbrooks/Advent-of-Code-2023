const readFile = require('../utils/ReadFile')
const Pattern = require('./Pattern')

let currentPattern = new Pattern()
const patterns = [
  currentPattern
]

function forLine(line) {
  if (!line) {
    currentPattern = new Pattern()
    patterns.push(currentPattern)
    return
  }

  currentPattern.addLine(line)
}

function afterFile() {
  let partOneTotal = 0
  let partTwoTotal = 0
  patterns.forEach(pattern => {
    pattern.assess()
    partOneTotal += pattern.reflection
    partTwoTotal += pattern.smudgeReflection
  })
  console.log(`Part 1: ${partOneTotal}`)
  console.log(`Part 2: ${partTwoTotal}`)
}

readFile(
  'input.txt',
  forLine,
  afterFile,
)