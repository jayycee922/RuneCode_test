window.QUESTION_BANK = window.QUESTION_BANK || [];
window.QUESTS = window.QUESTS || [];

window.QUESTION_BANK.push(...[
  // ---------------- TIER 1 ----------------
  {
    id: "js-t1-01", lang: "javascript", tier: 1, topic: "console.log", type: "output",
    prompt: "What does this print?",
    code: 'console.log("Hello, Gielinor!");',
    answer: ["Hello, Gielinor!"],
    hint: "console.log prints exactly what is inside the quotes.",
    explain: "console.log writes the string to the console, without the quotes."
  },
  {
    id: "js-t1-02", lang: "javascript", tier: 1, topic: "variables", type: "mc",
    prompt: "Which keyword declares a variable that cannot be reassigned?",
    choices: ["let", "var", "const", "static"],
    answer: 2,
    hint: "Think of something that stays constant.",
    explain: "const creates a binding that cannot be reassigned. let and var can be reassigned."
  },
  {
    id: "js-t1-03", lang: "javascript", tier: 1, topic: "variables", type: "fill",
    prompt: "Fill in the keyword so the gold total can be changed later.",
    code: '____ gold = 10;\ngold = gold + 5;\nconsole.log(gold); // 15',
    answer: ["let", "var"],
    hint: "const would throw an error on the second line.",
    explain: "let declares a variable that can be reassigned, so gold can go from 10 to 15."
  },
  {
    id: "js-t1-04", lang: "javascript", tier: 1, topic: "numbers", type: "fill",
    prompt: "Fill in the operator so xp ends up as 75.",
    code: 'const xp = 50 ____ 25;\nconsole.log(xp); // 75',
    answer: ["+"],
    hint: "You are combining two amounts of XP.",
    explain: "50 + 25 is 75, so the + operator is needed."
  },
  {
    id: "js-t1-05", lang: "javascript", tier: 1, topic: "typeof", type: "mc",
    prompt: "What does typeof \"rune\" return?",
    choices: ["\"string\"", "\"text\"", "\"char\"", "\"object\""],
    answer: 0,
    hint: "Text in quotes has a specific type name in JavaScript.",
    explain: "Any value in quotes is a string, so typeof returns \"string\"."
  },
  {
    id: "js-t1-06", lang: "javascript", tier: 1, topic: "strings", type: "output",
    prompt: "What does this print?",
    code: 'console.log("Bronze" + " " + "dagger");',
    answer: ["Bronze dagger"],
    hint: "+ joins strings together in order.",
    explain: "The + operator concatenates the three strings, including the space in the middle."
  },
  {
    id: "js-t1-07", lang: "javascript", tier: 1, topic: "console.log", type: "fill",
    prompt: "Fill in the method that prints a message to the console.",
    code: 'console.____("Welcome to Lumbridge");',
    answer: ["log"],
    hint: "It is a three-letter word, like the thing you get from chopping trees.",
    explain: "console.log() prints its argument to the console."
  },
  {
    id: "js-t1-08", lang: "javascript", tier: 1, topic: "comments", type: "mc",
    prompt: "Which line is a single-line comment in JavaScript?",
    choices: ["# collect logs", "// collect logs", "<!-- collect logs -->", "-- collect logs"],
    answer: 1,
    hint: "It uses two slashes.",
    explain: "In JavaScript, // starts a comment that runs to the end of the line."
  },
  {
    id: "js-t1-09", lang: "javascript", tier: 1, topic: "typeof", type: "output",
    prompt: "What does this print?",
    code: 'console.log(typeof 42);',
    answer: ["number"],
    hint: "JavaScript has one type for whole numbers and decimals.",
    explain: "42 is a number, so typeof returns \"number\"."
  },
  {
    id: "js-t1-10", lang: "javascript", tier: 1, topic: "strings", type: "fill",
    prompt: "Fill in the property that gives the number of characters in a string.",
    code: 'const name = "Bob";\nconsole.log(name.____); // 3',
    answer: ["length"],
    hint: "How long is the string?",
    explain: "The length property of a string is how many characters it has. \"Bob\" has 3."
  },
  {
    id: "js-t1-11", lang: "javascript", tier: 1, topic: "numbers", type: "mc",
    prompt: "What does console.log(10 % 3) print?",
    choices: ["3", "3.33", "0", "1"],
    answer: 3,
    hint: "% gives the remainder after division.",
    explain: "10 divided by 3 is 3 with a remainder of 1, and % returns that remainder."
  },
  {
    id: "js-t1-12", lang: "javascript", tier: 1, topic: "strings", type: "output",
    prompt: "What does this print?",
    code: 'console.log("5" + 3);',
    answer: ["53"],
    hint: "One side is a string.",
    explain: "When one side of + is a string, JavaScript joins them as text: \"5\" + 3 is \"53\"."
  },

  // ---------------- TIER 2 ----------------
  {
    id: "js-t2-01", lang: "javascript", tier: 2, topic: "strings", type: "fill",
    prompt: "Fill in the string method that makes every letter capital.",
    code: 'console.log("goblin".____()); // GOBLIN',
    answer: ["toUpperCase"],
    hint: "The opposite would be toLowerCase.",
    explain: "toUpperCase() returns a new string with all letters in upper case."
  },
  {
    id: "js-t2-02", lang: "javascript", tier: 2, topic: "template-literals", type: "mc",
    prompt: "Given const n = 3; which expression produces \"You have 3 logs\"?",
    choices: [
      "\"You have ${n} logs\"",
      "`You have ${n} logs`",
      "'You have {n} logs'",
      "`You have $(n) logs`"
    ],
    answer: 1,
    hint: "Template literals use a special kind of quote.",
    explain: "Only backtick strings (template literals) replace ${n} with the value of n."
  },
  {
    id: "js-t2-03", lang: "javascript", tier: 2, topic: "template-literals", type: "fill",
    prompt: "Fill in the blank so this prints \"Got a rune\".",
    code: 'const item = "rune";\nconsole.log(`Got a ${____}`);',
    answer: ["item"],
    hint: "Put the variable's name inside ${ }.",
    explain: "${item} inserts the value of the item variable into the template literal."
  },
  {
    id: "js-t2-04", lang: "javascript", tier: 2, topic: "arrays", type: "output",
    prompt: "What does this print?",
    code: 'const inv = ["axe", "logs", "tinderbox"];\nconsole.log(inv[1]);',
    answer: ["logs"],
    hint: "Array indexes start at 0.",
    explain: "Index 0 is \"axe\", so index 1 is \"logs\"."
  },
  {
    id: "js-t2-05", lang: "javascript", tier: 2, topic: "arrays", type: "mc",
    prompt: "What is the index of the first element in a JavaScript array?",
    choices: ["0", "1", "-1", "It depends on the array"],
    answer: 0,
    hint: "JavaScript counts from the very start.",
    explain: "JavaScript arrays are zero-indexed, so the first element is at index 0."
  },
  {
    id: "js-t2-06", lang: "javascript", tier: 2, topic: "equality", type: "output",
    prompt: "What does this print?",
    code: 'console.log(5 === "5");',
    answer: ["false"],
    hint: "=== checks both value and type.",
    explain: "5 is a number and \"5\" is a string, so strict equality returns false."
  },
  {
    id: "js-t2-07", lang: "javascript", tier: 2, topic: "conditionals", type: "fill",
    prompt: "Fill in the comparison so \"Defeated\" prints when hp is 0.",
    code: 'const hp = 0;\nif (hp ____ 0) {\n  console.log("Defeated");\n}',
    answer: ["===", "==", "<="],
    hint: "Use the strict equality operator.",
    explain: "hp === 0 is true, so the body runs and prints \"Defeated\"."
  },
  {
    id: "js-t2-08", lang: "javascript", tier: 2, topic: "conditionals", type: "output",
    prompt: "What does this print?",
    code: 'const hp = 30;\nif (hp > 50) {\n  console.log("Healthy");\n} else if (hp > 20) {\n  console.log("Hurt");\n} else {\n  console.log("Critical");\n}',
    answer: ["Hurt"],
    hint: "Check each condition from top to bottom.",
    explain: "30 > 50 is false, but 30 > 20 is true, so the else-if branch prints \"Hurt\"."
  },
  {
    id: "js-t2-09", lang: "javascript", tier: 2, topic: "logic", type: "mc",
    prompt: "With hasAxe = true and hasLogs = false, what is hasAxe || hasLogs?",
    choices: ["true", "false", "undefined", "An error"],
    answer: 0,
    hint: "|| needs only one side to be true.",
    explain: "|| (OR) is true when at least one side is true, and hasAxe is true."
  },
  {
    id: "js-t2-10", lang: "javascript", tier: 2, topic: "strings", type: "fill",
    prompt: "Fill in the method that takes part of a string.",
    code: 'console.log("Lumbridge".____(0, 4)); // Lumb',
    answer: ["slice", "substring"],
    hint: "It cuts out a piece from a start index up to (not including) an end index.",
    explain: "slice(0, 4) returns the characters at indexes 0 to 3: \"Lumb\"."
  },
  {
    id: "js-t2-11", lang: "javascript", tier: 2, topic: "strings", type: "output",
    prompt: "What does this print?",
    code: 'const s = "dragon";\nconsole.log(s[0] + s.length);',
    answer: ["d6"],
    hint: "s[0] is a string, so + joins as text.",
    explain: "s[0] is \"d\" and s.length is 6; adding a number to a string gives \"d6\"."
  },
  {
    id: "js-t2-12", lang: "javascript", tier: 2, topic: "logic", type: "mc",
    prompt: "Which expression checks that level is at least 5 AND at most 15?",
    choices: [
      "level >= 5 || level <= 15",
      "level => 5 && level =< 15",
      "level > 5 && level < 15",
      "level >= 5 && level <= 15"
    ],
    answer: 3,
    hint: "\"At least\" and \"at most\" include the boundary numbers.",
    explain: "&& requires both checks to be true, and >= / <= include 5 and 15."
  },

  // ---------------- TIER 3 ----------------
  {
    id: "js-t3-01", lang: "javascript", tier: 3, topic: "loops", type: "output",
    prompt: "What does this print?",
    code: 'let total = 0;\nfor (let i = 1; i <= 4; i++) {\n  total += i;\n}\nconsole.log(total);',
    answer: ["10"],
    hint: "Add 1, 2, 3 and 4.",
    explain: "The loop adds 1 + 2 + 3 + 4, which is 10."
  },
  {
    id: "js-t3-02", lang: "javascript", tier: 3, topic: "loops", type: "mc",
    prompt: "How many times does the body of for (let i = 0; i < 5; i++) run?",
    choices: ["4", "6", "5", "Forever"],
    answer: 2,
    hint: "Count the values of i: starting at 0, stopping before 5.",
    explain: "i takes the values 0, 1, 2, 3, 4, which is 5 runs."
  },
  {
    id: "js-t3-03", lang: "javascript", tier: 3, topic: "functions", type: "fill",
    prompt: "Fill in the keyword that sends a value back from the function.",
    code: 'function double(n) {\n  ____ n * 2;\n}\nconsole.log(double(4)); // 8',
    answer: ["return"],
    hint: "Without it the function gives back undefined.",
    explain: "return n * 2 hands the result back to whoever called the function."
  },
  {
    id: "js-t3-04", lang: "javascript", tier: 3, topic: "loops", type: "output",
    prompt: "What does this print?",
    code: 'let n = 1;\nwhile (n < 20) {\n  n *= 2;\n}\nconsole.log(n);',
    answer: ["32"],
    hint: "Keep doubling until n is no longer less than 20.",
    explain: "n goes 1, 2, 4, 8, 16, 32. At 32 the condition is false and the loop stops."
  },
  {
    id: "js-t3-05", lang: "javascript", tier: 3, topic: "arrow-functions", type: "mc",
    prompt: "Which is a valid arrow function that returns the sum of a and b?",
    choices: [
      "const add = (a, b) -> a + b;",
      "const add = a, b => a + b;",
      "const add => (a, b) { a + b };",
      "const add = (a, b) => a + b;"
    ],
    answer: 3,
    hint: "The arrow is = followed by >.",
    explain: "(a, b) => a + b is an arrow function; with no braces it returns the expression automatically."
  },
  {
    id: "js-t3-06", lang: "javascript", tier: 3, topic: "arrow-functions", type: "output",
    prompt: "What does this print?",
    code: 'const greet = name => `Hail, ${name}!`;\nconsole.log(greet("Zezima"));',
    answer: ["Hail, Zezima!"],
    hint: "The arrow function returns the template literal.",
    explain: "greet returns the template with name replaced by \"Zezima\"."
  },
  {
    id: "js-t3-07", lang: "javascript", tier: 3, topic: "objects", type: "fill",
    prompt: "Fill in the property name to print the goblin's name.",
    code: 'const goblin = { name: "Goblin", hp: 5 };\nconsole.log(goblin.____); // Goblin',
    answer: ["name"],
    hint: "Use dot notation with the right key.",
    explain: "goblin.name reads the value stored under the name key."
  },
  {
    id: "js-t3-08", lang: "javascript", tier: 3, topic: "objects", type: "fill",
    prompt: "Fill in the property name so the last line prints \"Varrock\".",
    code: 'const player = { name: "Ana", level: 3 };\nplayer.____ = "Varrock";\nconsole.log(player.city); // Varrock',
    answer: ["city"],
    hint: "Look at which property the last line reads.",
    explain: "Assigning player.city adds a new city property to the object."
  },
  {
    id: "js-t3-09", lang: "javascript", tier: 3, topic: "functions", type: "mc",
    prompt: "What does console.log(noReturn()) print?",
    code: 'function noReturn() {\n  const x = 5;\n}',
    choices: ["5", "undefined", "null", "An error"],
    answer: 1,
    hint: "The function never says return.",
    explain: "A function without a return statement returns undefined."
  },
  {
    id: "js-t3-10", lang: "javascript", tier: 3, topic: "loops", type: "fill",
    prompt: "Fill in the update step so this prints 0, 1, 2.",
    code: 'for (let i = 0; i < 3; ____) {\n  console.log(i);\n}',
    answer: ["i++", "++i", "i += 1", "i+=1", "i = i + 1", "i=i+1"],
    hint: "Increase i by one each time.",
    explain: "i++ adds 1 to i after each loop, so the loop stops after 0, 1, 2."
  },
  {
    id: "js-t3-11", lang: "javascript", tier: 3, topic: "loops", type: "output",
    prompt: "What does this print?",
    code: 'for (let i = 0; i < 6; i++) {\n  if (i === 3) break;\n  console.log(i);\n}',
    answer: ["0\n1\n2"],
    hint: "break exits the loop immediately.",
    explain: "0, 1 and 2 are printed; when i is 3 the loop breaks before printing."
  },
  {
    id: "js-t3-12", lang: "javascript", tier: 3, topic: "objects", type: "mc",
    prompt: "Given const g = { hp: 5 }; which expression also reads 5?",
    choices: ["g[hp]", "g->hp", "g['hp']", "g::hp"],
    answer: 2,
    hint: "Bracket notation takes the key as a string.",
    explain: "g['hp'] is bracket notation, equivalent to g.hp. g[hp] would look for a variable named hp."
  },

  // ---------------- TIER 4 ----------------
  {
    id: "js-t4-01", lang: "javascript", tier: 4, topic: "array-methods", type: "fill",
    prompt: "Fill in the method that adds an item to the end of the array.",
    code: 'const bag = ["logs", "ore"];\nbag.____("fish");\nconsole.log(bag.length); // 3',
    answer: ["push"],
    hint: "Push it onto the end.",
    explain: "push() appends one or more items to the end of an array."
  },
  {
    id: "js-t4-02", lang: "javascript", tier: 4, topic: "array-methods", type: "mc",
    prompt: "Given const r = [\"air\", \"fire\", \"water\"]; what does r.pop() return?",
    choices: ["\"air\"", "3", "\"water\"", "undefined"],
    answer: 2,
    hint: "pop works on the end of the array.",
    explain: "pop() removes the last element and returns it, which is \"water\"."
  },
  {
    id: "js-t4-03", lang: "javascript", tier: 4, topic: "array-methods", type: "fill",
    prompt: "Fill in the method that checks whether the array contains a value.",
    code: 'const runes = ["air", "mind", "chaos"];\nconsole.log(runes.____("mind")); // true',
    answer: ["includes"],
    hint: "Does the array include it?",
    explain: "includes() returns true if the value is in the array, false otherwise."
  },
  {
    id: "js-t4-04", lang: "javascript", tier: 4, topic: "array-methods", type: "output",
    prompt: "What does this print?",
    code: 'const items = ["a", "b", "c", "d"];\nconsole.log(items.slice(1, 3).join(","));',
    answer: ["b,c"],
    hint: "slice's end index is not included.",
    explain: "slice(1, 3) takes indexes 1 and 2, giving [\"b\", \"c\"], joined as \"b,c\"."
  },
  {
    id: "js-t4-05", lang: "javascript", tier: 4, topic: "array-methods", type: "mc",
    prompt: "What does [\"bronze\", \"iron\", \"steel\"].indexOf(\"mithril\") return?",
    choices: ["-1", "0", "undefined", "null"],
    answer: 0,
    hint: "mithril is not in the array.",
    explain: "indexOf returns -1 when the value is not found."
  },
  {
    id: "js-t4-06", lang: "javascript", tier: 4, topic: "this", type: "output",
    prompt: "What does this print?",
    code: 'const hero = {\n  name: "Lina",\n  greet() {\n    return "I am " + this.name;\n  }\n};\nconsole.log(hero.greet());',
    answer: ["I am Lina"],
    hint: "Inside a method, this is the object the method was called on.",
    explain: "hero.greet() runs with this set to hero, so this.name is \"Lina\"."
  },
  {
    id: "js-t4-07", lang: "javascript", tier: 4, topic: "default-params", type: "fill",
    prompt: "Fill in the default value so attack() returns 10.",
    code: 'function attack(dmg = ____) {\n  return dmg;\n}\nconsole.log(attack()); // 10',
    answer: ["10"],
    hint: "The default is used when no argument is passed.",
    explain: "dmg = 10 sets a default parameter, used because attack() is called with no arguments."
  },
  {
    id: "js-t4-08", lang: "javascript", tier: 4, topic: "try-catch", type: "output",
    prompt: "What does this print?",
    code: 'try {\n  throw new Error("Goblin escaped");\n  console.log("Never runs");\n} catch (err) {\n  console.log(err.message);\n}',
    answer: ["Goblin escaped"],
    hint: "throw jumps straight to catch.",
    explain: "The thrown Error skips the rest of try; catch logs its message."
  },
  {
    id: "js-t4-09", lang: "javascript", tier: 4, topic: "nested-data", type: "mc",
    prompt: "Given const p = { inv: { weapon: \"sword\", gold: 50 } }; how do you read the gold?",
    choices: ["p.gold", "p.inv.gold", "p[inv][gold]", "p.inv->gold"],
    answer: 1,
    hint: "gold lives inside inv.",
    explain: "Chain the dots: p.inv gets the inner object, then .gold reads 50."
  },
  {
    id: "js-t4-10", lang: "javascript", tier: 4, topic: "for-of", type: "fill",
    prompt: "Fill in the keyword so the loop visits each value in the array.",
    code: 'let sum = 0;\nfor (const n ____ [1, 2, 3]) {\n  sum += n;\n}\nconsole.log(sum); // 6',
    answer: ["of"],
    hint: "for...in gives keys; you want the values.",
    explain: "for...of loops over the values of an iterable like an array."
  },
  {
    id: "js-t4-11", lang: "javascript", tier: 4, topic: "nested-data", type: "output",
    prompt: "What does this print?",
    code: 'const loot = [\n  { item: "bones", qty: 1 },\n  { item: "coins", qty: 25 }\n];\nconsole.log(loot[1].item + ":" + loot[1].qty);',
    answer: ["coins:25"],
    hint: "loot[1] is the second object.",
    explain: "loot[1] is { item: \"coins\", qty: 25 }, so the output is \"coins:25\"."
  },
  {
    id: "js-t4-12", lang: "javascript", tier: 4, topic: "try-catch", type: "mc",
    prompt: "In a try/catch/finally statement, when does the finally block run?",
    choices: [
      "Only if an error is thrown",
      "Only if no error is thrown",
      "Never; it just re-throws the error",
      "Always, after try and catch finish"
    ],
    answer: 3,
    hint: "It's called \"finally\" for a reason.",
    explain: "finally always runs, whether or not an error was thrown, which makes it good for cleanup."
  },

  // ---------------- TIER 5 ----------------
  {
    id: "js-t5-01", lang: "javascript", tier: 5, topic: "array-methods", type: "output",
    prompt: "What does this print?",
    code: 'const xp = [10, 20, 30];\nconsole.log(xp.map(x => x * 2).join(","));',
    answer: ["20,40,60"],
    hint: "map transforms every element.",
    explain: "map doubles each value, giving [20, 40, 60], joined with commas."
  },
  {
    id: "js-t5-02", lang: "javascript", tier: 5, topic: "array-methods", type: "mc",
    prompt: "What does [5, 12, 8, 20].filter(n => n > 10) return?",
    choices: ["[5, 8]", "[12, 20]", "true", "[false, true, false, true]"],
    answer: 1,
    hint: "filter keeps the elements where the callback returns true.",
    explain: "Only 12 and 20 are greater than 10, so filter returns [12, 20]."
  },
  {
    id: "js-t5-03", lang: "javascript", tier: 5, topic: "array-methods", type: "fill",
    prompt: "Fill in the starting value for the accumulator.",
    code: 'const total = [100, 250, 50].reduce((acc, n) => acc + n, ____);\nconsole.log(total); // 400',
    answer: ["0"],
    hint: "What number should a sum start from?",
    explain: "Starting the accumulator at 0 adds 100 + 250 + 50 to give 400."
  },
  {
    id: "js-t5-04", lang: "javascript", tier: 5, topic: "closures", type: "output",
    prompt: "What does this print?",
    code: 'function makeCounter() {\n  let c = 0;\n  return () => ++c;\n}\nconst kills = makeCounter();\nkills();\nkills();\nconsole.log(kills());',
    answer: ["3"],
    hint: "The inner function remembers c between calls.",
    explain: "The closure keeps c alive; each call increments it, so the third call returns 3."
  },
  {
    id: "js-t5-05", lang: "javascript", tier: 5, topic: "classes", type: "mc",
    prompt: "Given class Goblin { constructor(hp) { this.hp = hp; } }, how do you create a Goblin with 5 hp?",
    choices: ["Goblin(5)", "Goblin.new(5)", "create Goblin(5)", "new Goblin(5)"],
    answer: 3,
    hint: "Classes need a special keyword to make an instance.",
    explain: "new Goblin(5) creates an instance and calls the constructor with hp = 5."
  },
  {
    id: "js-t5-06", lang: "javascript", tier: 5, topic: "destructuring", type: "output",
    prompt: "What does this print?",
    code: 'const [first, , third] = ["air", "water", "earth"];\nconsole.log(first + " " + third);',
    answer: ["air earth"],
    hint: "The empty slot skips an element.",
    explain: "Array destructuring assigns index 0 to first, skips index 1, and assigns index 2 to third."
  },
  {
    id: "js-t5-07", lang: "javascript", tier: 5, topic: "destructuring", type: "fill",
    prompt: "Fill in the blank to pull str out of the object.",
    code: 'const stats = { atk: 5, str: 7 };\nconst { atk, ____ } = stats;\nconsole.log(atk + str); // 12',
    answer: ["str"],
    hint: "Object destructuring uses the property names.",
    explain: "const { atk, str } = stats creates variables atk = 5 and str = 7."
  },
  {
    id: "js-t5-08", lang: "javascript", tier: 5, topic: "spread", type: "mc",
    prompt: "What does console.log(boss.hp + boss.atk) print?",
    code: 'const base = { hp: 10, atk: 2 };\nconst boss = { ...base, hp: 99 };',
    choices: ["12", "101", "99", "109"],
    answer: 1,
    hint: "Later properties overwrite earlier ones.",
    explain: "The spread copies hp and atk, then hp: 99 overrides hp, so 99 + 2 = 101."
  },
  {
    id: "js-t5-09", lang: "javascript", tier: 5, topic: "recursion", type: "mc",
    prompt: "What does f(4) return?",
    code: 'function f(n) {\n  return n <= 1 ? 1 : n * f(n - 1);\n}',
    choices: ["10", "16", "24", "4"],
    answer: 2,
    hint: "Expand it: 4 * f(3), and so on.",
    explain: "f computes the factorial: 4 * 3 * 2 * 1 = 24."
  },
  {
    id: "js-t5-10", lang: "javascript", tier: 5, topic: "classes", type: "fill",
    prompt: "Fill in the keyword so Archmage inherits from Wizard.",
    code: 'class Wizard {\n  constructor(name) { this.name = name; }\n  cast() { return this.name + " casts!"; }\n}\nclass Archmage ____ Wizard {}\nconsole.log(new Archmage("Sedridor").cast()); // Sedridor casts!',
    answer: ["extends"],
    hint: "The subclass extends the parent class.",
    explain: "class Archmage extends Wizard makes Archmage inherit Wizard's constructor and methods."
  },
  {
    id: "js-t5-11", lang: "javascript", tier: 5, topic: "promises", type: "output",
    prompt: "What does this print, in order?",
    code: 'console.log("A");\nPromise.resolve().then(() => console.log("C"));\nconsole.log("B");',
    answer: ["A\nB\nC"],
    hint: ".then callbacks wait until the current code finishes.",
    explain: "The .then callback runs as a microtask after the synchronous code, so the order is A, B, C."
  },
  {
    id: "js-t5-12", lang: "javascript", tier: 5, topic: "closures", type: "fill",
    prompt: "Fill in the blank so triple(5) returns 15.",
    code: 'function makeMultiplier(m) {\n  return n => n * ____;\n}\nconst triple = makeMultiplier(3);\nconsole.log(triple(5)); // 15',
    answer: ["m"],
    hint: "The inner function can use the outer function's parameter.",
    explain: "The returned arrow function closes over m, so triple multiplies by 3."
  }
]);

