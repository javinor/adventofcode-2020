const fs = require('fs')
const _ = require('lodash')

const groupInputs = fs.readFileSync('./src/day06.input', 'utf8').split('\n\n')

// PART 1
const groupAnswersUnion = groupInputs.map(gi => gi.split("").filter(char => /[a-z]/.test(char))).map(gi => new Set(gi))

const anyAnswerCount = groupAnswersUnion.map(ga => ga.size).reduce((a,b) => a+b, 0)
console.log({anyAnswerCount})

///////////// PART 2
const groupAnswersIntersection = groupInputs.map(gi => gi.split('\n').map(str => str.split(""))).map(inputs => _.intersection(...inputs))

const allAnswerCount = groupAnswersIntersection.map(ga => ga.length).reduce((a,b) => a+b, 0)
console.log({allAnswerCount})
