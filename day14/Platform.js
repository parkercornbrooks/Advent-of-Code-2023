class Platform {
  grid = []
  hashes = {}
  addRow(line) {
    this.grid.push(line.split(''))
  }
  print() {
    this.grid.forEach(row => console.log(row.join('')))
  }
  hash() {
    let s = ''
    this.grid.forEach(row => s += row.join(''))
    return s
  }
  findLoadAt(n) {
    const [patternStart, patternLength] = this.findPattern()
    const cyclesLeft = (n - patternStart) % patternLength
    for (let i=0; i<cyclesLeft-1; i++) {
      this.cycle()
    }
    return this.calculateLoad()
  }
  findPattern() {
    for (let i=0; i<Infinity; i++) {
      this.cycle()
      const patternRepeat = this.hashes[this.hash()]
      if (patternRepeat) {
        const patternLength = i-patternRepeat
        return [patternRepeat, patternLength]
      } else {
        this.hashes[this.hash()] = i
      }
    }
  }
  cycle() {
    this.tiltNorth()
    this.tiltWest()
    this.tiltSouth()
    this.tiltEast()
  }
  tiltNorth() {
    const newGrid = convertGrid(transpose(this.grid), 'L')
    this.grid = transpose(newGrid)
  }
  tiltSouth() {
    const newGrid = convertGrid(transpose(this.grid), 'R')
    this.grid = transpose(newGrid)
  }
  tiltWest() {
    this.grid = convertGrid(this.grid, 'L')
  }
  tiltEast() {
    this.grid = convertGrid(this.grid, 'R')
  }
  calculateLoad() {
    let load = 0
    this.grid.forEach((row, ind) => {
      const rocks = row.filter(x => x === 'O').length
      load += rocks*(this.grid.length-ind)
    })
    return load
  }
}

function convertGrid(matrix, dir) {
  for (let i=0; i<matrix.length; i++) {
    matrix[i] = convertRow(matrix[i], dir)
  }
  return matrix
}

function convertRow(row, dir) {
  const newRow = []
  let counts = {
    space: 0,
    rock: 0,
  }
  for (let i=0; i<row.length; i++) {
    if (row[i] === '.') {
      counts.space++
    } else if (row[i] === 'O') {
      counts.rock++
    } else if (row[i] === '#') {
      const segment = buildSegment(counts, dir)
      newRow.push(...segment, '#')
      counts.space = 0, counts.rock = 0
    }
  }
  const segment = buildSegment(counts, dir)
  newRow.push(...segment)
  return newRow
}

function buildSegment(counts, dir) {
  const rocks = new Array(counts.rock).fill('O')
  const spaces = new Array(counts.space).fill('.')
  if (dir ==='L') {
    return [...rocks, ...spaces]
  }
  return [...spaces, ...rocks]
}

function transpose(matrix) {
  return matrix[0].map((_, ind) => matrix.map(row => row[ind]))
}

module.exports = Platform
