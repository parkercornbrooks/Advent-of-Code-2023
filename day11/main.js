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
  let totalDist = 0
  for (let i=0; i<galaxies.length-1; i++) {
    for (let j=i+1; j<galaxies.length; j++) {
      const dist = calculateDist(galaxies[i], galaxies[j])
      totalDist += dist
    }
  }
  console.log('Part 1:', totalDist)
}

function calculateDist(a, b) {
  const sortedX = [a[1], b[1]].sort(sortByNum)
  const sortedY = [a[0], b[0]].sort(sortByNum)
  const horiz = sortedX[1] - sortedX[0]
  const horizExtra = columns.slice(sortedX[0], sortedX[1]).filter(Boolean).length
  const vert = sortedY[1] - sortedY[0]
  const vertExtra = rows.slice(sortedY[0], sortedY[1]).filter(Boolean).length
  
  const total = horiz + horizExtra + vert + vertExtra
  return total
}

function sortByNum(a,b) { return a-b }

readFile(
  inputFile,
  forLine,
  afterFile,
)