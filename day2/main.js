const readFile = require('../utils/ReadFile')

const inputFile = 'input.txt'
const totalCounts = {
  red: 12,
  green: 13,
  blue: 14,
}
let runningTotal = 0

function forGame(line) {
  const game = new Game(line)
  if (game.isPossible(totalCounts)) {
    runningTotal += game.id
  }
}

function afterGames() {
  console.log(`Total: ${runningTotal}`)
}

class GameParser {
  #splitRegex = /[:,;]/;
  id;
  counts = {};

  constructor(line) {
    this.line = line
    this.deconstruct()
  }
  deconstruct() {
    const parts = this.splitLine()
    this.manageParts(parts)
  }
  splitLine() {
    return this.line.split(this.#splitRegex)
  }
  manageParts(parts) {
    const [gameTitle, ...cubeCounts] = parts
    this.parseIdFromTitle(gameTitle)
    this.parseCubeCounts(cubeCounts)
  }
  parseIdFromTitle(title) {
    const [_, id] = title.split(' ')
    this.id = parseInt(id)
  }
  parseCubeCounts(cubeCounts) {
    cubeCounts.forEach(count => {
      this.parseCubeCount(count)
    })
  }
  parseCubeCount(count) {
    const [amount, color] = count.trim().split(' ')
    this.counts[color] = this.counts[color] || []
    this.counts[color].push(amount)
  }
}

class Game {
  constructor(gameLine) {
    const lp = new GameParser(gameLine)
    this.id = lp.id
    this.counts = lp.counts
  }
  isPossible(totals) {
    const entries = Object.entries(totals)
    for (const [color, total] of entries) {
      if (!this.colorIsPossible(color, total)) {
        return false
      }
    }
    return true
  }
  colorIsPossible(color, total) {
    const maxForColor = this.maxCount(color)
    return maxForColor <= total
  }
  maxCount(color) {
    if (!this.counts[color]) {
      throw new Error(`Color ${color} did not exist`)
    }
    return Math.max(...this.counts[color])
  }
}

readFile(
  inputFile,
  forGame,
  afterGames,
)