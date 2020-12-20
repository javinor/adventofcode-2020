require=require("esm")(module);
const fs = require('fs')
const _ = require('lodash')

const input = fs.readFileSync('./src/day20.input', 'utf8')

const exampleInput = `Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...`

const parseInput = input => {
  const blocks = input.split('\n\n')
  const pairs = blocks.map(b => {
    const [fst, ...rows] = b.split('\n')
    const id = fst.slice(5, -1)
    return [id, rows.map(r => r.split(''))]
  })

  return new Map(pairs)
}

// FLIP L<->R
const ORIENTATIONS = ['ORG', 'CC', 'CC2', 'CC3', 'FLIP', 'FLIP-CC', 'FLIP-CC2', 'FLIP-CC3']

const flip = ([top, right, bottom, left]) => [top.reverse(), left, bottom.reverse(), right]
const cc = ([top, right, bottom, left]) => [right, bottom.reverse(), left, top.reverse()]

const getTileSides = (tile, orientation) => {
  const up = [...tile[0]]
  const right = tile.map(row => _.last(row)).flat()
  const down = [..._.last(tile)]
  const left = tile.map(row => row[0]).flat()

  const original = [up, right, down, left]

  switch (orientation) {
    case 'ORG': {
      return original
    }
    case 'CC': {
      return cc(original)
    }
    case 'CC2': {
      return cc(cc(original))
    }
    case 'CC3': {
      return cc(cc(cc(original)))
    }
    case 'FLIP': {
      return flip(original)
    }
    case 'FLIP-CC': {
      return cc(flip(original))
    }
    case 'FLIP-CC2': {
      return cc(cc(flip(original)))
    }
    case 'FLIP-CC3': {
      return cc(cc(cc(flip(original))))
    }
    default: {
      throw new Error("unknown orientation? " + orientation)
    }
  }
}

const divMod = (n, d) => {
  const numer = Math.floor(n / d)
  const denom = n % d
  return [numer, denom]
}

const getLegalOrientations = (tile, coord, placement) => {
  const [row, col] = coord

  if (row == 0 && col == 0) {
    return ORIENTATIONS
  }
  
  let legalOrientations = []
  
  for (let orientation of ORIENTATIONS) {
    let topLegal = row == 0
    let leftLegal = col == 0
    const sides = getTileSides(tile, orientation)

    if (row > 0) {
      const topTileBottom = placement[row - 1][col].sides[2]
      topLegal = _.isEqual(topTileBottom, sides[0])
    }
    if (col > 0) {
      const leftTileRight = placement[row][col - 1].sides[1]
      leftLegal = _.isEqual(leftTileRight, sides[3])
    }
    if (topLegal && leftLegal) {
      legalOrientations.push(orientation)
    }
  }

  return legalOrientations
}

const findLegalTilePlacement = (tiles) => {
  const size = Math.sqrt(tiles.size)
  
  const tileIds = [...tiles.keys()]
  const legalPlacement = Array(size).fill().map(() => Array(size).fill(null))
  const initialCoord = [0,0]

  const findPlacementRec = (coord, availableTileIds) => {
    if (availableTileIds.length == 0 || _.isEqual(coord, [size, 0])) {
      return true
    }

    const [row, col] = coord
    const newCoord = divMod(row * size + col + 1, size)

    for (let i = 0; i < availableTileIds.length; i++) {
      const tid = availableTileIds[i]
      const newAvailableTileIds = availableTileIds.filter(id => id !== tid)
      const tile = tiles.get(tid)
      const legalOrientations = getLegalOrientations(tile, coord, legalPlacement)

      for (let j = 0; j < legalOrientations.length; j++) {
        const orientation = legalOrientations[j]
        const sides = getTileSides(tile, orientation)
        
        legalPlacement[row][col] = {tid, sides, orientation}
        
        const placementFound = findPlacementRec(newCoord, newAvailableTileIds)

        if (placementFound) {
          return placementFound
        } else {
          legalPlacement[row][col] = null
        }
      }
    }
  }

  const placementFound = findPlacementRec(initialCoord, tileIds)

  if (placementFound) {
    return legalPlacement
  } else {
    throw new Error("no legal placement found!")
  }
}

const part1 = input => {
  const tiles = parseInput(input)
  const placement = findLegalTilePlacement(tiles)
  const result = [placement[0][0], _.last(placement[0]), _.last(placement)[0], _.last(_.last(placement))]
    .map(x => parseInt(x.tid,10))
    .reduce((x,y) => x * y, 1)
    
  // console.log(placement.map(row => row.map(({tid, orientation}) => ({tid, orientation}))))

  return result
}

