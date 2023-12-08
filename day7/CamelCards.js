const handTypes = {
  FIVE: 7,
  FOUR: 6,
  FULL: 5,
  THREE: 4,
  TWO: 3,
  ONE: 2,
  HIGH: 1,
}

const classicRanks = 'AKQJT98765432'
const jokerRanks = 'AKQT98765432J'

class Hand {
  constructor(line) {
    this.parseLine(line)
    this.classify()
  }
  parseLine(line) {
    const [hand, bidString] = line.split(' ')
    this.cards = hand
    this.bid = parseInt(bidString)
  }
  classify() {
    this.classifyStandard()
    this.classifyJoker()
  }
  classifyStandard() {
    const counts = Object.values(this.getCounts())
    this.classicType = this.getTypeFromCounts(counts)
  }
  classifyJoker() {
    let counts = this.getCounts()
    const jokerCount = counts['J']
    delete(counts['J'])
    counts = addToHighestCount(counts, jokerCount)
    this.jokerType = this.getTypeFromCounts(counts)
  }
  getCounts() {
    const counts = {}
    this.cards.split('').forEach(card => {
      if (counts[card]) counts[card] += 1
      else counts[card] = 1
    })
    return counts
  }
  getTypeFromCounts(counts) {
    let type
    if (counts.includes(5)) {
      type = handTypes.FIVE
    } else if (counts.includes(4)) {
      type = handTypes.FOUR
    } else if (counts.includes(3) && counts.includes(2)) {
      type = handTypes.FULL
    } else if (counts.includes(3)) {
      type = handTypes.THREE
    } else if (counts.includes(2) && counts.length === 3) {
      type = handTypes.TWO
    } else if (counts.includes(2)) {
      type = handTypes.ONE
    } else {
      type = handTypes.HIGH
    }
    return type
  }
}

class CamelCards {
  hands = []
  addHand(line) {
    const hand = new Hand(line)
    this.hands.push(hand)
  }
  computeWinnings(rule) {
    this.sortHands(rule)
    let total = 0
    this.hands.forEach((hand, index) => {
      const handWinnings = hand.bid * (index+1)
      total += handWinnings
    })
    return total
  }
  sortHands(rule) {
    let rankFunction
    if (rule === 'classic') {
      rankFunction = compareHands('classicType', classicRanks)
    } else {
      rankFunction = compareHands('jokerType', jokerRanks)
    }
    this.hands.sort(rankFunction)
  }
}

module.exports = CamelCards

function compareHands(type, rankings) {
  return function(a,b) {
    if (a[type] < b[type]) {
      return -1
    } else if (a[type] > b[type]) {
      return 1
    }
    for (let i=0; i<a.cards.length; i++) {
      const diff = rankings.indexOf(b.cards[i]) - rankings.indexOf(a.cards[i])
      if (diff !== 0) {
        return diff
      }
    }
    return 0
  }
}

function addToHighestCount(counts, jokerCount) {
  const countValues = Object.values(counts)
  if (jokerCount === 5) {
    return [5]
  }
  if (jokerCount) {
    const maxVal = Math.max(...countValues)
    const index = countValues.indexOf(maxVal)
    countValues[index] += jokerCount
  }
  return countValues
}