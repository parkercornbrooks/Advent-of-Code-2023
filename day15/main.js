const readFile = require('../utils/ReadFile')

let total = 0

function hashReduce(current, char) {
  const asciiCode = char.charCodeAt(0)
  current += asciiCode
  current *= 17
  current %= 256
  return current
}

function forLine(line) {
  line.split(',').forEach(str => {
    const stepTotal = str.split('').reduce(hashReduce, 0)
    total += stepTotal
  })
}

function afterFile() {
  console.log(total)
}

readFile(
  'input.txt',
  forLine,
  afterFile,
)