class AlmanacParser {
  #numberParseRegex = /\d+/g
  #digitRegex = /\d/
  #dashRegex = /-/

  constructor(line) {
    this.line = line
  }
  isSeedLine() {
    return this.line.startsWith('seeds:')
  }
  isMapLine() {
    // it's a map line if the first char is a digit
    return this.#digitRegex.test(this.line[0])
  }
  isTitleLine() {
    return this.#dashRegex.test(this.line)
  }
  parseNumbers() {
    const numbers = this.line.match(this.#numberParseRegex)
    return numbers
  }
  parseMap() {
    const [destStart, srcStart, length] = this.parseNumbers()
    return {
      destStart,
      srcStart,
      length
    }
  }
  parseTitle() {
    const [hyphenatedTitle, _] = this.line.split(' ')
    const [source, to, destination] = hyphenatedTitle.split('-')
    return {
      source,
      destination,
    }
  }
}

module.exports = AlmanacParser