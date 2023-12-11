const readFile = require('../utils/ReadFile')

const inputFile = 'input.txt'

let columns
let rows = []
let galaxies = []

function forLine(line) {
  let rowHasGalaxy = false
  if (!columns) {
    columns = new Array(line.length).fill(true)
  }
  for (let i=0; i<line.length; i++) {
    if (line[i] === '#') {
      galaxies.push([rows.length, i])
      rowHasGalaxy = true
      columns[i] = false
    }
  }
  rows.push(!rowHasGalaxy)
}

function afterFile() {
  let totalDistPart1 = 0
  let totalDistPart2 = 0
  for (let i=0; i<galaxies.length-1; i++) {
    for (let j=i+1; j<galaxies.length; j++) {
      const distPart1 = calculateDist(galaxies[i], galaxies[j], 2)
      const distPart2 = calculateDist(galaxies[i], galaxies[j], 1000000)
      totalDistPart1 += distPart1
      totalDistPart2 += distPart2
    }
  }
  console.log('Part 1:', totalDistPart1)
  console.log('Part 2:', totalDistPart2)
}

function calculateDist(a, b, pad) {
  const horizontalDistance = calculateDistance(a[1], b[1], pad, columns)
  const verticalDistance = calculateDistance(a[0], b[0], pad, rows)
  
  const total = horizontalDistance + verticalDistance
  return total
}

function calculateDistance(a, b, pad, dirArray) {
  const sorted = [a, b].sort(sortByNum)
  const perceivedDist = sorted[1] - sorted[0]
  let extraDist = dirArray
    .slice(sorted[0], sorted[1])
    .filter(Boolean)
    .length
  extraDist = extraDist * (pad-1)
  return perceivedDist + extraDist
}

function sortByNum(a,b) { return a-b }

readFile(
  inputFile,
  forLine,
  afterFile,
)