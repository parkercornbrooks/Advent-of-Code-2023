class MapLine {
  constructor(mapLine) {
    this.destStart = parseInt(mapLine.destStart)
    this.srcStart = parseInt(mapLine.srcStart)
    this.length = parseInt(mapLine.length)
  }
  contains(input) {
    const srcEnd = this.srcStart + this.length
    return input >= this.srcStart && input < srcEnd
  }
  getDestination(input) {
    const srcDestDiff = this.srcStart - this.destStart
    return input - srcDestDiff
  }
}

class MapGroup {
  mapLines = []
  constructor({ source, destination }) {
    this.source = source
    this.destination = destination
  }
  addMap(mapLine) {
    this.mapLines.push(mapLine)
  }
  convert(input) {
    let output = input
    this.mapLines.forEach(map => {
      if (map.contains(input)) {
        output = map.getDestination(input)
      }
    })
    return output
  }
}

class Almanac {
  seeds = [];
  mapGroups = {};
  currentMapType;

  setSeeds(seeds) {
    this.seeds = seeds.map(seed => parseInt(seed))
  }
  initializeMapGroup(info) {
    this.currentMapType = info.source
    const mapGroup = new MapGroup(info)
    this.mapGroups[info.source] = mapGroup
  }
  addMap(mapDto) {
    const map = new MapLine(mapDto)
    const currentGroup = this.mapGroups[this.currentMapType]
    currentGroup.addMap(map)
  }
  getLowestLocation() {
    const locations = this.getAllLocations()
    return Math.min(...locations)
  }
  getLowestLocationPart2() {
    let lowest = Infinity;
    this.seeds.forEach((seed, ind, arr) => {
      if (ind % 2 === 0) {
        const amtToAdd = arr[ind+1]
        for (let i=seed; i < seed+amtToAdd; i++) {
          const location = this.traverse(i)
          if (location < lowest) {
            lowest = location
          }
        }
      }
    })
    return lowest
  }
  getAllLocations() {
    return this.seeds.map(seed => {
      return this.traverse(seed)
    })
  }
  traverse(seed) {
    let sourceName = 'seed'
    let input = seed
    while (true) {
      const group = this.mapGroups[sourceName]
      if (!group) {
        break
      }
      input = group.convert(input)
      sourceName = group.destination
    }
    return input
  }
}

module.exports = Almanac
