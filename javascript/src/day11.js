const fs = require('fs')
const _ = require('lodash')

const input = fs.readFileSync('./src/day11.input', 'utf8')

const exampleInput = `L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`

const FLOOR = '.'
const EMPTY = 'L'
const OCCUPIED = '#'

const layout = input => 
  input
    .split('\n')
    .map(row => row.split(''))

const countOccupiedNeighbors = (layout, row, col) => {
  let nOccupied = 0

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const r = row + i
      const c = col + j
      const isNeighbor = i !== 0 || j !== 0

      if (_.inRange(r, layout.length) && _.inRange(c, layout[0].length) && isNeighbor) {
        nOccupied += layout[r][c] == OCCUPIED
      }
    }
  }

  return nOccupied
}

const countOccupiedNeighbors2 = (layout, row, col) => {
  let nOccupied = 0

  for (let deltaR = -1; deltaR <= 1; deltaR++) {
    for (let deltaC = -1; deltaC <= 1; deltaC++) {
      if (deltaR !== 0 || deltaC !== 0) {
        let r = row + deltaR
        let c = col + deltaC

        while (_.inRange(r, layout.length) && _.inRange(c, layout[0].length) && layout[r][c] == FLOOR) {
          r += deltaR
          c += deltaC
        }

        if (_.inRange(r, layout.length) && _.inRange(c, layout[0].length) && layout[r][c] == OCCUPIED) {
          nOccupied += 1
        } 
      }
    }
  }

  return nOccupied
}

const tick = (layout, countOccupiedNeighbors, occupiedThreshold) => {
  let layoutChanged = false
  const newLayout = layout.map((row, i) => row.map((cell, j) => {
    const nOccupied = countOccupiedNeighbors(layout, i, j)

    switch (cell) {
      case FLOOR: return FLOOR;
      case EMPTY: {
        if (nOccupied == 0) {
          layoutChanged = true
          return OCCUPIED
        } else {
          return EMPTY
        }
      }
      case OCCUPIED: {if (nOccupied >= occupiedThreshold) {
        layoutChanged = true 
        return EMPTY
      } else {
        return OCCUPIED
      }}
      default:
        throw new Error(`TICK: unknown cell ${cell} ${i} ${j}`)
    }
  }))


  return [newLayout, layoutChanged]
}

const printLayout = layout => {
  const str = layout.map(row => row.join('')).join('\n')
  console.log(str)
  console.log()
}

const runUntilFixed = (layout, countOccupiedNeighbors, occupiedThreshold) => {
  let l = layout
  let done = false
  
  while(!done) {
    const [nextLayout, hasChanged] = tick(l, countOccupiedNeighbors, occupiedThreshold)
    l = nextLayout
    done = !hasChanged
  }
  
  return l
}

const countOccupied = layout => {
  const count = _.countBy(layout.flat(), _.identity)
  return count[OCCUPIED]
}

const part1 = input => {
  const l = layout(input)
  const finalLayout = runUntilFixed(l, countOccupiedNeighbors, 4)
  const nOccupied = countOccupied(finalLayout)
  return nOccupied
}

const part2 = input => {
  const l = layout(input)
  const finalLayout = runUntilFixed(l, countOccupiedNeighbors2, 5)
  const nOccupied = countOccupied(finalLayout)
  return nOccupied
}

// console.log("part1 example: ", part1(exampleInput))
// console.log("part1: ", part1(input))

console.log("part2 example: ", part2(exampleInput))
console.log("part2: ", part2(input))
