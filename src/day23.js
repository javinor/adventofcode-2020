const _ = require('lodash')

const input = `327465189`

const exampleInput = `389125467`

const solveNaive = (input, turns) => {
  const cups = input.split('').map(n => parseInt(n, 10))
  let currentCup = {label: cups[0], index: 0}

  for (let i = 0; i < turns; i++) {
    // console.log(`\n\n-- move ${i + 1} --`)
    // console.log('cups:', cups.map(x => x == currentCup.label ? `(${x})` : x).join(' '))
    const pickup = []

    for (let j = 0; j < 3; j++) {
      const currentCupIndex = cups.findIndex(x => x == currentCup.label)
      const pickupIndex = (currentCupIndex + 1) % cups.length
      const [cup] = cups.splice(pickupIndex, 1)
      pickup.push(cup)
    }

    // console.log("pick up:", pickup)

    const minLabel = _.min(cups)
    const destinationCupLabel = currentCup.label <= minLabel
      ? _.max(cups)
      : _.max(cups.filter(c => c < currentCup.label))
    const destinationCup = {
      label: destinationCupLabel,
      index: cups.findIndex(x => x == destinationCupLabel)
    }

    // console.log("destination:", destinationCupLabel)

    cups.splice((destinationCup.index + 1), 0, ...pickup)

    const newCurrentCupIndex = (cups.findIndex(x => x == currentCup.label) + 1) % cups.length
    currentCup = {
      label: cups[newCurrentCupIndex],
      index: newCurrentCupIndex,
    }
  }

  return cups
}

const solveLinkedList = (input, turns, maxCup) => {
  const cups = input.split('').map(n => parseInt(n, 10))
  let first = cups[0]
  const last = _.last(cups)
  const maxInput = _.max(cups)
  const cupMap = new Map()

  while (cups.length > 0) {
    const current = cups.shift()
    const next = cups.length == 0 ? first : cups[0]
    cupMap.set(current, next)
  }

  if (maxInput < maxCup) {
    cupMap.set(last, maxInput + 1)
    for (let fill = maxInput + 1; fill < maxCup; fill++) {
      cupMap.set(fill, fill + 1)
    }
    cupMap.set(maxCup, first)
  }

  // >>>>>>>>>> start playing

  let currentCup = first

  for (let i = 0; i < turns; i++) {
    // console.log(`\n\n-- move ${i + 1} --`)
    // console.log('cups:', cups.map(x => x == currentCup.label ? `(${x})` : x).join(' '))
    const succ1 = cupMap.get(currentCup)
    const succ2 = cupMap.get(succ1)
    const succ3 = cupMap.get(succ2)
    cupMap.set(currentCup, cupMap.get(succ3))
    cupMap.delete(succ1)
    cupMap.delete(succ2)
    cupMap.delete(succ3)

    // console.log("pick up:", pickup)
    let destinationCup = currentCup == 1 ? maxCup : currentCup - 1
    while (!cupMap.has(destinationCup)) {
      destinationCup = destinationCup == 1 ? maxCup : destinationCup - 1
    }

    // console.log("destination:", destinationCupLabel)

    const destinationSucc = cupMap.get(destinationCup)
    cupMap.set(destinationCup, succ1)
    cupMap.set(succ1, succ2)
    cupMap.set(succ2, succ3)
    cupMap.set(succ3, destinationSucc)
    
    currentCup = cupMap.get(currentCup)
  }

  return cupMap
}

const part1 = (input, turns) => {
  const solution = solveNaive(input, turns)

  const oneIndex = solution.findIndex(x => x == 1)
  return [...solution.slice(oneIndex), ...solution.slice(0, oneIndex)].slice(1).join('')
}

const part1LinkedList = (input, turns) => {
  const cupsMap = solveLinkedList(input, turns, 9)

  let solution = []
  const start = 1
  let cup = start
  while (cupsMap.size) {
    const next = cupsMap.get(cup)
    solution.push(next)
    cupsMap.delete(cup)
    cup = next
  }
  solution.pop()
  
  return solution.join('')
}

const part2 = (input, turns, maxCup) => {
  const cupsMap = solveLinkedList(input, turns, maxCup)

  // for (let i = 1; i <= 5; i++) {
  //   console.log(`cupsMap.get(${i}):`, cupsMap.get(i))
  // }

  // for (let i = maxCup - 3; i <= maxCup; i++) {
  //   console.log(`cupsMap.get(${i}):`, cupsMap.get(i))
  // }

  const succ1 = cupsMap.get(1)
  const succ2 = cupsMap.get(succ1)
  // console.log({succ1, succ2})
  return succ1 * succ2
}

console.log("part1 example:", part1(exampleInput, 9))
console.log("part1:", part1(input, 100))

console.log("part1 linked-list example:", part1LinkedList(exampleInput, 10, 9))
console.log("part1 linked-list:", part1LinkedList(input, 100, 9))

// console.log("part2 example:", part2(exampleInput, 10_000_000, 1_000_000))
console.log("part2:", part2(input, 10_000_000, 1_000_000))






