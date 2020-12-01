const fs = require('fs')
const path = require('path')

const lines = fs.readFileSync('./src/day01.input', 'utf8').split('\n')

const nums = lines.map(l => parseInt(l, 10))

const part1 = (nums) => {
  console.log("part1:\n======")
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      const n = nums[i]
      const m = nums[j]
      if (n + m === 2020) {
        console.log(`found two numbers that sum to 2020: ${n} ${m}`)
        console.log(`their product is ${n*m}`)
        break;
      }
    }  
  }
  console.log("")
}

const part2 = (nums) => {
  console.log("part2:\n======")
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      for (let k = j + 1; k < nums.length; k++) {
        const n = nums[i]
        const m = nums[j]
        const p = nums[k]
        if (n + m + p === 2020) {
          console.log(`found three numbers that sum to 2020: ${n} ${m} ${p}`)
          console.log(`their product is ${n*m*p}`)
          break;
        }
      }
    }  
  }  
  console.log("")
}


part1(nums)
part2(nums)