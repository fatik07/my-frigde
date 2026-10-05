const ICONS: Array<[RegExp, string]> = [
  [/egg/i, '🥚'],
  [/chicken/i, '🍗'],
  [/beef|steak/i, '🥩'],
  [/pork|bacon/i, '🥓'],
  [/fish|salmon|tuna/i, '🐟'],
  [/shrimp|prawn/i, '🦐'],
  [/carrot/i, '🥕'],
  [/rice/i, '🍚'],
  [/potato/i, '🥔'],
  [/onion/i, '🧅'],
  [/garlic/i, '🧄'],
  [/tomato/i, '🍅'],
  [/cheese/i, '🧀'],
  [/milk/i, '🥛'],
  [/butter/i, '🧈'],
  [/bread/i, '🍞'],
  [/noodle|pasta/i, '🍜'],
  [/pepper|chili|chilli/i, '🌶️'],
  [/lemon|lime/i, '🍋'],
  [/apple/i, '🍎'],
  [/mushroom/i, '🍄'],
  [/corn/i, '🌽'],
  [/broccoli|vegetable|veggie/i, '🥦'],
]

export function ingredientIcon(name: string): string {
  const match = ICONS.find(([pattern]) => pattern.test(name))
  return match ? match[1] : '🧺'
}
