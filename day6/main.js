const readFile = require('../utils/ReadFile')

/*
Basic calculations
  timeAccelerated = raceTime - secHeld
  distance = timeAccelerated * secHeld
Therefore:
  distance = total*secHeld - secHeld^2
Translated to parabolic formula:
  y = -1*x^2 + total*x + 0
    a = -1
    b = total
    c = 0
Translate down (-) by c (recordDistance) to find where the parabola crosses the y=c axis
    c = -recordDistance
*/

const inputFile = 'input.txt'
const numbersRegex = /\d+/g
let times
let distances

let timePart2
let distancePart2

function calculateTimeValues(raceTime, recordDistance) {
  const a = -1
  const b = raceTime
  const c = -recordDistance

  const x1 = (-b + Math.sqrt(Math.pow(b,2)-4*a*c))/(2*a)
  const x2 = (-b - Math.sqrt(Math.pow(b,2)-4*a*c))/(2*a)
  return [x1, x2]
}

function getWaysToWin(raceTime, recordDistance) {
  const [min, max] = calculateTimeValues(raceTime, recordDistance)
  const minisculeValue = 0.000000001
  const minInt = Math.ceil(min+minisculeValue)
  const maxInt = Math.floor(max-minisculeValue)
  return maxInt-minInt + 1
}

function forLine(line) {
  if (line.startsWith('Time')) {
    const timeStrings = line.match(numbersRegex)
    times = timeStrings.map(s => parseInt(s))
    timePart2 = timeStrings.join('')
  }
  else if (line.startsWith('Distance')) {
    const distanceStrings = line.match(numbersRegex)
    distances = distanceStrings.map(s => parseInt(s))
    distancePart2 = distanceStrings.join('')
  }
}

function afterFile() {
  let totalMultiplier = 1
  times.forEach((time, index) => {
    const distance = distances[index]
    const waysToWin = getWaysToWin(time, distance)
    totalMultiplier *= waysToWin
  })
  console.log('Part 1:', totalMultiplier)

  const waysToWin = getWaysToWin(timePart2, distancePart2)
  console.log('Part 2:', waysToWin)
}

readFile(
  inputFile,
  forLine,
  afterFile,
)
