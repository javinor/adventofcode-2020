const { count } = require('console')
const fs = require('fs')
const _ = require('lodash')

const input = fs.readFileSync('./src/day12.input', 'utf8')

const exampleInput = `F10
N3
F7
R90
F11`

const parseInstructions = input => {
  const lines = input.split('\n')
  const regex = /^([NESWFRL])(\d+)$/

  return lines.map(l => {
    const [,dir,size] = l.match(regex)
    return [dir, parseInt(size, 10)]
  })
}

const turn = (current, direction, size) => {
  // we're turning right
  if (direction == 'L') {
    size = 360 - size
  }

  const directions = ['N', 'E', 'S', 'W']
  const index = directions.findIndex(d => d == current)
  const step = size / 90
  const newDirection = directions[(index + step) % 4]

  return newDirection
}

const moveInDirection = (north, east, direction, size) => {
  const state = {north, east}
  
  switch (direction) {
    case 'N': {
      state.north += size
      break;
    }
    case 'S': {
      state.north -= size
      break;
    }
    case 'E': {
      state.east += size
      break;
    }
    case 'W': {
      state.east -= size
      break;
    }
  }

  return state
}

const manhattenDist = ({north, east}) => Math.abs(north) + Math.abs(east)

const part1 = input => {
  const instructions = parseInstructions(input)

  const state = {north:0, east:0, direction:'E'}

  for (let i = 0; i < instructions.length; i++) {
    const inst = instructions[i]

    switch (inst[0]) {
      case 'N':
      case 'S':
      case 'E':
      case 'W': {
        const {north, east} = moveInDirection(state.north, state.east, inst[0], inst[1])
        state.north = north
        state.east = east
        break;
      }
      case 'R':
      case 'L': {
        state.direction = turn(state.direction, inst[0], inst[1])
        break;
      }
      case 'F': {
        const {north, east} = moveInDirection(state.north, state.east, state.direction, inst[1])
        state.north = north
        state.east = east
      }
    }
  }

  return state
}

const rotate = (north, east, direction, size) => {
  // we're turning counterclockwise
  if (direction == 'R') {
    size = 360 - size
  }

  let x = east
  let y = north

  for (let i = 0; i < size / 90; i++) {
    const [tempX, tempY] = [-y, x] // rotate 90 deg counter-clockwise
    x = tempX
    y = tempY
  }

  return {east: x, north: y}
}

const part2 = input => {
  const instructions = parseInstructions(input)

  const state = {north:0, east:0}
  const waypoint = {north: 1, east: 10}

  for (let i = 0; i < instructions.length; i++) {
    const inst = instructions[i]

    switch (inst[0]) {
      case 'N':
      case 'S':
      case 'E':
      case 'W': {
        const {north, east} = moveInDirection(waypoint.north, waypoint.east, inst[0], inst[1])
        waypoint.north = north
        waypoint.east = east
        break;
      }
      case 'R':
      case 'L': {
        const {north, east} = rotate(waypoint.north, waypoint.east, inst[0], inst[1])
        waypoint.north = north
        waypoint.east = east
        break;
      }
      case 'F': {
        state.north += waypoint.north * inst[1]
        state.east += waypoint.east * inst[1]
      }
    }
  }

  return state
}

console.log("part1 example: ", manhattenDist(part1(exampleInput)))
console.log("part1: ", manhattenDist(part1(input)))

console.log("part2 example: ", manhattenDist(part2(exampleInput)))
console.log("part2: ", manhattenDist(part2(input)))
