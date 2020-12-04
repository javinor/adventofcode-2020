const { count } = require('console')
const { SSL_OP_COOKIE_EXCHANGE } = require('constants')
const fs = require('fs')
const path = require('path')

const lines = fs.readFileSync('./src/day03.input', 'utf8').split('\n')
const slope = lines.map(l => l.split(''))

const TREE = '#'
const OPEN = '.'

const countTrees = (slope, dRow, dCol) => {
  const width = slope[0].length

  let treeCount = 0
  const location = {row:0, col:0}

  while (location.row < slope.length - 1) {
    location.row += dRow
    location.col = (location.col + dCol) % width

    if (slope[location.row][location.col] === TREE) {
      treeCount += 1
    }
  }

  return treeCount
}

const part1 = (slope) => {
  console.log("part1:\n======")
  
  const treeCount = countTrees(slope, 1, 3)

  console.log({treeCount})
  console.log("")
}

const part2 = (slope) => {
  console.log("part2:\n======")
  
  const deltas = [
    {dRow: 1, dCol: 1},
    {dRow: 1, dCol: 3},
    {dRow: 1, dCol: 5},
    {dRow: 1, dCol: 7},
    {dRow: 2, dCol: 1},
  ]
  
  let total = 1
  
  for (let d of deltas) {
    const {dRow, dCol} = d
    total *= countTrees(slope, dRow, dCol)
  }

  console.log({total})
  console.log("")
}


part1(slope)
part2(slope)