const readFile = require('../utils/ReadFile')

const inputFile = 'input.txt'
const totalCounts = {
  red: 12,
  green: 13,
  blue: 14,
}
let runningTotal = 0
let powerTotal = 0

function forGame(line) {
  const game = new Game(line)
  if (game.isPossible(totalCounts)) {
    runningTotal += game.id
  }
  powerTotal += game.power()
}

function afterGames() {
  console.log(`Total: ${runningTotal}`)
  console.log(`Power Total: ${powerTotal}`)
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
    this.counts[color] = this.counts[color] || 0
    this.counts[color] = Math.max(this.counts[color], amount)
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
    const maxForColor = this.counts[color]
    return maxForColor <= total
  }
  power() {
    let power = 1
    for (const color of ['red', 'green', 'blue']) {
      power *= this.counts[color]
    }
    return power
  }
}

readFile(
  inputFile,
  forGame,
  afterGames,
)