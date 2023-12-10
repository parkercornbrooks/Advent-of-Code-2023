const readFile = require('../utils/ReadFile')

const inputFile = 'input.txt'

const directions = [
  [1,0,0,0], // left
  [0,1,0,0], // up
  [0,0,1,0], // down
  [0,0,0,1], // right
]
const charMap = {
  // [left, top, bottom, right]
  '|': [0,1,1,0],
  '-': [1,0,0,1],
  'L': [0,1,0,1],
  'J': [1,1,0,0],
  '7': [1,0,1,0],
  'F': [0,0,1,1],
  '.': [0,0,0,0],
}

let sPosition;
const grid = []
let currentRowIndex = 0

function findPipeEntryPoints(pos) {
  const nextSteps = []
  // assumption: only two surrounding blocks point towards the S
  directions.forEach((dir) => {
    const [newPos, tile] = nextPosition(pos, dir)
    if (tile && cameFrom(dir, tile)) {
      const next = nextDir(dir, tile)
      nextSteps.push({
        pos: newPos,
        dir: next,
      })
    }
  })
  return nextSteps
}

function nextPosition(pos, dir) {
  const newRowPos = pos[0] + dir[2] - dir[1]
  const newColPos = pos[1] + dir[3] - dir[0]
  const newPos = [newRowPos, newColPos]
  const tile = charMap[grid[newRowPos][newColPos]]
  return [newPos, tile]
}

function cameFrom(dir, charInOut) {
  const diff = dir.length - 1 - dir.indexOf(1)
  return charInOut[diff]
}

function nextDir(dir, charInOut) {
  dir.reverse()
  return charInOut.map((x, ind) => x ^ dir[ind])
}

function forLine(line) {
  if (!sPosition) {
    const sIndex = line.indexOf('S')
    if (sIndex !== -1) {
      sPosition = [currentRowIndex, sIndex]
    }
  }
  grid.push(line)

  currentRowIndex++
}

function afterFile() {
  let nextTiles = findPipeEntryPoints(sPosition)

  const visited = {}
  let step = 1
  let foundIntersection = false
  while (!foundIntersection) {
    step++
    nextTiles = nextTiles.map(tile => {
      const [nextPos, nextTile] = nextPosition(tile.pos, tile.dir)
      const nextDirection = nextDir(tile.dir, nextTile)
      const posString = `${nextPos[0]} - ${nextPos[1]}`
      if (visited[posString]) {
        foundIntersection = true
      } else {
        visited[posString] = true
      }
      return {
        pos: nextPos,
        dir: nextDirection,
      }
    })
  }
  console.log(`Part 1: ${step} steps`)
}

readFile(
  inputFile,
  forLine,
  afterFile,
)
