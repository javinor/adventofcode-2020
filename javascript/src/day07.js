const fs = require('fs')
const _ = require('lodash')

const input = fs.readFileSync('./src/day07.input', 'utf8').split('\n')

const exampleInput1 = `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`.split("\n")

const exampleInput2 = `shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`.split("\n")

const bagColorRegex = /([a-z]+ [a-z]+) bag/g
const numberRegex = /(\d+)/g

const parseLine = line => {
  const [container, ...colors] = line.match(bagColorRegex).map(m => m.slice(0, -4))
  const numbers = line.match(numberRegex)
  
  return colors.map((c, i) => ({inner: c, innerCount: numbers && numbers[i], outer: container}))
}

const myBag = 'shiny gold'

const findAncestors = (color, edges) => {
  const queue = [color]
  const ancestors = new Set()

  while (queue.length) {
    const current = queue.pop()

    edges.filter(e => e.inner == current).forEach(e => {
      queue.push(e.outer)
      ancestors.add(e.outer)
    })
  }

  return ancestors
}

const part1 = (color, input) => {
  const edges = input.map(parseLine).flat()
  const containers = findAncestors(color, edges)
  return containers.size
}

const findChildren = (color, edges) => {
  const queue = [color]
  const children = new Set()

  while (queue.length) {
    const current = queue.pop()

    edges.filter(e => e.outer == current).forEach(e => {
      queue.push(e.inner)
      children.add(e)
    })
  }

  return [...children]
}

const countBags = (edges) => {
  const tree = edges.reduce((colorToChildren, {outer, inner, innerCount}) => {
    if (!colorToChildren[outer]) {
      colorToChildren[outer] = {children: [], totalBagsInside: null}
    }

    if (innerCount != null) {
      colorToChildren[outer].children.push({color: inner, count: parseInt(innerCount, 10)})
    } else {
      colorToChildren[outer].totalBagsInside = 0
    }

    return colorToChildren
  }, {})
  
  let step = 0
  do {
    step += 1
    const processed = _.omitBy(tree, {totalBagsInside: null})
    const nextToProcess = _.pickBy(tree, (v, k) => {
      return v.totalBagsInside == null && _.every(v.children, (child) => _.has(processed, child.color))
    })

    _.forIn(nextToProcess, (v,k) => {
      let totalChildrenCount = v.children.reduce((acc, child) => acc + child.count * (processed[child.color].totalBagsInside + 1), 0)
      tree[k].totalBagsInside = totalChildrenCount
    })
  } while(_.find(tree, {totalBagsInside: null}))

  return tree
}


const part2 = (color, input) => {
  const edges = input.map(parseLine).flat()
  const children = findChildren(color, edges)
  const result = countBags(children)
  return result[myBag].totalBagsInside
}

console.log("part1:", part1(myBag, input))
console.log("part2 example1:", part2(myBag, exampleInput1))
console.log("part2 example2:", part2(myBag, exampleInput2))
console.log("part2:", part2(myBag, input))
