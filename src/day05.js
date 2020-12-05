const fs = require('fs')
const path = require('path')
const { createSecureContext } = require('tls')

const lines = fs.readFileSync('./src/day05.input', 'utf8').split('\n')

const FRONT = "F"
const BACK = "B"
const LEFT = "L"
const RIGHT = "R"

const reverseBinary = (partitioning, left, right) => {
  const go = (partitioning, min, max) => {
    // console.log({partitioning, min, max})
    if (partitioning.length === 0) {
      return min
    } 
    const delta = max - min
    
    switch (partitioning[0]) {
      case left:
        return go(partitioning.slice(1), min, Math.floor(max - delta / 2))
      case right:
        return go(partitioning.slice(1), Math.ceil(min + delta / 2), max)
      default:
        throw new Error("unknown partitioning:", {partitioning, left, right})
    }
  }

  const max = 2 ** partitioning.length - 1

  return go(partitioning, 0, max, Math.floor(max / 2))
}

const decode = (input) => {
  const frontBackInput = input.slice(0, 7)
  const leftRightInput = input.slice(7)

  const row = reverseBinary(frontBackInput, FRONT, BACK)
  const col = reverseBinary(leftRightInput, LEFT, RIGHT)
  const seatId = row * 8 + col

  return {row, col, seatId}
}

/////////////////////////////// TESTS 
const tests = [
  {
    // Example input
    input: "FBFBBFFRLR",
    row: 44,
    col: 5,
    seatId: 357
  },
  {
    input: "BFFFBBFRRR",
    row: 70, 
    col: 7, 
    seatId: 567
  },
  {
    input: "FFFBBBFRRR",
    row: 14, col: 7, 
    seatId: 119
  },
  {
    input: "BBFFBBFRLL",
    row: 102, col: 4, 
    seatId: 820
  }
]

tests.forEach(({input, ...expected}, i) => {
  const actual = decode(input)
  if (expected.seatId === actual.seatId) {
    console.log(`test ${i} passed. input: ${input}`)
  } else {
    console.log(`test ${i} failed:`, {actual, expected})
  }
})

const part1 = lines.map(decode).map(({seatId}) => seatId).reduce((a,b) => Math.max(a,b), 0)
console.log({part1})

const allSeatIds = []
for (let i = 0; i<128; i++) {
  for (let j = 0; j<8; j++) {
    allSeatIds.push(8 * i + j)
  }
}

const listedSeatIds = new Set(lines.map(decode).map(({seatId})=>seatId))

const missingSeatIds = allSeatIds.filter(id => !listedSeatIds.has(id))

const part2 = missingSeatIds.filter(id => listedSeatIds.has(id + 1) && listedSeatIds.has(id - 1))
console.log({part2})