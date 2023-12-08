const readFile = require('../utils/ReadFile')
const LCM = require('./leastCommonMultiple')
const inputFile = 'input.txt'

const instructionParseRegex = /[A-Z]{3}/g
let firstLine = true
const startNode = 'AAA'
const endNode = 'ZZZ'

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
  traversePart1()
  traversePart2()
}

function traversePart1() {
  let currentNode = startNode
  let step = 0
  while (currentNode !== endNode) {
    let index = calculateIndex(step)
    const instruction = instructions[index]
    currentNode = map[currentNode][instruction]
    step++
  }
  console.log('Part 1:', step)
}

function traversePart2() {
  let currentNodes = Object.keys(map).filter(k => k[2] === 'A')
  let step = 0
  let cycleLengths = currentNodes.map(_ => 0)
  while (!cycleLengths.every(length => length > 0)) {
    let index = calculateIndex(step)
    const instruction = instructions[index]
    currentNodes = currentNodes.map(currentNode => map[currentNode][instruction])
    step++
    currentNodes.forEach((node, ghost) => {
      if (node[2] === 'Z') {
        console.log(`Ghost ${ghost} hit node ${node} after ${step} steps`)
        cycleLengths[ghost] = step
      }
    })
  }
  const totalSteps = LCM(cycleLengths)
  console.log('Part 2:', totalSteps)
}

function calculateIndex(step) {
  let index = step
  if (index > instructions.length-1) {
    index = step % instructions.length
  }
  return index
}

function allEndWithZ(nodes) {
  return nodes.every(item => item[2] === 'Z')
}

readFile(
  inputFile,
  forLine,
  afterFile,
)