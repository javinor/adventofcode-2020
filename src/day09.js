const fs = require('fs')
const _ = require('lodash')

const numbers = fs.readFileSync('./src/day09.input', 'utf8').split('\n').map(n => parseInt(n, 10))

const exampleNumbers = `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`.split('\n').map(n => parseInt(n, 10))

const isSumOfTwo = (preamble, n) => {
  for (let i = 0; i<preamble.length; i++) {
    for (let j = i + 1; j<preamble.length; j++) {
      if (preamble[i] + preamble[j] == n) {
        return true
      }
    }  
  }

  return false
}

const part1 = (numbers, preambleLength) => {
  let preambleStart = 0
  let preambleEnd = preambleLength
  let index = preambleLength

  while (true) {
    const preamble = numbers.slice(preambleStart, preambleEnd)
    const current = numbers[index]
    // console.log({preamble, index, current})

    if (!isSumOfTwo(preamble, current)) {
      return current
    }

    preambleStart += 1
    preambleEnd += 1
    index += 1
  }
}

const findContiguousNumbersThatSum = (numbers, target) => {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 2; j <= numbers.length; j++) {
      const xs = numbers.slice(i, j)
      if (_.sum(xs) == target) {
        return xs
      }
    }
  }

  throw new Error("no contiguous set of numbers found that sum to: ", {target})
}

const part2 = (numbers, preambleLength) => {
  const invalidNumber = part1(numbers, preambleLength)

  const xs = findContiguousNumbersThatSum(numbers, invalidNumber)
  const result = {
    smallest: _.min(xs),
    largest: _.max(xs)
  }
  
  console.log({...result, xs})
  return result.smallest + result.largest
}

console.log("part1 example: ", part1(exampleNumbers, 5))
console.log("part1: ", part1(numbers, 25))

console.log("part2 example: ", part2(exampleNumbers, 5))
console.log("part2: ", part2(numbers, 25))

