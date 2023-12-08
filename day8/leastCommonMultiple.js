function primeFactors(n) {
  const factors = {}
  let currentFactor = 2
  while (n > 1) {
    if (n % currentFactor === 0) {
      if (factors[currentFactor]) {
        factors[currentFactor] += 1
      } else {
        factors[currentFactor] = 1
      }
      n = n / currentFactor
    } else {
      currentFactor++
    }
  }
  return factors
}

function LCM(list) {
  let LCM = 1
  const allPrimes = {}
  list.forEach(num => {
    const factorMap = primeFactors(num)
    Object.entries(factorMap).forEach(([prime, count]) => {
      if (!allPrimes[prime]) {
        allPrimes[prime] = count
      } else {
        allPrimes[prime] = Math.max(allPrimes[prime], count)
      }
    })
  })
  Object.entries(allPrimes).forEach(([prime, count]) => {
    LCM *= Math.pow(parseInt(prime), count)
  })
  return LCM
}

module.exports = LCM