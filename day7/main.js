const readFile = require('../utils/ReadFile')
const CamelCards = require('./CamelCards')
const inputFile = 'input.txt'

const game = new CamelCards()

function forLine(line) {
  game.addHand(line)
}

function afterFile() {
  const winnings = game.computeWinnings()
  console.log('Part 1:', winnings)
}

readFile(
  inputFile,
  forLine,
  afterFile,
)