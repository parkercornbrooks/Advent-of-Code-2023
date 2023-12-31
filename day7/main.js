const readFile = require('../utils/ReadFile')
const CamelCards = require('./CamelCards')
const inputFile = 'input.txt'

const game = new CamelCards()

function forLine(line) {
  const [cards, bid] = line.split(' ')
  game.addHand(cards, bid)
}

function afterFile() {
  const classicWinnings = game.computeWinnings('classic')
  console.log('Part 1:', classicWinnings)
  const jokerWinnings = game.computeWinnings('joker')
  console.log('Part 2:', jokerWinnings)
}

readFile(
  inputFile,
  forLine,
  afterFile,
)