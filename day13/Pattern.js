class Pattern {
  grid = []
  reflection = 0
  smudgeReflection = 0
  addLine(line) {
    this.grid.push(line.replaceAll('#',1).replaceAll('.',0).split(''))
  }
  assess() {
    this.searchHorizontalReflections(this.grid, 100)
    this.searchVerticalReflections()
  }
  searchHorizontalReflections(grid, multiplier) {
    for (let i=0; i<grid.length-1; i++) {
      let reflectionDiff = 0
      let r1 = i
      let r2 = i+1
      while (r1 >= 0 && r2 < grid.length) {
        reflectionDiff += compareRows(grid[r1], grid[r2])
        r1--
        r2++
      }
      if (reflectionDiff === 0) {
        this.reflection = (i+1) *multiplier
      }
      if (reflectionDiff === 1) {
        this.smudgeReflection = (i+1) *multiplier
      }
    }
  }
  searchVerticalReflections() {
    const grid = transpose(this.grid)
    this.searchHorizontalReflections(grid, 1)
  }
}

function transpose(matrix) {
  return matrix[0].map((_, ind) => matrix.map(row => row[ind]))
}

function compareRows(r1, r2) {
  let sum = 0
  for (let i=0; i<r1.length; i++) {
    sum += r1[i] ^ r2[i]
  }
  return sum
}

module.exports = Pattern