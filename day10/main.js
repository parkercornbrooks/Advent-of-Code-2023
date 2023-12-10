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
let sTile;
const grid = []
const visited = {}
let currentRowIndex = 0

function findPipeEntryPoints(pos) {
  const nextSteps = []
  let sTileMap = [0,0,0,0]
  // assumption: only two surrounding blocks point towards the S
  directions.forEach((dir) => {
    const [newPos, tile] = nextPosition(pos, dir)
    if (tile && cameFrom(dir, tile)) {
      sTileMap = sTileMap.map((x, ind) => x | dir[ind])
      const next = nextDir(dir, tile)
      visited[positionString(newPos)] = true
      nextSteps.push({
        pos: newPos,
        dir: next,
      })
    }
  })
  setSTileValue(sTileMap)
  return nextSteps
}

function setSTileValue(sTileMap) {
  const charMapToArray = Object.entries(charMap)
  const found = charMapToArray.find(([char, representation]) =>{
    return representation.join() === sTileMap.join()
  })
  sTile = found[0]
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

function positionString(pos) {
  return `${pos[0]} - ${pos[1]}`
}

function forLine(line) {
  if (!sPosition) {
    const sIndex = line.indexOf('S')
    if (sIndex !== -1) {
      sPosition = [currentRowIndex, sIndex]
      visited[positionString(sPosition)] = true
    }
  }
  grid.push(line)

  currentRowIndex++
}

function afterFile() {
  let nextTiles = findPipeEntryPoints(sPosition)
  let step = 1
  let foundIntersection = false
  while (!foundIntersection) {
    step++
    nextTiles = nextTiles.map(tile => {
      const [nextPos, nextTile] = nextPosition(tile.pos, tile.dir)
      const nextDirection = nextDir(tile.dir, nextTile)
      const posString = positionString(nextPos)
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

  let insideCount = 0
  grid.forEach((row, rowInd) => {
    let isInside = false
    let isOnLine = false
    let flipOn = ''
    for (let colInd=0; colInd<row.length; colInd++) {
      let tile = row[colInd]
      if (tile === 'S') {
        tile = sTile
      }
      const tilePositionString = positionString([rowInd, colInd])
      if (visited[tilePositionString]) {
        if (tile === '|') {
          isInside = !isInside
        }
        else if (tile === 'F') {
          isOnLine = true
          flipOn = 'J'
        }
        else if (tile === 'L') {
          isOnLine = true
          flipOn = '7'
        }
        else if (['J', '7'].includes(tile)) {
          isOnLine = false
          if (flipOn === tile) {
            isInside = !isInside
          }
        }
      } else if (isInside) {
        insideCount ++
      }
    }
  })
  console.log(`Part 2: ${insideCount} tiles inside`)
}

readFile(
  inputFile,
  forLine,
  afterFile,
)
