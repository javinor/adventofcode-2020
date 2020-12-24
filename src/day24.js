const fs = require('fs')
const _ = require('lodash')

const input = fs.readFileSync('./src/day24.input', 'utf8')

const exampleInput = `sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew`


const parseInput = input => {
  const lines = input.split('\n')
  const r = /e|se|sw|w|nw|ne/g
  const instructions = lines.map(l => l.match(r))
  return instructions
}

const en = arr => arr.join(';')
const de = str => str.split(';').map(n => parseInt(n, 10))

const getBlackTiles = input => {
  const instructions = parseInput(input)
  
  /**
   * coords:
   * y
   *  \
   *   \
   * ---\----> x
   *     \
   *      \
   */
  const blackTiles = new Set()

  for (const line of instructions) {
    let coord = {x: 0, y:0}
    
    for (const inst of line) {
      switch (inst) {
        case "e": {
          coord.x += 1
          break
        }
        case "se": {
          coord.y -= 1
          break
        }
        case "sw": {
          coord.x -= 1
          coord.y -= 1
          break
        }
        case "w": {
          coord.x -= 1
          break
        }
        case "nw": {
          coord.y += 1
          break
        }
        case "ne": {
          coord.x += 1
          coord.y += 1
          break
        }
        default: {
          throw new Error("unknown instruction:", {inst, line})
        }
      }
    }

    const {x,y} = coord
    const xy = en([x,y])
    if (blackTiles.has(xy)) {
      blackTiles.delete(xy)
    } else {
      blackTiles.add(xy)
    }
  }

  return blackTiles
}

const part1 = input => {
  const blackTiles = getBlackTiles(input)

  return blackTiles.size
}

const neighbours = ([x,y]) => [
  [ x+1, y   ],
  [ x-1, y   ],
  [ x  , y+1 ],
  [ x  , y-1 ],
  [ x+1, y+1 ],
  [ x-1, y-1 ],
]
const tick = blackTiles => {
  /**
   * coords:
   * y
   *  \
   *   \
   * ---\----> x
   *     \
   *      \
   */
  const newBlackTiles = new Set()
  const potentialTiles = new Set()

  for (let bTile of blackTiles) {
    const [x,y] = de(bTile)
    const ns = neighbours([x,y])
    
    potentialTiles.add(en([ x  , y   ]))
    for (const n of ns) {
      potentialTiles.add(en(n))  
    }
  }

  for (let tile of potentialTiles) {
    const [x,y] = de(tile)

    const iAmBlack = blackTiles.has(tile)
    const nNeighbours = neighbours([x,y]).reduce((count, [x,y]) => {
      return blackTiles.has(en([x,y])) 
        ? count + 1 
        : count
    }, 0)
    
    if (!iAmBlack && nNeighbours === 2) {
      newBlackTiles.add(tile)
    }
    if (iAmBlack && (nNeighbours == 1 || nNeighbours == 2)) {
      newBlackTiles.add(tile)
    }
  }

  return newBlackTiles
}


const part2 = input => {
  const TURNS = 100
  const initialBlackTiles = getBlackTiles(input)

  let blackTiles = initialBlackTiles
  for (let i = 0; i < TURNS; i++) {
    blackTiles = tick(blackTiles) 
  }

  return blackTiles.size
}

console.log("part1 example:", part1(exampleInput))
console.log("part1:", part1(input))

console.log("part2 example:", part2(exampleInput))
console.log("part2:", part2(input))






