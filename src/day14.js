const fs = require('fs')
const _ = require('lodash')

const input = fs.readFileSync('./src/day14.input', 'utf8')

const exampleInput = `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`

const exampleInput2 = `mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`

const parseLine = line => {
  if (line.startsWith("mask")) {
    const mask = line.slice(7).split("")
    const maskAnd = mask.map(bit => bit == "0" ? "0" : "1")
    const maskOr = mask.map(bit => bit == "1" ? "1" : "0")

    return {
      type: "mask",
      mask,
      maskAnd,
      maskOr
    }
  } else {
    const [fst, snd] = line.slice(4).split("] = ")
    const addr = parseInt(fst, 10)
    const value = parseInt(snd, 10)

    return {
      type: "mem",
      addr,
      value
    }
  }
}

const maskValue = (value, maskAnd, maskOr) => {
  const strValue = value.toString(2)
  const bits = _.padStart(strValue, 36, "0").split("")
  for (let i = 0; i < 36; i++) {
    const bit = parseInt(bits[i])
    const and = parseInt(maskAnd[i])
    const or = parseInt(maskOr[i])


    bits[i] = ((bit & and) | or).toString()
  }

  return parseInt(bits.join(""), 2)
}

const part1 = input => {
  const lines = input.split('\n')

  let maskAnd = _.repeat("1", 36)
  let maskOr = _.repeat("0", 36)
  const mem = {}

  for (let l of lines) {
    const op = parseLine(l)

    switch (op.type) {
      case "mask": {
        maskAnd = op.maskAnd
        maskOr = op.maskOr
        break;
      }
      case "mem": {
        const {addr, value} = op
        const maskedValue = maskValue(value, maskAnd, maskOr)
        mem[addr] = maskedValue
        break;
      }
    }
  }

  return _.sum(_.values(mem))
}

// ------------------------
const maskAddr = (addr, mask) => {
  const strAddr = addr.toString(2)
  const bits = _.padStart(strAddr, 36, "0").split("")

  for (let i = 0; i < 36; i++) {
    switch (mask[i]) {
      case "0": {
        break;
      }
      case "X":
      case "1": {
        bits[i] = mask[i]
        break;
      }
    }
  }

  return bits
}

const setMemAtAddrBits = (mem, addrBits, value) => {
  const go = (bits, index) => {
    if (index >= bits.length) {
      const addr = bits.join("").toString(2)
      mem[addr] = value
    } else if (bits[index] != "X") {
      go(bits, index + 1)
    } else {
      bits[index] = "0"
      go(bits, index + 1)
      bits[index] = "1"
      go(bits, index + 1)
      bits[index] = "X"
    }
  }

  go(addrBits, 0)
}


const part2 = input => {
  const lines = input.split('\n')

  let mask = ""
  const mem = {}

  for (let l of lines) {
    const op = parseLine(l)
    switch (op.type) {
      case "mask": {
        mask = op.mask
        break;
      }
      case "mem": {
        const {addr, value} = op
        const addrBits = maskAddr(addr, mask)
        setMemAtAddrBits(mem, addrBits, value)
        break;
      }
    }
  }

  return _.sum(_.values(mem))
}


console.log("part1 example: ", part1(exampleInput))
console.log("part1: ", part1(input))

console.log("part2 example: ", part2(exampleInput2))
console.log("part2: ", part2(input))
