const readFile = require('../utils/ReadFile')
const inputFile = 'input.txt'

class LineParser {
  #splitRegex = /[:|]/
  winners;
  picks;
  constructor(line) {
    this.deconstruct(line)
  }
  deconstruct(line) {
    const [name, winners, picks] = line.split(this.#splitRegex)
    this.manageWinners(winners)
    this.managePicks(picks)
  }
  manageWinners(numberString) {
    const winners = numberString.trim().split(/\s+/)
    this.winners = new Set(winners)
  }
  managePicks(numberString) {
    const picks = numberString.trim().split(/\s+/)
    this.picks = new Set(picks)
  }
  winningPickCount() {
    let count = 0
    for (let winner of this.winners) {
      if (this.picks.has(winner)) {
        count ++
      }
    }
    return count
  }
  score() {
    const count = this.winningPickCount()
    if (count === 0) {
      return count
    }
    return Math.pow(2, count-1)
  }
}

let total = 0

function forLine(line) {
  const parser = new LineParser(line)
  const score = parser.score()
  total += score
}

function afterFile() {
  console.log(total)
}

readFile(
  inputFile,
  forLine,
  afterFile,
)