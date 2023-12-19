class Pattern {
  rows = []
  verticalRefMap = []
  addLine(line) {
    this.rows.push(line)
    this.initializeRefMap(line.length-1)
    this.fillRefMap(line)
  }
  initializeRefMap(length) {
    if (this.verticalRefMap.length === 0) {
      this.verticalRefMap = new Array(length).fill(true)
    }
  }
  fillRefMap(line) {
    for (let i=0; i<line.length-1; i++) {
      if (line[i] !== line[i+1]) {
        this.verticalRefMap[i] = false
      }
    }
  }
  assess() {
    return this.searchVerticalReflections() || this.searchHorizontalReflections()*100
  }
  searchVerticalReflections() {
    for (let i=0; i<this.verticalRefMap.length; i++) {
      if (this.verticalRefMap[i]) {
        //console.log(`possible vertical reflection at ${i+1}`)
        const isRef = this.searchColumnsFrom(i)
        if (isRef) {
          //console.log(`  ${i+1} is a reflection`)
          return i+1
        }
      }
    }
  }
  searchHorizontalReflections() {
    for (let i=0; i<this.rows.length-1; i++) {
      if (this.rows[i] === this.rows[i+1]) {
        //console.log(`possible horizontal reflection at ${i+1}`)
        const isRef = this.searchRowsFrom(i)
        if (isRef) {
          //console.log(`  ${i+1} is a reflection`)
          return i+1
        }
      }
    }
  }
  searchColumnsFrom(colInd) {
    let c1 = colInd-1
    let c2 = colInd+2
    while (c1 >= 0 && c2 < this.rows[0].length) {
      for (let row of this.rows) {
        if (row[c1] !== row[c2]) {
          return false
        }
      }
      c1--
      c2++
    }
    return true
  }
  searchRowsFrom(rowInd) {
    let r1 = rowInd-1
    let r2 = rowInd+2
    while(r1 >= 0 && r2 < this.rows.length) {
      if (this.rows[r1] !== this.rows[r2]) {
        return false
      }
      r1--
      r2++
    }
    return true
  }
}

module.exports = Pattern