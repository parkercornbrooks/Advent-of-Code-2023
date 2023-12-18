const readFile = require('../utils/ReadFile')

let totalPartOne = 0
const boxes = {}

function hashReduce(current, char) {
  const asciiCode = char.charCodeAt(0)
  current += asciiCode
  current *= 17
  current %= 256
  return current
}

function getHash(str) {
  return str.split('').reduce(hashReduce, 0)
}

function forLine(line) {
  line.split(',').forEach(str => {
    const stepHash = getHash(str)
    totalPartOne += stepHash

    const [lensLabel, focalLength] = str.split(/[=-]/)
    const boxNumber = getHash(lensLabel)
    if (!boxes[boxNumber]) {
      boxes[boxNumber] = []
    }
    const currentBox = boxes[boxNumber]
    const sameLensIndex = currentBox.findIndex(l => l.label === lensLabel)
    const hasSameLens = sameLensIndex >= 0
    if (focalLength) {
      lens = {
        label: lensLabel,
        f: parseInt(focalLength),
      }
      if (hasSameLens) {
        currentBox.splice(sameLensIndex,1,lens)
      }
      else {
        currentBox.push(lens)
      }
    } else {
      if (hasSameLens) {
        currentBox.splice(sameLensIndex,1)
      }
    }
  })
}

function afterFile() {
  console.log(`Part 1: ${totalPartOne}`)
  let totalFocusPower = 0
  Object.entries(boxes).forEach(([boxNumber, lenses]) => {
    lenses.forEach((lens, ind) => {
      const box = parseInt(boxNumber) + 1
      const slot = ind + 1
      const focalLength = lens.f
      const focusPower = box * slot * focalLength
      totalFocusPower += focusPower
    })
  })
  console.log(`Part 2: ${totalFocusPower}`)
}

readFile(
  'input.txt',
  forLine,
  afterFile,
)