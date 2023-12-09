const readFile = require('../utils/ReadFile')

const inputFile = 'input.txt'

let totalPart1 = 0

function forLine(line) {
  const sequence = line
    .match(/-?\d+/g)
    .map(n => parseInt(n))
    .reverse()
  const nextNumber = findNextNumberIn(sequence)
  totalPart1 += nextNumber
}

function afterFile() {
  console.log('Part 1 Total:', totalPart1)
}

function findNextNumberIn(sequence) {
  const sequences = [sequence]
  for (let i=0; i<sequence.length-1; i++) {
    for (let j = 0; j<i+1; j++) {
      const backindex = i-j
      const diff = sequences[j][backindex] - sequences[j][backindex+1]
      if (backindex === 0) {
        if (isPatternFound(sequences[j])) {
          return sequences.reduce((a,c) => a+c[0], 0)
        }
        sequences[j+1] = [diff]
      }
      else {
        sequences[j+1].push(diff)
      }
    }
  }
}

function isPatternFound(sequence) {
  const isReady = sequence.every(num => num === 0)
  return isReady
}

readFile(
  inputFile,
  forLine,
  afterFile,
)
