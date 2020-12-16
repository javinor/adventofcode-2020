const _ = require('lodash')

const input = [18,8,0,5,4,1,20]

const exampleInput = [0,3,6]
const moreExampleInputs = [
  [1,3,2],
  [2,1,3],
  [1,2,3],
  [2,3,1],
  [3,2,1],
  [3,1,2]
]

const part1 = (startingNumbers, targetTurn) => {
  const turnsSpoken = startingNumbers.reduce((map, number, i) => {
    map.set(number, [i + 1])
    return map
  }, new Map())

  let number = _.last(startingNumbers)

  for (let turn = startingNumbers.length + 1; turn <= targetTurn; turn++) {
    const numberIsOld = turnsSpoken.has(number) && turnsSpoken.get(number).length > 1
    
    let newNumber = 0
    if (numberIsOld) {
      const [x, y] = turnsSpoken.get(number).slice(-2)
      newNumber = y - x
    }
    
    if (!turnsSpoken.has(newNumber)) {
      turnsSpoken.set(newNumber, [])
    }
    turnsSpoken.get(newNumber).push(turn)

    number = newNumber
  }

  for (let [num, turns] of turnsSpoken.entries()) {
    if (_.last(turns) == targetTurn){
      return num
    }
  }
}

console.log("part1 example:", part1(exampleInput, 10))
moreExampleInputs.forEach((input, i) => {
  console.log(`part1 example${i}:`, part1(input, 2020))
})
console.log("part1:", part1(input, 2020))

// console.log("part2 example:", part1(exampleInput, 30_000_000))
// moreExampleInputs.forEach((input, i) => {
//   console.log(`part2 example${i}:`, part1(input, 30_000_000))
// })

// >>>>>>>>>> takes ~10 seconds to run 
console.log("part2:", part1(input, 30_000_000))

