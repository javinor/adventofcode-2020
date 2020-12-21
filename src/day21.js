const fs = require('fs')
const _ = require('lodash')

const input = fs.readFileSync('./src/day21.input', 'utf8')

const exampleInput = `mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`

const parseIngredients = input => {
  const parseLine = line => {
    const regex = /(?<ingredients>[\w ]+) (\(contains (?<allergens>[\w, ]+)\))?/g
    const {groups} = regex.exec(line)
    const ingredients = groups.ingredients.split(' ')
    const allergens = groups.allergens.split(', ')
    return {ingredients, allergens}
  }

  const lines = input.split('\n')
  return lines.map(l => parseLine(l))
}

const findSuspiciousIngredients = (allAllergens, allIngredients, nutritionFacts) => {
  const suspiciousIngredients = new Map()

  for (const allergen of allAllergens) {
    const suspects = nutritionFacts.reduce((suspects, {allergens, ingredients}) => {
      return allergens.includes(allergen)
        ?  _.intersection(suspects, ingredients)
        : suspects
      
    }, [...allIngredients])

    suspiciousIngredients.set(allergen, suspects)
  }

  return suspiciousIngredients
}

const part1 = input => {
  const nutritionFacts = parseIngredients(input)
  const allAllergens = new Set(nutritionFacts.map(({allergens}) => allergens).flat())
  const allIngredients = new Set(nutritionFacts.map(({ingredients}) => ingredients).flat())

  const suspiciousIngredients = findSuspiciousIngredients(allAllergens, allIngredients, nutritionFacts)

  const safeIngredients = new Set(_.difference([...allIngredients], _.union(...suspiciousIngredients.values())))
  
  let numOfAppearances = 0

  for (const safeIng of safeIngredients) {
    const count = nutritionFacts.map(({ingredients}) => ingredients).reduce((count, ingredients) => {
      return count + (ingredients.includes(safeIng) ? 1 : 0)
    }, 0)

    numOfAppearances += count
  }

  return numOfAppearances
}

const part2 = input => {
  const nutritionFacts = parseIngredients(input)
  const allAllergens = new Set(nutritionFacts.map(({allergens}) => allergens).flat())
  const allIngredients = new Set(nutritionFacts.map(({ingredients}) => ingredients).flat())

  const suspiciousIngredients = findSuspiciousIngredients(allAllergens, allIngredients, nutritionFacts)

  const dangerousIngredients = new Map()

  while (suspiciousIngredients.size > 0) {
    const entries = [...suspiciousIngredients.entries()]
    const [allergen, [badIngredient]] = entries.find(e => e[1].length === 1)
    dangerousIngredients.set(allergen, badIngredient)
    suspiciousIngredients.delete(allergen)

    for (const [a, ings] of suspiciousIngredients) {
      const newIngs = ings.filter(ing => ing !== badIngredient)
      suspiciousIngredients.set(a, newIngs)
    }
  }

  const canonicalDangerousIngredientList = _.sortBy([...dangerousIngredients.entries()], '0').map(([, ingredient]) => ingredient)
  return canonicalDangerousIngredientList.join(',')
}

console.log("part1 example:", part1(exampleInput))
console.log("part1:", part1(input))

console.log("part2 example:", part2(exampleInput))
console.log("part2:", part2(input))






