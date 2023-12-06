const readFile = require('../utils/ReadFile')
const inputFile = 'input.txt'

class Item {
  numberId = null
  constructor(char, row, col) {
    this.char = char
    this.row = row
    this.col = col
  }
  isSymbol() {
    return !(this.char === '.' || !this.char)
  }
  isGearSymbol() {
    return this.char === '*'
  }
  isDigit() {
    const digitChars = '0123456789'
    return digitChars.includes(this.char)
  }
  setNumberId(numberId) {
    this.numberId = numberId
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
        item.setNumberId(this.universalNumberId())
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
      id: this.universalNumberId(),
    })
    this.numbers.push(partNumber)
    this.currentNumberId++
    this.currentNumberStr = ''
  }
  currentNumberLength() {
    return this.currentNumberStr.length
  }
  universalNumberId() {
    return `${this.rowInd}-${this.currentNumberId}`
  }
}

class PartNumber {
  surroundingCells = [];

  constructor(partNumber) {
    this.value = partNumber.value
    this.rowIndex = partNumber.rowIndex
    this.colStart = partNumber.colStart
    this.colEnd = partNumber.colEnd
    this.id = partNumber.id
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
  calculateGearRatioSum() {
    let totalGR = 0
    const gears = this.findGearChars()
    for (let gear of gears) {
      const ratio = this.searchForGear(gear)
      totalGR += ratio
    }
    return totalGR
  }
  findGearChars() {
    const gearItems = []
    const items = Object.values(this.itemMap)
    for (let item of items) {
      if (item.isGearSymbol()) {
        gearItems.push(item)
      }
    }
    return gearItems
  }
  searchForGear(gear) {
    const numberIds = new Set()
    const surroundingItems = this.getSurroundingItems(gear)
    for (let item of surroundingItems) {
      if (item && item.numberId) {
        numberIds.add(item.numberId)
      }
    }
    if (numberIds.size === 2) {
      const gearRatio = this.calculateGearRatio(numberIds)
      return gearRatio
    }
    return 0
  }
  getSurroundingItems(gear) {
    const items = []
    const vertItems = this.getVerticalItems(gear)
    items.push(...vertItems)
    for (let item of [gear, ...vertItems]) {
      items.push(...this.getHorizontalItems(item))
    }
    return items
  }
  getVerticalItems(item) {
    const above = this.itemMap[`${item.row-1}-${item.col}`]
    const below = this.itemMap[`${item.row+1}-${item.col}`]
    return [above, below]
  }
  getHorizontalItems(item) {
    const left = this.itemMap[`${item.row}-${item.col-1}`]
    const right = this.itemMap[`${item.row}-${item.col+1}`]
    return [left, right]
  }
  calculateGearRatio(numberIds) {
    let ratio = 1
    numberIds.forEach(numberId => {
      const number = this.foundNumbers.find(n => n.id === numberId)
      const value = number.value
      ratio *= value
    })
    return ratio
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
  console.log(`Total Gear Ratio: ${schematic.calculateGearRatioSum()}`)
}