const EXAMPLE_SOLUTION_PART1 = [
  [
    { tid: '1951', orientation: 'CC3' },
    { tid: '2729', orientation: 'CC3' },
    { tid: '2971', orientation: 'CC3' }
  ],
  [
    { tid: '2311', orientation: 'CC3' },
    { tid: '1427', orientation: 'CC3' },
    { tid: '1489', orientation: 'CC3' }
  ],
  [
    { tid: '3079', orientation: 'FLIP-CC' },
    { tid: '2473', orientation: 'CC2' },
    { tid: '1171', orientation: 'CC' }
  ]
]

const SOLUTION_PART1 = [
  [
    { tid: '1117', orientation: 'CC2' },
    { tid: '2003', orientation: 'CC3' },
    { tid: '3517', orientation: 'FLIP-CC2' },
    { tid: '1187', orientation: 'FLIP-CC3' },
    { tid: '3181', orientation: 'CC3' },
    { tid: '2729', orientation: 'CC2' },
    { tid: '3217', orientation: 'FLIP' },
    { tid: '3001', orientation: 'ORG' },
    { tid: '1663', orientation: 'ORG' },
    { tid: '1429', orientation: 'FLIP-CC' },
    { tid: '1871', orientation: 'CC2' },
    { tid: '1543', orientation: 'CC3' }
  ],
  [
    { tid: '1559', orientation: 'CC3' },
    { tid: '1327', orientation: 'FLIP-CC3' },
    { tid: '1361', orientation: 'FLIP' },
    { tid: '3457', orientation: 'CC3' },
    { tid: '3697', orientation: 'FLIP-CC2' },
    { tid: '1879', orientation: 'FLIP-CC' },
    { tid: '1721', orientation: 'FLIP-CC2' },
    { tid: '3041', orientation: 'CC2' },
    { tid: '2039', orientation: 'CC2' },
    { tid: '2351', orientation: 'CC3' },
    { tid: '2621', orientation: 'ORG' },
    { tid: '2707', orientation: 'FLIP-CC2' }
  ],
  [
    { tid: '2617', orientation: 'FLIP-CC3' },
    { tid: '2467', orientation: 'FLIP-CC' },
    { tid: '2857', orientation: 'ORG' },
    { tid: '1993', orientation: 'CC2' },
    { tid: '2671', orientation: 'FLIP-CC' },
    { tid: '2161', orientation: 'FLIP-CC' },
    { tid: '1439', orientation: 'FLIP' },
    { tid: '3803', orientation: 'FLIP' },
    { tid: '3371', orientation: 'FLIP-CC3' },
    { tid: '1949', orientation: 'FLIP-CC2' },
    { tid: '3413', orientation: 'FLIP-CC3' },
    { tid: '3467', orientation: 'FLIP-CC3' }
  ],
  [
    { tid: '3323', orientation: 'FLIP' },
    { tid: '3391', orientation: 'FLIP-CC' },
    { tid: '2719', orientation: 'FLIP-CC2' },
    { tid: '2441', orientation: 'FLIP-CC' },
    { tid: '2833', orientation: 'FLIP-CC3' },
    { tid: '3929', orientation: 'FLIP-CC2' },
    { tid: '2953', orientation: 'ORG' },
    { tid: '1861', orientation: 'CC2' },
    { tid: '3557', orientation: 'CC2' },
    { tid: '3617', orientation: 'ORG' },
    { tid: '3067', orientation: 'CC2' },
    { tid: '2053', orientation: 'CC3' }
  ],
  [
    { tid: '1531', orientation: 'FLIP-CC' },
    { tid: '1889', orientation: 'FLIP-CC2' },
    { tid: '3967', orientation: 'FLIP-CC' },
    { tid: '2087', orientation: 'FLIP' },
    { tid: '1657', orientation: 'CC3' },
    { tid: '2333', orientation: 'FLIP-CC' },
    { tid: '2417', orientation: 'CC3' },
    { tid: '2687', orientation: 'FLIP-CC3' },
    { tid: '2609', orientation: 'FLIP-CC3' },
    { tid: '1867', orientation: 'CC2' },
    { tid: '1237', orientation: 'FLIP-CC2' },
    { tid: '2099', orientation: 'FLIP-CC2' }
  ],
  [
    { tid: '2861', orientation: 'FLIP' },
    { tid: '1019', orientation: 'CC2' },
    { tid: '3677', orientation: 'CC3' },
    { tid: '1129', orientation: 'CC2' },
    { tid: '1249', orientation: 'ORG' },
    { tid: '3727', orientation: 'FLIP' },
    { tid: '1319', orientation: 'FLIP-CC' },
    { tid: '1619', orientation: 'CC2' },
    { tid: '1489', orientation: 'FLIP' },
    { tid: '1231', orientation: 'FLIP-CC3' },
    { tid: '1609', orientation: 'CC2' },
    { tid: '2269', orientation: 'CC3' }
  ],
  [
    { tid: '2797', orientation: 'FLIP' },
    { tid: '2423', orientation: 'FLIP' },
    { tid: '2549', orientation: 'FLIP' },
    { tid: '1321', orientation: 'FLIP-CC' },
    { tid: '3637', orientation: 'FLIP-CC3' },
    { tid: '1109', orientation: 'FLIP' },
    { tid: '1831', orientation: 'FLIP-CC2' },
    { tid: '2143', orientation: 'FLIP-CC2' },
    { tid: '3533', orientation: 'CC3' },
    { tid: '1093', orientation: 'FLIP-CC3' },
    { tid: '2399', orientation: 'FLIP-CC3' },
    { tid: '3221', orientation: 'ORG' }
  ],
  [
    { tid: '3673', orientation: 'CC3' },
    { tid: '1279', orientation: 'FLIP-CC' },
    { tid: '2381', orientation: 'ORG' },
    { tid: '2081', orientation: 'FLIP-CC' },
    { tid: '3121', orientation: 'CC2' },
    { tid: '3011', orientation: 'ORG' },
    { tid: '2309', orientation: 'FLIP' },
    { tid: '1901', orientation: 'FLIP-CC' },
    { tid: '1933', orientation: 'FLIP-CC3' },
    { tid: '2957', orientation: 'FLIP-CC' },
    { tid: '1583', orientation: 'FLIP-CC2' },
    { tid: '2663', orientation: 'ORG' }
  ],
  [
    { tid: '2203', orientation: 'CC2' },
    { tid: '2251', orientation: 'FLIP-CC2' },
    { tid: '1907', orientation: 'FLIP-CC3' },
    { tid: '3257', orientation: 'FLIP-CC3' },
    { tid: '3301', orientation: 'FLIP-CC' },
    { tid: '2341', orientation: 'FLIP-CC3' },
    { tid: '3343', orientation: 'CC2' },
    { tid: '1637', orientation: 'FLIP' },
    { tid: '3347', orientation: 'CC3' },
    { tid: '1847', orientation: 'ORG' },
    { tid: '2791', orientation: 'FLIP' },
    { tid: '1021', orientation: 'CC2' }
  ],
  [
    { tid: '3931', orientation: 'ORG' },
    { tid: '3049', orientation: 'ORG' },
    { tid: '1787', orientation: 'FLIP-CC3' },
    { tid: '1571', orientation: 'ORG' },
    { tid: '3271', orientation: 'ORG' },
    { tid: '3779', orientation: 'FLIP' },
    { tid: '2237', orientation: 'ORG' },
    { tid: '3877', orientation: 'CC3' },
    { tid: '3163', orientation: 'FLIP-CC' },
    { tid: '2393', orientation: 'FLIP' },
    { tid: '2887', orientation: 'FLIP-CC3' },
    { tid: '1973', orientation: 'CC3' }
  ],
  [
    { tid: '2657', orientation: 'CC2' },
    { tid: '1153', orientation: 'FLIP-CC2' },
    { tid: '2699', orientation: 'CC3' },
    { tid: '3529', orientation: 'FLIP-CC' },
    { tid: '2027', orientation: 'FLIP' },
    { tid: '1741', orientation: 'ORG' },
    { tid: '1931', orientation: 'FLIP-CC2' },
    { tid: '3541', orientation: 'CC3' },
    { tid: '3229', orientation: 'ORG' },
    { tid: '1747', orientation: 'FLIP-CC' },
    { tid: '1499', orientation: 'FLIP-CC' },
    { tid: '1297', orientation: 'FLIP-CC' }
  ],
  [
    { tid: '1291', orientation: 'FLIP-CC2' },
    { tid: '1009', orientation: 'CC3' },
    { tid: '2389', orientation: 'CC2' },
    { tid: '3671', orientation: 'FLIP-CC' },
    { tid: '1627', orientation: 'CC3' },
    { tid: '3137', orientation: 'ORG' },
    { tid: '1601', orientation: 'FLIP-CC3' },
    { tid: '2803', orientation: 'CC2' },
    { tid: '1621', orientation: 'CC3' },
    { tid: '1039', orientation: 'FLIP-CC' },
    { tid: '3373', orientation: 'CC3' },
    { tid: '1213', orientation: 'CC3' }
  ]
]