window.QUESTS.push(...[
  {
    id: "runes",
    name: "Rune Mysteries of Script",
    lang: "javascript",
    npc: "wizard",
    minLevel: 1,
    xp: 150,
    intro: "Ah, adventurer! I, Archmage Syntaxa, have found a strange talisman that only speaks JavaScript. Help me learn its basic words and we may unlock its secrets.",
    outro: "Splendid! The talisman glows with understanding. You have the makings of a fine script-mage.",
    steps: [
      {
        id: "q-runes-1", lang: "javascript", tier: 1, topic: "console.log", type: "output",
        prompt: "The talisman runs this line. What does it print?",
        code: 'console.log("The talisman hums");',
        answer: ["The talisman hums"],
        hint: "console.log prints the text inside the quotes.",
        explain: "console.log writes the string to the console, without the quotes."
      },
      {
        id: "q-runes-2", lang: "javascript", tier: 1, topic: "variables", type: "fill",
        prompt: "The talisman's element must never be reassigned. Fill in the keyword.",
        code: '____ element = "air";\nconsole.log(element);',
        answer: ["const"],
        hint: "Pick the keyword for values that stay constant.",
        explain: "const declares a variable that cannot be reassigned."
      },
      {
        id: "q-runes-3", lang: "javascript", tier: 1, topic: "strings", type: "mc",
        prompt: "What does this print?",
        code: 'const rune = "Air";\nconsole.log(rune + " rune");',
        choices: ["rune Air", "Air rune", "Airrune", "An error"],
        answer: 1,
        hint: "The strings are joined in the order written.",
        explain: "\"Air\" + \" rune\" joins to \"Air rune\", including the leading space."
      }
    ]
  },
  {
    id: "ghost",
    name: "The Restless Bug",
    lang: "javascript",
    npc: "priest",
    minLevel: 4,
    xp: 450,
    intro: "Bless you for coming! I am Father Debuggin, and my chapel is haunted by a bug in my code. Every night it rattles my conditionals and loops. Please, help me find and banish it!",
    outro: "The chapel is finally quiet. Thank you, friend; the bug has been laid to rest.",
    steps: [
      {
        id: "q-ghost-1", lang: "javascript", tier: 2, topic: "conditionals", type: "mc",
        prompt: "The ghost's check always behaves strangely. What is the bug?",
        code: 'let hp = 10;\nif (hp = 0) {\n  console.log("The ghost is gone");\n}',
        choices: [
          "The if needs a semicolon after the parentheses",
          "hp should be declared with const",
          "= assigns a value; it should be === to compare",
          "console.log cannot be used inside an if"
        ],
        answer: 2,
        hint: "Look closely at the operator inside the if.",
        explain: "hp = 0 assigns 0 to hp instead of comparing. Use hp === 0 to compare."
      },
      {
        id: "q-ghost-2", lang: "javascript", tier: 2, topic: "loops", type: "fill",
        prompt: "This loop should print 1 through 5, but it stops at 4. Fill in the fixed operator.",
        code: 'for (let i = 1; i ____ 5; i++) {\n  console.log(i);\n}',
        answer: ["<="],
        hint: "The loop must still run when i equals 5.",
        explain: "i <= 5 keeps looping while i is 5 or less, so 5 is printed too."
      },
      {
        id: "q-ghost-3", lang: "javascript", tier: 3, topic: "functions", type: "output",
        prompt: "Father Debuggin's XP function is buggy. What does this print?",
        code: 'function addXp(a, b) {\n  a + b;\n}\nconsole.log(addXp(2, 3));',
        answer: ["undefined"],
        hint: "Is anything actually returned?",
        explain: "The function computes a + b but never returns it, so the call returns undefined."
      },
      {
        id: "q-ghost-4", lang: "javascript", tier: 3, topic: "loops", type: "fill",
        prompt: "This loop moans \"Boo\" forever! Fill in the missing line so it moans exactly 3 times.",
        code: 'let i = 0;\nwhile (i < 3) {\n  console.log("Boo");\n  ____;\n}',
        answer: ["i++", "++i", "i += 1", "i+=1", "i = i + 1", "i=i+1"],
        hint: "Something has to change i each time around.",
        explain: "Without increasing i, i < 3 is always true. i++ lets the loop end after 3 runs."
      }
    ]
  },
  {
    id: "imps",
    name: "Imp Catcher of Arrays",
    lang: "javascript",
    npc: "mage",
    minLevel: 6,
    xp: 700,
    intro: "Curses! Pesky imps have stolen my four coloured beads: red, yellow, black and white. I am Wizard Arrayan, and I need you to track the beads in an array as you recover them.",
    outro: "All four beads, safely back in order! Your array skills are truly magical. Take this reward.",
    steps: [
      {
        id: "q-imps-1", lang: "javascript", tier: 3, topic: "arrays", type: "fill",
        prompt: "Fill in the property that tells how many beads are in the array.",
        code: 'const beads = ["red", "yellow", "black", "white"];\nconsole.log(beads.____); // 4',
        answer: ["length"],
        hint: "Arrays and strings share this property.",
        explain: "beads.length is the number of elements, which is 4."
      },
      {
        id: "q-imps-2", lang: "javascript", tier: 3, topic: "array-methods", type: "output",
        prompt: "You catch three imps. What does this print?",
        code: 'const beads = [];\nbeads.push("red");\nbeads.push("yellow");\nbeads.push("black");\nconsole.log(beads.join(", "));',
        answer: ["red, yellow, black"],
        hint: "push adds to the end; join glues with the separator you give it.",
        explain: "The three pushes build [\"red\", \"yellow\", \"black\"], joined with \", \"."
      },
      {
        id: "q-imps-3", lang: "javascript", tier: 4, topic: "array-methods", type: "mc",
        prompt: "What does beads.indexOf(\"black\") return?",
        code: 'const beads = ["red", "yellow", "black", "white"];',
        choices: ["3", "2", "1", "-1"],
        answer: 1,
        hint: "Count from 0.",
        explain: "\"black\" is the third element, which is at index 2."
      },
      {
        id: "q-imps-4", lang: "javascript", tier: 4, topic: "for-of", type: "output",
        prompt: "Count the beads that are not white. What does this print?",
        code: 'const beads = ["red", "yellow", "black", "white"];\nlet found = 0;\nfor (const b of beads) {\n  if (b !== "white") found++;\n}\nconsole.log(found + " of " + beads.length);',
        answer: ["3 of 4"],
        hint: "Every bead except one passes the check.",
        explain: "Three beads are not \"white\", so found is 3 and the array length is 4."
      }
    ]
  },
  {
    id: "demon",
    name: "Demon Slayer: Closures",
    lang: "javascript",
    npc: "knight",
    minLevel: 10,
    xp: 1800,
    intro: "Halt, brave one! I am Sir Prysin, and the demon Delrith is rising. Only Silverlight can stop him, and forging it requires mastery of advanced functions. Will you help me?",
    outro: "Silverlight is forged and Delrith is banished! Varrock owes you a great debt, hero.",
    steps: [
      {
        id: "q-demon-1", lang: "javascript", tier: 4, topic: "closures", type: "output",
        prompt: "The forge remembers its power between strikes. What does this print?",
        code: 'function forge() {\n  let power = 0;\n  return function () {\n    power += 10;\n    return power;\n  };\n}\nconst strike = forge();\nstrike();\nconsole.log(strike());',
        answer: ["20"],
        hint: "power persists between calls to strike.",
        explain: "The inner function closes over power. The first call makes it 10, the second makes it 20."
      },
      {
        id: "q-demon-2", lang: "javascript", tier: 5, topic: "array-methods", type: "fill",
        prompt: "Fill in the method that doubles every hit and returns a new array.",
        code: 'const hits = [3, 7, 12];\nconst doubled = hits.____(h => h * 2);\nconsole.log(doubled.join(",")); // 6,14,24',
        answer: ["map"],
        hint: "It transforms each element one-to-one.",
        explain: "map calls the function on every element and returns a new array of the results."
      },
      {
        id: "q-demon-3", lang: "javascript", tier: 5, topic: "array-methods", type: "mc",
        prompt: "What does this reduce return?",
        code: '[10, 20, 30].filter(n => n > 10).reduce((a, b) => a + b, 0)',
        choices: ["60", "\"2030\"", "30", "50"],
        answer: 3,
        hint: "Filter first, then sum what's left.",
        explain: "filter keeps [20, 30], and reduce adds them starting from 0, giving 50."
      },
      {
        id: "q-demon-4", lang: "javascript", tier: 5, topic: "classes", type: "output",
        prompt: "What does this print?",
        code: 'class Sword {\n  constructor(name, dmg) {\n    this.name = name;\n    this.dmg = dmg;\n  }\n  hit() {\n    return `${this.name} deals ${this.dmg}`;\n  }\n}\nconst s = new Sword("Silverlight", 99);\nconsole.log(s.hit());',
        answer: ["Silverlight deals 99"],
        hint: "The constructor stores name and dmg on this.",
        explain: "new Sword sets name and dmg, and hit() uses them in a template literal."
      },
      {
        id: "q-demon-5", lang: "javascript", tier: 5, topic: "destructuring", type: "fill",
        prompt: "Fill in the blank to pull hp out of Delrith's stats.",
        code: 'const delrith = { name: "Delrith", hp: 50 };\nconst { ____ } = delrith;\nconsole.log(hp); // 50',
        answer: ["hp"],
        hint: "The variable name must match the property name.",
        explain: "const { hp } = delrith creates a variable hp holding delrith.hp, which is 50."
      }
    ]
  }
]);
