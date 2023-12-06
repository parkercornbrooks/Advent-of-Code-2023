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
    this.parseId(name)
    this.manageWinners(winners)
    this.managePicks(picks)
  }
  parseId(name) {
    const [_, id] = name.split(/\s+/)
    this.id = parseInt(id)
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
let cardCounts = {}
let totalLines = 0

function forLine(line) {
  const parser = new LineParser(line)
  totalLines = parser.id
  if (!cardCounts[parser.id]) {
    cardCounts[parser.id] = 0
  }
  cardCounts[parser.id] += 1
  const score = parser.score()
  const winningPicks = parser.winningPickCount()
  for (let i=parser.id+1; i < parser.id+1+winningPicks; i++) {
    if (!cardCounts[i]) {
      cardCounts[i] = cardCounts[parser.id]
    }
    else {
      cardCounts[i] = cardCounts[i] + cardCounts[parser.id]
    }
  }
  total += score
}

function afterFile() {
  let totalCount = 0
  for (let [id, count] of Object.entries(cardCounts)) {
    if (id <= totalLines) {
      totalCount += count
    }
  }
  console.log(`Score total: ${total}`)
  console.log(`Card count: ${totalCount}`)
}

readFile(
  inputFile,
  forLine,
  afterFile,
)