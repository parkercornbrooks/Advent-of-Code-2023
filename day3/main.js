const readFile = require('../utils/ReadFile')
const inputFile = 'input.txt'

class Item {
  constructor(char, row, col) {
    this.char = char
    this.row = row
    this.col = col
  }
  isSymbol() {
    return !(this.char === '.' || !this.char)
  }
  isDigit() {
    const digitChars = '0123456789'
    return digitChars.includes(this.char)
  }
}

class LineParser {
  itemMap = {}
  numbers = []
  currentNumberStr = ''
  currentNumberId = 0
  currentColIndex = 0

  constructor(line, rowInd) {
    this.rowInd = rowInd
    this.parseLine(line)
  }
  parseLine(line) {
    for (let i=0; i<=line.length; i++) {
      const loc = `${this.rowInd}-${i}`
      const char = line[i]
      this.currentColIndex = i
      const item = new Item(char, this.rowInd, i)
      this.itemMap[loc] = item
      if (item.isDigit()) {
        this.currentNumberStr += char
      }
      else {
        this.checkNumberEnd()
      }
    }
  }
  checkNumberEnd() {
    if (this.currentNumberLength() > 0) {
      this.completeNumber()
    }
  }
  completeNumber() {
    const partNumber = new PartNumber({
      value: parseInt(this.currentNumberStr),
      colStart: this.currentColIndex - this.currentNumberLength(),
      colEnd: this.currentColIndex,
      rowIndex: this.rowInd,
    })
    this.numbers.push(partNumber)
    this.currentNumberId++
    this.currentNumberStr = ''
  }
  currentNumberLength() {
    return this.currentNumberStr.length
  }
}

class PartNumber {
  surroundingCells = [];

  constructor(partNumber) {
    this.value = partNumber.value
    this.rowIndex = partNumber.rowIndex
    this.colStart = partNumber.colStart
    this.colEnd = partNumber.colEnd
    this.constructCellList()
  }
  constructCellList() {
    this.addPriorRow()
    this.addCurrentRow()
    this.addNextRow()
  }
  addPriorRow() {
    const start = this.previousColumnIndex()
    for (let i=start; i<=this.colEnd; i++) {
      this.surroundingCells.push(`${this.rowIndex-1}-${i}`)
    }
  }
  addCurrentRow() {
    this.surroundingCells.push(`${this.rowIndex}-${this.previousColumnIndex()}`)
    this.surroundingCells.push(`${this.rowIndex}-${this.colEnd}`)
  }
  addNextRow() {
    const start = this.previousColumnIndex()
    for (let i=start; i<=this.colEnd; i++) {
      this.surroundingCells.push(`${this.rowIndex+1}-${i}`)
    }
  }
  previousColumnIndex() {
    return this.colStart-1
  }
}

class EngineSchematic {
  itemMap = {}
  foundNumbers = [];
  partNumbers = []
  addToMap(itemMap) {
    this.itemMap = {
      ...this.itemMap,
      ...itemMap,
    }
  }
  addNumbers(numbers) {
    this.foundNumbers.push(...numbers)
  }
  sumOfPartNumbers() {
    this.discoverPartNumbers()
    return this.partNumbers.reduce((sum, num) => {
      return sum += num.value
    }, 0)
  }
  discoverPartNumbers() {
    this.foundNumbers.forEach(number => {
      if (this.shouldIncludeNumber(number)) {
        this.partNumbers.push(number)
      }
    })
  }
  shouldIncludeNumber(number) {
    const cellsToCheck = number.surroundingCells
    for (const cell of cellsToCheck) {
      const item = this.itemMap[cell]
      if (item && item.isSymbol()) {
        return true
      }
    }
    return false
  }
}

readFile(
  inputFile,
  forLine,
  afterFile,
)

const schematic = new EngineSchematic()
let currentLine = 0

function forLine(line) {
  const parsed = new LineParser(line, currentLine)
  schematic.addToMap(parsed.itemMap)
  schematic.addNumbers(parsed.numbers)
  currentLine++
}

function afterFile() {
  console.log(`Total Part Numbers: ${schematic.sumOfPartNumbers()}`)
}
