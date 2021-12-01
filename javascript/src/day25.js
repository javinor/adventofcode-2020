const _ = require('lodash')

const input = [
  12090988,
  240583
]

const exampleInput = [
  5764801,
  17807724
]

const transformToTarget = (subjectNumber, target) => {
  let loopSize = 0
  let value = 1

  while (value !== target) {
    value = (value * subjectNumber) % 20201227
    loopSize += 1
  }

  return loopSize
}

const transformLoop = (subjectNumber, loopSize) => {
  value = 1
  
  for (let i = 0; i < loopSize; i++) {
    value = (value * subjectNumber) % 20201227
  }

  return value
}

const part1 = ([cardPubKey, doorPubKey]) => {
  const cardLoopSize = transformToTarget(7, cardPubKey)
  const doorLoopSize = transformToTarget(7, doorPubKey)

  const encryptionKey1 = transformLoop(doorPubKey, cardLoopSize)
  const encryptionKey2 = transformLoop(cardPubKey, doorLoopSize)

  console.log({cardPubKey, doorPubKey, cardLoopSize, doorLoopSize, encryptionKey1, encryptionKey2})
}

console.log("part1 example:", part1(exampleInput))
console.log("part1:", part1(input))