const TILE_SIZE = 8

// const printArr2d = arr2d => console.log(arr2d.map(row => row.join('')).join('\n'))

const ccArr2d = arr => {
  const size = arr.length
  const rotated = Array(size).fill().map(() => Array(size).fill(null))

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      rotated[size - 1 - col][row] = arr[row][col]
    }
  }

  return rotated
}

const flipLeftRightArr2d = arr => {
  const size = arr.length
  const flipped = Array(size).fill().map(() => Array(size).fill(null))

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      flipped[row][size - 1 - col] = arr[row][col]
    }
  }

  return flipped
}

const generateTrimmedImage = (input, solutionPart1) => {
  const tiles = parseInput(input)

  for (const [, tile] of tiles) {
    tile.shift()
    tile.pop()
    tile.forEach(row => {
      row.shift()
      row.pop()
    })
  }

  for (let i = 0; i < solutionPart1.length; i++) {
    for (let j = 0; j < solutionPart1[0].length; j++) {
      const {tid, orientation} = solutionPart1[i][j]
      
      const original = tiles.get(tid)
      const cc = ccArr2d
      const flip = flipLeftRightArr2d
      
      let newTile

      switch (orientation) {
        case 'ORG': {
          newTile = original
          break;
        }
        case 'CC': {
          newTile = cc(original)
          break;
        }
        case 'CC2': {
          newTile = cc(cc(original))
          break;
        }
        case 'CC3': {
          newTile = cc(cc(cc(original)))
          break;
        }
        case 'FLIP': {
          newTile = flip(original)
          break;
        }
        case 'FLIP-CC': {
          newTile = cc(flip(original))
          break;
        }
        case 'FLIP-CC2': {
          newTile = cc(cc(flip(original)))
          break;
        }
        case 'FLIP-CC3': {
          newTile = cc(cc(cc(flip(original))))
          break;
        }
        default: {
          throw new Error("unknown orientation? " + orientation)
        }
      }

      tiles.set(tid, newTile)
    }
  }

  const trimmedImage = []

  for (let y = 0; y < solutionPart1.length; y++) {
    for (let z = 0; z < TILE_SIZE; z++) {
      trimmedImage.push([])
    }

    for (let x = 0; x < solutionPart1[0].length; x++) {
      const tileId = solutionPart1[y][x].tid
      const tile = tiles.get(tileId)

      const rowStart = y * TILE_SIZE
      const colStart = x * TILE_SIZE

      for (let row = 0; row < tile.length; row++) {
        for (let col = 0; col < tile[0].length; col++) {
          trimmedImage[rowStart + row][colStart + col] = tile[row][col]
        }
      }
    }
  }

  return trimmedImage
}

