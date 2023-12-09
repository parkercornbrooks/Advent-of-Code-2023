const readFile = require('../utils/ReadFile')

const inputFile = 'input.txt'

let totalPart1 = 0
let totalPart2 = 0

function forLine(line) {
  const sequence = line
    .match(/-?\d+/g)
    .map(n => parseInt(n))

  const previousNumber = findPreviousNumberIn(sequence)
  totalPart2 += previousNumber

  const nextNumber = findNextNumberIn(sequence)
  totalPart1 += nextNumber
}

function afterFile() {
  console.log('Part 1 Total:', totalPart1)
  console.log('Part 2 Total:', totalPart2)
}

function findPreviousNumberIn(sequence) {
  const sequences = [sequence]
  for (let i=0; i<sequence.length-2; i++) {
    sequences[i+1] = []
    for (let j = 0; j<sequences[i].length-1; j++) {
      const diff = sequences[i][j] - sequences[i][j+1]
      sequences[i+1].push(diff)
    }
  }
  return sequences.reduce((a,c) => a+c[0], 0)
}

function findNextNumberIn(sequence) {
  return findPreviousNumberIn(sequence.reverse())
}

readFile(
  inputFile,
  forLine,
  afterFile,
)
