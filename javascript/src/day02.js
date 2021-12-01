const fs = require('fs')
const path = require('path')

const lines = fs.readFileSync('./src/day02.input', 'utf8').split('\n')
const passwordRegex = /([0-9]+)-([0-9]+) ([a-z]): ([a-z]+)/

// [,min, max, char, pw]
const parsedLines = lines.map(l => l.match(passwordRegex))

const part1 = (parsedLines) => {
  console.log("part1:\n======")
  
  let total = 0
  
  for (let line of parsedLines) {
    const [,min, max, char, pw] = line
    const count = pw.split('').filter(c => c == char).length
    if (count >= min && count <= max) {
      total += 1 
    }
  }
  console.log({total})
  console.log("")
}

const part2 = (parsedLines) => {
  console.log("part2:\n======")
  
  let total = 0
  
  for (let line of parsedLines) {
    const [,pos1, pos2, char, pw] = line
    if (pw[pos1-1] == char ^ pw[pos2-1] == char) {
      total += 1 
    }
  }
  console.log({total})
  console.log("")
}


part1(parsedLines)
part2(parsedLines)