const seaMonster = `                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `.split('\n').map(row => row.split(''))

const orientImage = (image, orientation) => {
  const cc = ccArr2d
  const flip = flipLeftRightArr2d
      
  switch (orientation) {
    case 'ORG': {
      return image
    }
    case 'CC': {
      return cc(image)
    }
    case 'CC2': {
      return cc(cc(image))
    }
    case 'CC3': {
      return cc(cc(cc(image)))
    }
    case 'FLIP': {
      return flip(image)
    }
    case 'FLIP-CC': {
      return cc(flip(image))
    }
    case 'FLIP-CC2': {
      return cc(cc(flip(image)))
    }
    case 'FLIP-CC3': {
      return cc(cc(cc(flip(image))))
    }
    default: {
      throw new Error("unknown orientation? " + orientation)
    }
  }
}

const markAndCountMonsters = image => {
  let count = 0

  for (let row = 0 ; row + seaMonster.length < image.length; row++) {
    for (let col = 0 ; col + seaMonster[0].length < image[0].length; col++) {
      let eurika = true

      for (let y = 0; y < seaMonster.length; y++) {
        for (let x = 0; x < seaMonster[0].length; x++) {
          if (seaMonster[y][x] == '#' && image[row + y][col + x] !== '#') {
            eurika = false
          }
        }
      }

      if (eurika) {
        count += 1

        for (let y = 0; y < seaMonster.length; y++) {
          for (let x = 0; x < seaMonster[0].length; x++) {
            if (seaMonster[y][x] == '#') {
              image[row + y][col + x] = 'O'
            }
          }
        }
      }
    }
  }

  return count
}

const part2 = (input, solutionPart1) => {
  const image = generateTrimmedImage(input, solutionPart1)
  
  let roughness

  // find sea monster
  for (const orientation of ORIENTATIONS) {
    const _image = orientImage(image, orientation)

    const num = markAndCountMonsters(_image)

    if (num > 0) {
      // printArr2d(_image)
      let count = 0
      for (let y = 0; y < _image.length; y++) {
        for (let x = 0; x < _image[0].length; x++) {
          if (_image[y][x] == '#') {
            count += 1
          }
        }
      }

      if (count > 0) {
        roughness = count
      }
    }
  }

  return roughness
}

console.log("part1 example:", part1(exampleInput))
console.log("part1:", part1(input))

console.log("part2 example:", part2(exampleInput, EXAMPLE_SOLUTION_PART1))
console.log("part2:", part2(input, SOLUTION_PART1))


