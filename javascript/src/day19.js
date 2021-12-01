const fs = require('fs')
const _ = require('lodash')

const input = fs.readFileSync('./src/day19.input', 'utf8')

const exampleInput = `0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb`

const exampleInput2 = `42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba`

const parseRule = line => {
  const [id, rule] = line.split(': ')
  return [id, rule.replace(/"/g, '')]
}

const parseInput = input => {
  const [rulesInput, messagesInput] = input.split('\n\n')
  const rules = new Map(rulesInput.split('\n').map(parseRule))
  const messages = messagesInput.split('\n')
  return {rules,messages}
}

const part1 = input => {
  const {rules, messages} = parseInput(input)
  
  let rule0 = rules.get('0')

  while (rule0.match(/\d+/)) {
    rule0 = rule0.replace(/\d+/, num => ' ( ' + rules.get(num) + ' ) ')
  }

  rule0 = rule0.replace(/ /g, '').replace(/\([ab]+\)/g, x => x.slice(1, -1))
  const regexRule0 = new RegExp('^' + rule0 + '$')

  return messages.filter(msg => regexRule0.test(msg)).length
}

const part2 = input => {
  const replaceRule8 = new Array(5).fill().map((x, i) => `${_.repeat('42 ', i + 1)}`);
  const replaceRule11 = new Array(5).fill().map((x, i) => `${_.repeat('42 ', i + 1)} ${_.repeat('31 ', i + 1)}`);
  const updatedInput = input
    .replace('8: 42', `8: ${replaceRule8.join(' | ')}`)
    .replace('11: 42 31', `11: ${replaceRule11.join(' | ')}`);

  return part1(updatedInput)
}


console.log("part1 example:", part1(exampleInput))
console.log("part1:", part1(input))

console.log("part2 example:", part2(exampleInput2))
console.log("part2:", part2(input))