const readFile = require('../utils/ReadFile')
const inputFile = 'input.txt'

const instructionParseRegex = /[A-Z]{3}/g
let firstLine = true
const start = 'AAA'
const end = 'ZZZ'

let instructions
const map = {}

function forLine(line) {
  if (firstLine) {
    instructions = line
    firstLine = false
  }
  else if (line[0]) { // not empty
    const [input, L, R] = line.match(instructionParseRegex)
    map[input] = {
      L,
      R,
    }
  }
}

function afterFile() {
  let current = start
  let step = 0
  while (current !== end) {
    let index = step
    if (index > instructions.length-1) {
      index = step % instructions.length
    }
    const instruction = instructions[index]
    current = map[current][instruction]
    step++
  }
  console.log('Part 1:', step)
}

readFile(
  inputFile,
  forLine,
  afterFile,
)