const fs = require('fs')
const { min, sortBy } = require('lodash')
const _ = require('lodash')

const input = fs.readFileSync('./src/day13.input', 'utf8')

const exampleInput = `939
7,13,x,x,59,x,31,19`

const part1 = (input) => {
  const lines = input.split('\n')
  const timestamp = parseInt(lines[0], 10)
  const buses = lines[1].split(',').filter(x => x != 'x').map(busId => parseInt(busId, 10))

  const busWaitTimes = buses.map(busId => [busId, busId - (timestamp % busId)])

  const [busId, minWaitTime] = _.minBy(busWaitTimes, ([_busId, waitTime]) => waitTime)
  return busId * minWaitTime
}

const part2 = (input) => {
  const pairs = 
    input.split('\n')[1]
      .split(',')
      .map((x, i) => x == 'x' ? x : [parseInt(x, 10), i])
      .filter(x => x != 'x')
      .sort((a,b) => a[0] > b[0] ? -1 : 1)

  let step = 1
  let t = 1 //pairs[0][0] * step - pairs[0][1]

  for (let i = 0; i < pairs.length; i++) {
    const [busId, offset] = pairs[i]
    
    while ((t + offset) % busId !== 0) {
      t += step
    }
    step *= busId
  }

  return t
}

console.log("part1 example: ", part1(exampleInput))
console.log("part1: ", part1(input))

console.log("part2 example:", part2(exampleInput))
console.log("part2:", part2(input))
