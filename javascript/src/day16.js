const fs = require('fs')
const _ = require('lodash')

const input = fs.readFileSync('./src/day16.input', 'utf8')

const exampleInput = `class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`

const exampleInput2 = `class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9`

const parseInput = input => {
  const [_fields, _myTicket, _nearbyTickets] = input.split('\n\n')

  const fields = _fields
    .split('\n')
    .map(line => {
      const [fieldName, _range1, _range2] = line.split(/: | or /)
      const [min1, max1] = _range1.split('-').map(n => parseInt(n, 10))
      const [min2, max2] = _range2.split('-').map(n => parseInt(n, 10))
      return {fieldName, min1, max1, min2, max2}
    })

  const parseTickets = ticketsInput => 
    ticketsInput
      .split('\n')
      .slice(1)
      .map(
        line => 
          line
            .split(',')
            .map(n => parseInt(n, 10))
      )

  const myTicket = parseTickets(_myTicket)[0]
  
  const nearbyTickets = parseTickets(_nearbyTickets)

  return {fields, myTicket, nearbyTickets}
}

const valueCanBeOfField = (value, field) => {
  const {min1, max1, min2, max2} = field
  return _.inRange(value, min1, max1 + 1) || _.inRange(value, min2, max2 + 1)
}

const part1 = input => {
  const {fields, nearbyTickets} = parseInput(input)

  const invalidValues = nearbyTickets
    .flat()
    .filter(value => fields.every(f => !valueCanBeOfField(value, f)))

  return _.sum(invalidValues)
}

const findFieldPositions = (fields, validTickets) => {
  const fieldToPosition = new Map()
  
  while (fieldToPosition.size < fields.length) {
    fields
      .filter(f => !fieldToPosition.has(f.fieldName))
      .forEach(f => {
        const assignedPositions = [...fieldToPosition.values()]
        const possiblePositions = 
          _.range(0, validTickets.length)
            .filter(i => validTickets.every(
              ticket => valueCanBeOfField(ticket[i], f)) && !assignedPositions.includes(i)
            )

        if (possiblePositions.length === 1) {
          fieldToPosition.set(f.fieldName, possiblePositions[0])
        }
      })
  }

  return fieldToPosition
}

const part2 = input => {
  const {fields, myTicket, nearbyTickets} = parseInput(input)

  const validTickets = 
    nearbyTickets.filter(
      ticket => ticket.every(
        value => fields.some(
          f => valueCanBeOfField(value, f)
        )
      )
    )

  const fieldToPosition = findFieldPositions(fields, validTickets)

  let result = 1

  fieldToPosition.forEach((pos, fieldName) => {
    if (fieldName.startsWith("departure")) {
      result *= myTicket[pos]
    }
  })

  return result  
}

console.log("part1 example:", part1(exampleInput))
console.log("part1:", part1(input))

console.log("part2:", part2(input))