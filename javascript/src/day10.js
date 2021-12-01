const fs = require('fs')
const _ = require('lodash')

const joltages = fs.readFileSync('./src/day10.input', 'utf8').split('\n').map(n => parseInt(n, 10))

const exampleJoltages1 = `16
10
15
5
1
11
7
19
6
12
4`.split('\n').map(n => parseInt(n, 10))

const exampleJoltages2 = `28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`.split('\n').map(n => parseInt(n, 10))



const findDiffs = (joltages) => {
  const deviceJoltage = _.max(joltages) + 3

  const sortedJoltages = [0, ..._.sortBy(joltages), deviceJoltage]
  const diffs = []

  for (let i = 1; i < sortedJoltages.length; i++) {
    diffs.push(sortedJoltages[i] - sortedJoltages[i - 1])
  }

  const counts = _.countBy(diffs)

  return counts[1] * counts[3]
}

const findCombinations = (joltages) => {
  const deviceJoltage = _.max(joltages) + 3
  const sortedJoltages = [0, ..._.sortBy(joltages), deviceJoltage]

  const calcPathsFrom = (index, joltages, numOfPaths) => {
    const joltage = joltages[index]
    // console.log({index, joltage, numOfPaths, joltages, })

    if (numOfPaths[joltage]) {
      return numOfPaths[joltage]
    }

    const potentialNextJoltages = joltages.slice(index + 1)
    const filtered = potentialNextJoltages.filter(j => j - joltage <= 3)
    const mapped = filtered.map(j => numOfPaths[j])
    const sum = _.sum(mapped)
    
    // console.log({potentialNextJoltages, filtered, mapped, sum})
    return sum
  }

  const numOfPaths = {[_.max(joltages)]: 1}

  for (let i = sortedJoltages.length - 2; i >= 0; i--) {
    const pathsFrom = calcPathsFrom(i, sortedJoltages, numOfPaths)
    numOfPaths[sortedJoltages[i]] = pathsFrom
  }

  return numOfPaths[0]
}

console.log("part1 example1: ", findDiffs(exampleJoltages1))
console.log("part1 example2: ", findDiffs(exampleJoltages2))
console.log("part1: ", findDiffs(joltages))

console.log("part2 example1:", findCombinations(exampleJoltages1))
console.log("part2 example2:", findCombinations(exampleJoltages2))
console.log("part2:", findCombinations(joltages))