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
    const char = line[i]
    if (Digits.isDigitChar(char)) {
      return char
    }
    if (Digits.wordStartsWithChar(char)) {
      const slice = line.slice(i, i + Digits.longestWordLength)
      const wordFromSlice = Digits.wordFromString(slice)
      if (wordFromSlice) {
        return Digits.numberCharFromWord(wordFromSlice)
      }
    }
  }
  throw new Error("no digit found")
}

function getLastDigit(line) {
  for (let i=line.length-1; i>=0; i--) {
    const char = line[i]
    if (Digits.isDigitChar(char)) {
      return char
    }
    if (Digits.wordStartsWithChar(char)) {
      const slice = line.slice(i, i + Digits.longestWordLength)
      const wordFromSlice = Digits.wordFromString(slice)
      if (wordFromSlice) {
        return Digits.numberCharFromWord(wordFromSlice)
      }
    }
  }
  throw new Error("no digit found")
}

class Digits {
  static digitMap = {
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine': '9',
  }
  static longestWordLength = 5
  static getWords() {
    return Object.keys(this.digitMap)
  }
  static getDigitChars() {
    return Object.values(this.digitMap)
  }
  static numberCharFromWord(word) {
    return this.digitMap[word]
  }
  static wordStartsWithChar(char) {
    return this.getWords().map(word => word[0]).includes(char)
  }
  static isDigitChar(char) {
    return this.getDigitChars().includes(char)
  }
  static wordFromString(str) {
    for (let len of [3,4,5]) {
      const newStr = str.slice(0,len)
      if (this.getWords().includes(newStr)) {
        return newStr
      }
    }
    return null
  }
}
