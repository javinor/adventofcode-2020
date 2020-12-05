const fs = require('fs')
const path = require('path')

const lines = fs.readFileSync('./src/day04.input', 'utf8').split('\n')

const SEPARATOR = "SEPARATOR"
const ppField = {
  BIRTH_YEAR: 'byr',
  ISSUE_YEAR: 'iyr',
  EXPIRATION_YEAR: 'eyr',
  HEIGHT: 'hgt',
  HAIR_COLOR: 'hcl',
  EYE_COLOR: 'ecl',
  PASSPORT_ID: 'pid',
  COUNTRY_ID: 'cid'
}

const tokens = lines.flatMap(l => l === "" ? [SEPARATOR] : l.split(" "))

const {documents, current} = tokens.reduce((acc, token) => {
  const {documents, current} = acc;
  if (token === SEPARATOR) {
    documents.push(current)
    return {documents, current: {}}
  } else {
    const [field, value] = token.split(":")
    current[field] = value
    return {documents, current}
  }
}, {documents: [], current: {}})
const allPassports = [...documents, current]

const validPassportsPart1 = allPassports.filter(pp => {
  const fields = Object.values(ppField)
  return fields.every(field => !!pp[field] || field == ppField.COUNTRY_ID)
})

console.log({validPassportsPart1: validPassportsPart1.length})

const validPassportsPart2 = allPassports.filter(pp => {
  const fields = Object.values(ppField)
  return fields.every(field => {
    switch (field) {
      case ppField.COUNTRY_ID: return true
      case ppField.BIRTH_YEAR: {
        const value = parseInt(pp[field], 10)
        return value >= 1920 && value <= 2002
      }
      case ppField.ISSUE_YEAR: {
        const value = parseInt(pp[field], 10)
        return value >= 2010 && value <= 2020
      }
      case ppField.EXPIRATION_YEAR: {
        const value = parseInt(pp[field], 10)
        return value >= 2020 && value <= 2030
      }
      case ppField.EYE_COLOR: {
        return ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(pp[field])
      }
      case ppField.PASSPORT_ID: {
        return /^\d{9}$/.test(pp[field])
      }
      case ppField.HAIR_COLOR: {
        return /^#[0-9a-f]{6}$/.test(pp[field])
      }
      case ppField.HEIGHT: {
        if (!pp[field]) {
          return false
        }
        const value = parseInt(pp[field].slice(0, -2), 10)
        const unit = pp[field].slice(-2)
        if (unit == "cm") {
          return value >= 150 && value <= 193
        } else if (unit == "in") {
          return value >= 59 && value <= 76
        } else {
          return false
        }
      }
      default:
        throw new Error("unknown field", {field, pp})
    }
  })
})

console.log({validPassportsPart2: validPassportsPart2.length})
// [,min, max, char, pw]
// const parsedLines = lines.map(l => l.match(passwordRegex))

// const part1 = (parsedLines) => {
//   console.log("part1:\n======")
  
//   let total = 0
  
//   for (let line of parsedLines) {
//     const [,min, max, char, pw] = line
//     const count = pw.split('').filter(c => c == char).length
//     if (count >= min && count <= max) {
//       total += 1 
//     }
//   }
//   console.log({total})
//   console.log("")
// }

// const part2 = (parsedLines) => {
//   console.log("part2:\n======")
  
//   let total = 0
  
//   for (let line of parsedLines) {
//     const [,pos1, pos2, char, pw] = line
//     if (pw[pos1-1] == char ^ pw[pos2-1] == char) {
//       total += 1 
//     }
//   }
//   console.log({total})
//   console.log("")
// }


// part1(parsedLines)
// part2(parsedLines)