const classicRanks = 'AKQJT98765432'
const jokerRanks = 'AKQT98765432J'

class Hand {
  constructor(cards, bid) {
    this.cards = cards
    this.bid = parseInt(bid)
    this.classify()
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
    const maxCount = Math.max(...counts)
    const length = counts.length
    const typeRank = maxCount - length
    return typeRank
  }
}

class CamelCards {
  hands = []
  addHand(cards, bid) {
    const hand = new Hand(cards, bid)
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
    const typeDiff = a[type] - b[type]
    if (typeDiff) return typeDiff
    for (let i=0; i<a.cards.length; i++) {
      const cardDiff = rankings.indexOf(b.cards[i]) - rankings.indexOf(a.cards[i])
      if (cardDiff) return cardDiff
    }
    return 0
  }
}

function addToHighestCount(counts, jokerCount) {
  const countValues = Object.values(counts)
  if (jokerCount === 5) return [5]
  if (jokerCount) {
    const maxVal = Math.max(...countValues)
    const index = countValues.indexOf(maxVal)
    countValues[index] += jokerCount
  }
  return countValues
}