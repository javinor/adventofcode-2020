const fs = require('fs')
const _ = require('lodash')

const input = fs.readFileSync('./src/day18.input', 'utf8')

const exampleInput = `1 + 2 * 3 + 4 * 5 + 6`

const exampleInputs = `2 * 3 + (4 * 5)
5 + (8 * 3 + 9 + 3 * 4 * 3)
5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))
((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`

const p10 = n => parseInt(n, 10)

const evalSimple = line => {
  const tokens = line.split(' ').map(x => /\d+/.test(x) ? p10(x) : x)
  
  while(tokens.length > 1){
    const val = tokens.shift()
    const op = tokens.shift()
    const val2 = tokens.shift()

    let newVal = (op === '+')
      ? p10(val) + p10(val2)
      : p10(val) * p10(val2)

    tokens.unshift(newVal)
  }

  return tokens[0]
}

const evalSimple2 = line => {
  const tokens = line.split(' ').map(x => /\d+/.test(x) ? p10(x) : x)
  
  while (tokens.includes('+')) {
    const index = tokens.findIndex(t => t == '+')
    const newVal = tokens[index - 1] + tokens[index + 1]
    tokens.splice(index - 1, 3, newVal)
  }

  return evalSimple(tokens.join(' '))
}


function eval(formula, evalSimple) {
  while (formula.includes('(')) {
    formula = formula.replace(/\(([^()]*)\)/g, (_, noParens) => evalSimple(noParens));
  }
  return evalSimple(formula);
}

const part1 = input => {
  const lines = input.split('\n')

  return _.sum(lines.map(l => eval(l, evalSimple)))
}

const part2 = input => {
  const lines = input.split('\n')

  return _.sum(lines.map(l => eval(l, evalSimple2)))
}


console.log("part1 example:", part1(exampleInput))
// console.log("part1 example:", part1(exampleInputs))
// exampleInputs.split('\n').forEach((input, i) => {
//   console.log(`part1 example ${i}:`, part1(input))
// })
console.log("part1:", part1(input))

console.log("part2 example:", part2(exampleInput))
console.log("part2:", part2(input))