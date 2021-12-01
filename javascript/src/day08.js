const fs = require('fs')
const _ = require('lodash')

const lines = fs.readFileSync('./src/day08.input', 'utf8').split('\n')

const exampleLines = `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`.split('\n')

const parseLine = (line) => {
  const {groups} = line.match(/(?<op>acc|jmp|nop) (?<sign>[-|+])(?<num>\d+)/)
  return {op: groups.op, val: (groups.sign == '-' ? -1 : 1) * groups.num }
}

const runCode = instructions => {
  const executed = new Set()
  let accumulator = 0
  let instP = 0

  while (!executed.has(instP) && instP < instructions.length) {
    const inst = instructions[instP]
    executed.add(instP)
    switch (inst.op) {
      case "nop": {
        instP += 1
        break;
      }
      case "jmp": {
        instP += inst.val
        break;
      }
      case "acc": {
        accumulator += inst.val
        instP += 1
        break;
      }
      default:
        throw new Error("unknown op: " + JSON.stringify({inst, instP, accumulator, executed, instructions}))
    }
  }
  
  return {accumulator, instP}
}

const part1 = lines => runCode(lines.map(parseLine))

const part2 = lines => {
  const instructions = lines.map(parseLine)

  for (let i = 0; i < instructions.length; i++) {
    if (instructions[i].op !== "acc" ) {
      const oldOp = instructions[i].op
      const newOp = oldOp === "nop" ? "jmp" : "nop"
      
      // mutation alert
      instructions[i].op = newOp
      const {accumulator, instP} = runCode(instructions)
      console.log({accumulator, instP})
      // undo mutation
      instructions[i].op = oldOp
      if (instP == instructions.length) {
        return accumulator
      }

    }
  }
}

console.log("part1: ", part1(lines))
console.log("part2: ", part2(lines))
