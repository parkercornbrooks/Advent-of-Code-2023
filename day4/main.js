const readFile = require('../utils/ReadFile')
const inputFile = 'input.txt'

class ScratchCard {
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

class CardCounter {
  cardCounts = {};
  totalLines = 0;
  addOne(id) {
    this.ensureCountIsInitialized(id)
    this.cardCounts[id] += 1
  }
  addToNextCounts(id, winners) {
    for (let i=id+1; i < id+1+winners; i++) {
      this.ensureCountIsInitialized(i)
      this.cardCounts[i] += this.cardCounts[id]
    }
  }
  sumCounts() {
    let totalCount = 0
    for (let [id, count] of Object.entries(this.cardCounts)) {
      if (id <= this.totalLines) {
        totalCount += count
      }
    }
    return totalCount
  }
  ensureCountIsInitialized(id) {
    if (!this.cardCounts[id]) {
      this.cardCounts[id] = 0
    }
  }
}

let scoreTotal = 0
const cardCounter = new CardCounter()

function forLine(line) {
  const card = new ScratchCard(line)

  const score = card.score()
  scoreTotal += score

  const currentId = card.id

  cardCounter.totalLines = currentId
  cardCounter.addOne(currentId)

  const winningPicks = card.winningPickCount()
  cardCounter.addToNextCounts(currentId, winningPicks)
}

function afterFile() {
  console.log(`Score total: ${scoreTotal}`)
  const totalCount = cardCounter.sumCounts()
  console.log(`Card count: ${totalCount}`)
}

readFile(
  inputFile,
  forLine,
  afterFile,
)