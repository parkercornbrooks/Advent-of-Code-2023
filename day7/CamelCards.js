const handTypes = {
  FIVE: 7,
  FOUR: 6,
  FULL: 5,
  THREE: 4,
  TWO: 3,
  ONE: 2,
  HIGH: 1,
}

const cardTypes = 'AKQJT98765432'

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
    let type
    const counts = this.getCounts()
    if (counts === '5') {
      type = handTypes.FIVE
    } else if (counts.includes('4')) {
      type = handTypes.FOUR
    } else if (counts.includes('3') && counts.includes('2')) {
      type = handTypes.FULL
    } else if (counts.includes('3')) {
      type = handTypes.THREE
    } else if (counts.includes('2') && counts.length === 3) {
      type = handTypes.TWO
    } else if (counts.includes('2')) {
      type = handTypes.ONE
    } else {
      type = handTypes.HIGH
    }
    this.type = type
  }
  getCounts() {
    const counts = {}
    this.cards.split('').forEach(card => {
      if (counts[card]) counts[card] += 1
      else counts[card] = 1
    })
    return Object.values(counts).join('')
  }
}

class CamelCards {
  hands = []
  addHand(line) {
    const hand = new Hand(line)
    this.hands.push(hand)
  }
  computeWinnings() {
    this.sortHands()
    let total = 0
    this.hands.forEach((hand, index) => {
      const handWinnings = hand.bid * (index+1)
      total += handWinnings
    })
    return total
  }
  sortHands() {
    this.hands.sort(compareHands)
  }
}

module.exports = CamelCards

function compareHands(a,b) {
  if (a.type < b.type) {
    return -1
  } else if (a.type > b.type) {
    return 1
  }
  for (let i=0; i<a.cards.length; i++) {
    const diff = cardTypes.indexOf(b.cards[i]) - cardTypes.indexOf(a.cards[i])
    if (diff !== 0) {
      return diff
    }
  }
  return 0
}