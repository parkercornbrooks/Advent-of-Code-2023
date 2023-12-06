const fs = require('fs')
const readline = require('readline')

// load file
const fileName = 'input.txt'
const inputStream = fs.createReadStream(fileName)

const rl = readline.createInterface({
  input: inputStream,
  crlfDelay: Infinity,
})

// initialize total
let total = 0

// loop through file lines
rl.on('line', line => {
  const number = getNumberFromLine(line)
  total += number
})

rl.on('close', () => console.log(`Total: ${total}`))

function getNumberFromLine(line) {
  const firstDigitString = getFirstDigit(line)
  const lastDigitString = getLastDigit(line)
  const numberString = firstDigitString + lastDigitString
  return parseInt(numberString)
}

function getFirstDigit(line) {
  for (let i=0; i<line.length; i++) {
    if (isDigit(line[i])) {
      return line[i]
    }
  }
  throw new Error("no digit found")
}

function getLastDigit(line) {
  for (let i=line.length-1; i>=0; i--) {
    if (isDigit(line[i])) {
      return line[i]
    }
  }
  throw new Error("no digit found")
}

function isDigit(character) {
  const digitChars = '0123456789'
  return digitChars.includes(character)
}