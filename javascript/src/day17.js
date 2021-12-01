const _ = require('lodash')

const input = `#...#.#.
..#.#.##
..#..#..
.....###
...#.#.#
#.#.##..
#####...
.#.#.##.`

const exampleInput = `.#.
..#
###`

const ACTIVE = '#'
const INACTIVE = '.'

const encode = arr => arr.join(';')
const decode = (str) => str.split(';').map(n => parseInt(n, 10))

const tick = world => {
  const newWorld = new Set()
  const potentialCells = new Set()

  for (let cell of world) {
    const [x,y,z] = decode(cell)

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        for (let k = -1; k <= 1; k++) {
          potentialCells.add(encode([x+i, y+j, z+k]))
        }
      }
    }
  }

  for (let cell of potentialCells) {
    const [x,y,z] = decode(cell)

    const iAmActive = world.has(cell)

    let nNeighbours = 0
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        for (let k = -1; k <= 1; k++) {
          const notSelf = i !== 0 || j !== 0 || k !== 0
          if (notSelf && world.has(encode([x+i, y+j, z+k]))) {
              nNeighbours += 1
          }
        }
      }
    }

    if (iAmActive && _.inRange(nNeighbours, 2, 4)) {
      newWorld.add(cell)
    } else if (!iAmActive && nNeighbours === 3) {
      newWorld.add(cell)
    }
  }

  return newWorld
}

const part1 = input => {
  const world = new Set()
  const z0 = input.split('\n').map(l => l.split(''))
  z0.forEach((row, x) => {
    row.forEach((cell, y) => {
      if (cell == ACTIVE) {
        world.add(encode([x,y,0]))
      }
    })
  });

  let w = world
  for (let i = 0; i < 6; i++) {
    w = tick(w)
  }
  return w.size
}

const tick4d = world => {
  const newWorld = new Set()
  const potentialCells = new Set()

  for (let cell of world) {
    const [x,y,z,w] = decode(cell)

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        for (let k = -1; k <= 1; k++) {
          for (let l = -1; l <= 1; l++) {
            potentialCells.add(encode([x+i, y+j, z+k, w+l]))
          }
        }
      }
    }
  }

  for (let cell of potentialCells) {
    const [x,y,z,w] = decode(cell)

    const iAmActive = world.has(cell)

    let nNeighbours = 0
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        for (let k = -1; k <= 1; k++) {
          for (let l = -1; l <= 1; l++) {
            const notSelf = i !== 0 || j !== 0 || k !== 0 || l !== 0
            if (notSelf && world.has(encode([x+i, y+j, z+k, w+l]))) {
                nNeighbours += 1
            }
          }
        }
      }
    }

    if (iAmActive && _.inRange(nNeighbours, 2, 4)) {
      newWorld.add(cell)
    } else if (!iAmActive && nNeighbours === 3) {
      newWorld.add(cell)
    }
  }

  return newWorld
}

const part2 = input => {
  const world = new Set()
  const z0 = input.split('\n').map(l => l.split(''))
  z0.forEach((row, x) => {
    row.forEach((cell, y) => {
      if (cell == ACTIVE) {
        world.add(encode([x,y,0,0]))
      }
    })
  });

  let w = world
  for (let i = 0; i < 6; i++) {
    w = tick4d(w)
  }
  return w.size
}


console.log("part1 example:", part1(exampleInput))
console.log("part1:", part1(input))

console.log("part2 example:", part2(exampleInput))
console.log("part2:", part2(input))
