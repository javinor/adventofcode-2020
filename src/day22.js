const _ = require('lodash')

const input = `Player 1:
29
30
44
35
27
2
4
38
45
33
50
21
17
11
25
40
5
43
41
24
12
19
23
8
42

Player 2:
32
13
22
7
31
16
37
6
10
20
47
46
34
39
1
26
49
9
48
36
14
15
3
18
28`

const exampleInput = `Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10`

const exampleInputLoop = `Player 1:
43
19

Player 2:
2
29
14`

const parseInput = input => {
  const [deck1, deck2] = input.split('\n\n').map(half => {
    const [, ...lines] = half.split('\n')
    const cards = lines.map(x => parseInt(x, 10))
    return cards
  })

  return [deck1, deck2]
}

const part1 = input => {
  const [deck1, deck2] = parseInput(input)

  while (deck1.length > 0 && deck2.length > 0) {
    const top1 = deck1.shift()
    const top2 = deck2.shift()

    if (top1 > top2) {
      deck1.push(top1)
      deck1.push(top2)
    } else {
      deck2.push(top2)
      deck2.push(top1)
    }
  }

  let score = 0
  const winningDeck = deck1.length > 0 ? deck1 : deck2

  for (let i = winningDeck.length - 1; i >= 0; i--) {
    score += winningDeck[i] * (winningDeck.length - i)
  }
  
  return score
}

const recursiveCombat = (deck1, deck2) => {
  const encodeRound = (deck1, deck2) => `${deck1.join(',')};${deck2.join(',')}`
  const rounds = new Set()
  
  while (deck1.length > 0 && deck2.length > 0) {
    const round = encodeRound(deck1, deck2)
    if (rounds.has(round)) {
      return {winner: 1, winningDeck: deck1}
    } else {
      rounds.add(round)
    }

    const top1 = deck1.shift()
    const top2 = deck2.shift()

    const canRecurse = deck1.length >= top1 && deck2.length >= top2
    let winner
    if (canRecurse) {
      winner = recursiveCombat(deck1.slice(0, top1), deck2.slice(0, top2)).winner
    } else {
      winner = top1 > top2 ? 1 : 2
    }
    
    if (winner == 1) {
      deck1.push(top1)
      deck1.push(top2)
    } else {
      deck2.push(top2)
      deck2.push(top1)
    }
  }

  const [winner, winningDeck] = deck1.length > 0 ? [1, deck1] : [2, deck2]
  return {winner, winningDeck}
}

const part2 = input => {
  const [deck1, deck2] = parseInput(input)
  const {winningDeck} = recursiveCombat(deck1, deck2)

  let score = 0

  for (let i = winningDeck.length - 1; i >= 0; i--) {
    score += winningDeck[i] * (winningDeck.length - i)
  }

  return score
}

console.log("part1 example:", part1(exampleInput))
console.log("part1:", part1(input))

console.log("part2 example:", part2(exampleInput))
console.log("part2 example loop:", part2(exampleInputLoop))
console.log("part2:", part2(input))






