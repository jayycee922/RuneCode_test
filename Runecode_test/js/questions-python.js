window.QUESTION_BANK = window.QUESTION_BANK || [];
window.QUESTS = window.QUESTS || [];

window.QUESTION_BANK.push(...[
  // ---------------- TIER 1: print, variables, numbers, strings, comments, types ----------------
  {
    id: "py-t1-01", lang: "python", tier: 1, topic: "print", type: "mc",
    prompt: "Which line correctly prints Hello, adventurer! to the screen?",
    choices: ["echo('Hello, adventurer!')", "print('Hello, adventurer!')", "Print 'Hello, adventurer!'", "console.print('Hello, adventurer!')"],
    answer: 1,
    hint: "Python's built-in output function is all lowercase.",
    explain: "print() is Python's built-in function for showing text. Text goes inside quotes, inside the parentheses."
  },
  {
    id: "py-t1-02", lang: "python", tier: 1, topic: "print", type: "output",
    prompt: "What does this program print?",
    code: "print('Gold:', 50)",
    answer: ["Gold: 50"],
    hint: "print() puts a space between each item separated by a comma.",
    explain: "When you pass several values to print(), it separates them with a single space."
  },
  {
    id: "py-t1-03", lang: "python", tier: 1, topic: "print", type: "fill",
    prompt: "Fill in the blank so the greeting appears on screen.",
    code: "____('Welcome to Lumbridge')",
    answer: ["print"],
    hint: "Which function displays output?",
    explain: "print() displays its argument on the screen."
  },
  {
    id: "py-t1-04", lang: "python", tier: 1, topic: "variables", type: "output",
    prompt: "You chopped some logs. What does this print?",
    code: "logs = 7\nmore_logs = 3\nprint(logs + more_logs)",
    answer: ["10"],
    hint: "Variables hold numbers you can add together.",
    explain: "logs is 7 and more_logs is 3, so logs + more_logs is 10."
  },
  {
    id: "py-t1-05", lang: "python", tier: 1, topic: "comments", type: "mc",
    prompt: "Which symbol starts a single-line comment in Python?",
    choices: ["//", "<!--", "#", "--"],
    answer: 2,
    hint: "It's sometimes called a hash or pound sign.",
    explain: "Everything after # on a line is a comment and is ignored by Python."
  },
  {
    id: "py-t1-06", lang: "python", tier: 1, topic: "numbers", type: "output",
    prompt: "You split 10 gold coins among 4 players. What does this print?",
    code: "print(10 / 4)",
    answer: ["2.5"],
    hint: "The / operator always does 'true' division.",
    explain: "In Python 3, / always returns a float, so 10 / 4 is 2.5."
  },
  {
    id: "py-t1-07", lang: "python", tier: 1, topic: "types", type: "fill",
    prompt: "Fill in the built-in function that tells you a value's type. This prints <class 'int'>.",
    code: "logs = 5\nprint(____(logs))",
    answer: ["type"],
    hint: "The function's name is the word you'd use to ask 'what kind is this?'",
    explain: "type() returns the class of a value; 5 is an int."
  },
  {
    id: "py-t1-08", lang: "python", tier: 1, topic: "strings", type: "output",
    prompt: "What does this print?",
    code: "first = 'Rune'\nsecond = 'Code'\nprint(first + second)",
    answer: ["RuneCode"],
    hint: "+ joins strings exactly, without adding spaces.",
    explain: "Using + on two strings concatenates them with nothing in between: RuneCode."
  },
  {
    id: "py-t1-09", lang: "python", tier: 1, topic: "types", type: "mc",
    prompt: "What is the type of the value \"42\" (with quotes)?",
    choices: ["str", "int", "float", "bool"],
    answer: 0,
    hint: "Look closely at the quotes.",
    explain: "Anything inside quotes is a string (str), even if it looks like a number."
  },
  {
    id: "py-t1-10", lang: "python", tier: 1, topic: "numbers", type: "mc",
    prompt: "What does 7 // 2 evaluate to?",
    choices: ["3.5", "4", "3.0", "3"],
    answer: 3,
    hint: "// is floor division: it drops the fractional part.",
    explain: "// divides and rounds down to a whole number; with two ints the result is the int 3."
  },
  {
    id: "py-t1-11", lang: "python", tier: 1, topic: "strings", type: "fill",
    prompt: "Fill in the operator that joins the two strings so this prints Hi Bob.",
    code: "name = 'Bob'\nprint('Hi ' ____ name)",
    answer: ["+"],
    hint: "The same symbol you use to add numbers.",
    explain: "+ concatenates strings: 'Hi ' + 'Bob' gives 'Hi Bob'."
  },
  {
    id: "py-t1-12", lang: "python", tier: 1, topic: "types", type: "fill",
    prompt: "Fill in the blank to convert 3.9 into a whole number. This prints 3.",
    code: "print(____(3.9))",
    answer: ["int"],
    hint: "Use the name of the integer type.",
    explain: "int() converts a float to an integer by cutting off the decimal part, so int(3.9) is 3."
  },

  // ---------------- TIER 2: string methods, lists, indexing, if/elif/else, comparisons, booleans ----------------
  {
    id: "py-t2-01", lang: "python", tier: 2, topic: "strings", type: "output",
    prompt: "What does this print?",
    code: "name = 'goblin'\nprint(name.upper())",
    answer: ["GOBLIN"],
    hint: "upper() changes the case of every letter.",
    explain: ".upper() returns a copy of the string with all letters in uppercase."
  },
  {
    id: "py-t2-02", lang: "python", tier: 2, topic: "lists", type: "mc",
    prompt: "What is items[1]?",
    code: "items = ['logs', 'ore', 'fish']",
    choices: ["'logs'", "'ore'", "'fish'", "IndexError"],
    answer: 1,
    hint: "List indexes start counting at 0.",
    explain: "Index 0 is 'logs', so index 1 is 'ore'."
  },
  {
    id: "py-t2-03", lang: "python", tier: 2, topic: "lists", type: "fill",
    prompt: "Fill in the list method that adds 'shield' to the end of the inventory.",
    code: "inv = ['sword']\ninv.____('shield')\nprint(inv)",
    answer: ["append"],
    hint: "You want to attach something to the end.",
    explain: ".append(x) adds x to the end of a list, giving ['sword', 'shield']."
  },
  {
    id: "py-t2-04", lang: "python", tier: 2, topic: "indexing", type: "output",
    prompt: "What does this print?",
    code: "runes = ['air', 'water', 'earth']\nprint(runes[-1])",
    answer: ["earth"],
    hint: "Negative indexes count from the end.",
    explain: "Index -1 refers to the last element of a list, which is 'earth'."
  },
  {
    id: "py-t2-05", lang: "python", tier: 2, topic: "conditionals", type: "output",
    prompt: "What does this print?",
    code: "hp = 15\nif hp > 20:\n    print('Healthy')\nelif hp > 10:\n    print('Hurt')\nelse:\n    print('Critical')",
    answer: ["Hurt"],
    hint: "Check each condition from top to bottom; the first true one wins.",
    explain: "15 > 20 is False, but 15 > 10 is True, so the elif branch prints Hurt."
  },
  {
    id: "py-t2-06", lang: "python", tier: 2, topic: "comparison", type: "mc",
    prompt: "What does print(5 == 5.0) display?",
    choices: ["False", "Error", "True", "5"],
    answer: 2,
    hint: "== compares values, not types.",
    explain: "The int 5 and the float 5.0 have the same numeric value, so == gives True."
  },
  {
    id: "py-t2-07", lang: "python", tier: 2, topic: "lists", type: "fill",
    prompt: "Fill in the built-in function so this prints 4 (the number of items in the bag).",
    code: "bag = ['bones', 'hide', 'coins', 'rune']\nprint(____(bag))",
    answer: ["len"],
    hint: "Short for 'length'.",
    explain: "len() returns how many items a list contains."
  },
  {
    id: "py-t2-08", lang: "python", tier: 2, topic: "booleans", type: "fill",
    prompt: "Fill in the boolean operator so 'Ready' prints when you have a sword OR a shield.",
    code: "has_sword = True\nhas_shield = False\nif has_sword ____ has_shield:\n    print('Ready')",
    answer: ["or"],
    hint: "Only one of them needs to be True.",
    explain: "'or' is True if at least one side is True, so True or False is True."
  },
  {
    id: "py-t2-09", lang: "python", tier: 2, topic: "strings", type: "mc",
    prompt: "What does '  oak  '.strip() return?",
    choices: ["'  oak'", "'oak  '", "' oak '", "'oak'"],
    answer: 3,
    hint: "strip() works on both ends.",
    explain: ".strip() removes whitespace from both the start and end of a string."
  },
  {
    id: "py-t2-10", lang: "python", tier: 2, topic: "comparison", type: "fill",
    prompt: "Fill in the comparison so the message prints only when level is exactly 10.",
    code: "level = 10\nif level ____ 10:\n    print('Max level!')",
    answer: ["=="],
    hint: "A single = assigns; you need to compare.",
    explain: "== checks equality. A single = is assignment and would be a syntax error here."
  },
  {
    id: "py-t2-11", lang: "python", tier: 2, topic: "strings", type: "output",
    prompt: "What does this print?",
    code: "s = 'dragon'\nprint(s.replace('d', 'w'))",
    answer: ["wragon"],
    hint: "replace() swaps every occurrence of the first text with the second.",
    explain: "There is one 'd' in 'dragon', so replacing it with 'w' gives 'wragon'."
  },
  {
    id: "py-t2-12", lang: "python", tier: 2, topic: "comparison", type: "mc",
    prompt: "Which operator checks whether two values are NOT equal?",
    choices: ["=/=", "!=", "<>", "=!"],
    answer: 1,
    hint: "In many languages, ! means 'not'.",
    explain: "!= returns True when the two values differ."
  },

  // ---------------- TIER 3: for/while loops, range, functions, return, dict basics ----------------
  {
    id: "py-t3-01", lang: "python", tier: 3, topic: "loops", type: "output",
    prompt: "What does this print? (one value per line)",
    code: "for i in range(3):\n    print(i)",
    answer: ["0\n1\n2"],
    hint: "range(3) starts at 0 and stops before 3.",
    explain: "range(3) produces 0, 1, 2 — the stop value 3 is not included."
  },
  {
    id: "py-t3-02", lang: "python", tier: 3, topic: "range", type: "mc",
    prompt: "Which numbers does range(2, 10, 3) produce?",
    choices: ["2, 5, 8", "2, 5, 8, 11", "3, 6, 9", "2, 4, 6, 8"],
    answer: 0,
    hint: "Start at 2, step by 3, stop before 10.",
    explain: "range(start, stop, step) gives 2, 5, 8; 11 would be past the stop value 10."
  },
  {
    id: "py-t3-03", lang: "python", tier: 3, topic: "functions", type: "fill",
    prompt: "Fill in the keyword that sends the greeting back to the caller.",
    code: "def greet(name):\n    ____ 'Hi ' + name\n\nprint(greet('Hans'))",
    answer: ["return"],
    hint: "It hands a value back out of the function.",
    explain: "return ends the function and gives its value back to whoever called it."
  },
  {
    id: "py-t3-04", lang: "python", tier: 3, topic: "loops", type: "output",
    prompt: "You loot three goblins. What does this print?",
    code: "total = 0\nfor coin in [5, 10, 20]:\n    total += coin\nprint(total)",
    answer: ["35"],
    hint: "Add each value to the running total.",
    explain: "0 + 5 + 10 + 20 = 35."
  },
  {
    id: "py-t3-05", lang: "python", tier: 3, topic: "loops", type: "fill",
    prompt: "Fill in the keyword for a loop that keeps going as long as the condition is true. This prints 3.",
    code: "count = 0\n____ count < 3:\n    count += 1\nprint(count)",
    answer: ["while"],
    hint: "Not 'for' — this loop is driven by a condition.",
    explain: "A while loop repeats while its condition is True; it stops once count reaches 3."
  },
  {
    id: "py-t3-06", lang: "python", tier: 3, topic: "functions", type: "mc",
    prompt: "What value is stored in result?",
    code: "def shout():\n    print('Attack!')\n\nresult = shout()",
    choices: ["'Attack!'", "0", "None", "An error is raised"],
    answer: 2,
    hint: "Look for a return statement.",
    explain: "A function without a return statement returns None, even if it prints something."
  },
  {
    id: "py-t3-07", lang: "python", tier: 3, topic: "functions", type: "fill",
    prompt: "Fill in the keyword used to define a function.",
    code: "____ add(a, b):\n    return a + b",
    answer: ["def"],
    hint: "It's short for 'define'.",
    explain: "def starts a function definition in Python."
  },
  {
    id: "py-t3-08", lang: "python", tier: 3, topic: "functions", type: "output",
    prompt: "What does this print?",
    code: "def double(x):\n    return x * 2\n\nprint(double(4) + 1)",
    answer: ["9"],
    hint: "Call the function first, then add.",
    explain: "double(4) returns 8, and 8 + 1 is 9."
  },
  {
    id: "py-t3-09", lang: "python", tier: 3, topic: "dicts", type: "mc",
    prompt: "What is prices['ore']?",
    code: "prices = {'logs': 4, 'ore': 10}",
    choices: ["4", "'ore'", "KeyError", "10"],
    answer: 3,
    hint: "Look up the value paired with the key 'ore'.",
    explain: "Square brackets with a key return that key's value; 'ore' maps to 10."
  },
  {
    id: "py-t3-10", lang: "python", tier: 3, topic: "dicts", type: "fill",
    prompt: "Fill in the operator that checks whether 'logs' is a key in the bank. This prints True.",
    code: "bank = {'logs': 3, 'ore': 1}\nprint('logs' ____ bank)",
    answer: ["in"],
    hint: "A two-letter keyword for membership.",
    explain: "The 'in' operator checks whether a key exists in a dictionary."
  },
  {
    id: "py-t3-11", lang: "python", tier: 3, topic: "dicts", type: "output",
    prompt: "What does this print?",
    code: "drops = {'bones': 1}\ndrops['hide'] = 2\ndrops['bones'] = 5\nprint(len(drops))",
    answer: ["2"],
    hint: "Assigning to an existing key doesn't add a new one.",
    explain: "'hide' is added, but 'bones' is just updated, so the dict has 2 keys."
  },
  {
    id: "py-t3-12", lang: "python", tier: 3, topic: "loops", type: "mc",
    prompt: "What does the break statement do inside a loop?",
    choices: ["Skips to the next iteration", "Exits the loop immediately", "Restarts the loop from the beginning", "Pauses the program"],
    answer: 1,
    hint: "Its partner, continue, is the one that skips ahead.",
    explain: "break stops the loop entirely; continue only skips the rest of the current iteration."
  },

  // ---------------- TIER 4: slicing, dict/list methods, nested data, f-strings, try/except, default args ----------------
  {
    id: "py-t4-01", lang: "python", tier: 4, topic: "slicing", type: "output",
    prompt: "What does this print?",
    code: "s = 'Lumbridge'\nprint(s[1:4])",
    answer: ["umb"],
    hint: "The slice includes the start index but not the end index.",
    explain: "s[1:4] takes indexes 1, 2, 3: 'u', 'm', 'b'."
  },
  {
    id: "py-t4-02", lang: "python", tier: 4, topic: "slicing", type: "fill",
    prompt: "Fill in the slice so this prints [20, 30].",
    code: "nums = [10, 20, 30, 40]\nprint(nums[____])",
    answer: ["1:3", "1:-1", "-3:-1", "-3:3"],
    hint: "start:stop — stop is not included.",
    explain: "nums[1:3] takes indexes 1 and 2, which are 20 and 30."
  },
  {
    id: "py-t4-03", lang: "python", tier: 4, topic: "slicing", type: "mc",
    prompt: "What does 'rune'[::-1] evaluate to?",
    choices: ["'rune'", "'enur'", "'r'", "'e'"],
    answer: 1,
    hint: "A step of -1 walks backwards.",
    explain: "[::-1] slices the whole string with step -1, reversing it."
  },
  {
    id: "py-t4-04", lang: "python", tier: 4, topic: "dicts", type: "fill",
    prompt: "Fill in the dict method that returns a default when the key is missing. This prints 0.",
    code: "stats = {'hp': 10}\nprint(stats.____('mana', 0))",
    answer: ["get"],
    hint: "Unlike [], this method never raises KeyError.",
    explain: ".get(key, default) returns the default if the key isn't in the dict."
  },
  {
    id: "py-t4-05", lang: "python", tier: 4, topic: "f-strings", type: "output",
    prompt: "What does this print?",
    code: "name = 'Zezima'\nlvl = 99\nprint(f'{name} is level {lvl}')",
    answer: ["Zezima is level 99"],
    hint: "Expressions in {} are replaced with their values.",
    explain: "An f-string substitutes each {expression} with its value."
  },
  {
    id: "py-t4-06", lang: "python", tier: 4, topic: "errors", type: "mc",
    prompt: "Which exception does int('abc') raise?",
    choices: ["TypeError", "KeyError", "ValueError", "SyntaxError"],
    answer: 2,
    hint: "The type (str) is fine; its content isn't.",
    explain: "int() accepts strings, but 'abc' isn't a valid number, so it raises ValueError."
  },
  {
    id: "py-t4-07", lang: "python", tier: 4, topic: "errors", type: "fill",
    prompt: "Fill in the keyword that catches the error so this prints No!",
    code: "try:\n    print(10 / 0)\n____ ZeroDivisionError:\n    print('No!')",
    answer: ["except"],
    hint: "try pairs with this keyword.",
    explain: "An except block runs when the matching exception is raised inside try."
  },
  {
    id: "py-t4-08", lang: "python", tier: 4, topic: "functions", type: "output",
    prompt: "What does this print?",
    code: "def hit(dmg=5):\n    return dmg * 2\n\nprint(hit() + hit(1))",
    answer: ["12"],
    hint: "hit() uses the default value; hit(1) overrides it.",
    explain: "hit() returns 10 and hit(1) returns 2, so the total is 12."
  },
  {
    id: "py-t4-09", lang: "python", tier: 4, topic: "nested data", type: "mc",
    prompt: "What is grid[1][0]?",
    code: "grid = [[1, 2], [3, 4]]",
    choices: ["2", "1", "4", "3"],
    answer: 3,
    hint: "First pick the row, then the item inside it.",
    explain: "grid[1] is [3, 4], and [3, 4][0] is 3."
  },
  {
    id: "py-t4-10", lang: "python", tier: 4, topic: "dicts", type: "fill",
    prompt: "Fill in the dict method that gives you key/value pairs to loop over.",
    code: "inv = {'logs': 2, 'ore': 5}\nfor k, v in inv.____():\n    print(k, v)",
    answer: ["items"],
    hint: "keys() gives keys, values() gives values... what gives both?",
    explain: ".items() yields (key, value) tuples, which unpack into k and v."
  },
  {
    id: "py-t4-11", lang: "python", tier: 4, topic: "lists", type: "output",
    prompt: "What does this print?",
    code: "lst = [3, 1, 2]\nlst.sort()\nlst.append(0)\nprint(lst)",
    answer: ["[1, 2, 3, 0]"],
    hint: "Do the steps in order: sort first, then append.",
    explain: "sort() makes it [1, 2, 3], then append(0) adds 0 at the end."
  },
  {
    id: "py-t4-12", lang: "python", tier: 4, topic: "f-strings", type: "mc",
    prompt: "What does f'{3.14159:.2f}' produce?",
    choices: ["'3.14'", "'3.1'", "'3.14159'", "'3.142'"],
    answer: 0,
    hint: ".2f means 2 digits after the decimal point.",
    explain: "The format spec :.2f rounds the float to 2 decimal places: '3.14'."
  },

  // ---------------- TIER 5: comprehensions, classes, recursion, lambda/sorted, sets, enumerate/zip, *args ----------------
  {
    id: "py-t5-01", lang: "python", tier: 5, topic: "comprehensions", type: "output",
    prompt: "What does this print?",
    code: "print([x * x for x in range(4)])",
    answer: ["[0, 1, 4, 9]"],
    hint: "range(4) is 0, 1, 2, 3.",
    explain: "The comprehension squares each of 0, 1, 2, 3."
  },
  {
    id: "py-t5-02", lang: "python", tier: 5, topic: "sets", type: "mc",
    prompt: "What does this set comprehension produce?",
    code: "{x for x in [1, 1, 2, 3, 3]}",
    choices: ["[1, 2, 3]", "{1, 1, 2, 3, 3}", "{1: 1, 2: 2, 3: 3}", "{1, 2, 3}"],
    answer: 3,
    hint: "Sets don't keep duplicates.",
    explain: "Curly braces with a single expression build a set, which removes duplicates."
  },
  {
    id: "py-t5-03", lang: "python", tier: 5, topic: "comprehensions", type: "fill",
    prompt: "Fill in the keyword that filters the comprehension to even numbers only.",
    code: "evens = [n for n in range(10) ____ n % 2 == 0]",
    answer: ["if"],
    hint: "The same keyword you use for conditionals.",
    explain: "A trailing 'if' in a comprehension keeps only items where the condition is True."
  },
  {
    id: "py-t5-04", lang: "python", tier: 5, topic: "classes", type: "output",
    prompt: "What does this print?",
    code: "class Goblin:\n    def __init__(self, hp):\n        self.hp = hp\n\n    def hit(self, dmg):\n        self.hp -= dmg\n        return self.hp\n\ng = Goblin(10)\ng.hit(3)\nprint(g.hit(4))",
    answer: ["3"],
    hint: "The object remembers its hp between method calls.",
    explain: "hp goes 10 -> 7 after the first hit, then 7 -> 3 after the second, which is returned."
  },
  {
    id: "py-t5-05", lang: "python", tier: 5, topic: "lambda", type: "mc",
    prompt: "What does this print?",
    code: "monsters = [('goblin', 5), ('cow', 2), ('imp', 7)]\nweakest = sorted(monsters, key=lambda m: m[1])[0]\nprint(weakest)",
    choices: ["('goblin', 5)", "('cow', 2)", "('imp', 7)", "('cow', 'goblin')"],
    answer: 1,
    hint: "The lambda tells sorted to compare the second item of each tuple.",
    explain: "Sorting by m[1] orders by level (2, 5, 7), so the first item is ('cow', 2)."
  },
  {
    id: "py-t5-06", lang: "python", tier: 5, topic: "recursion", type: "fill",
    prompt: "Fill in the recursive call so sum_to(n) returns 1 + 2 + ... + n.",
    code: "def sum_to(n):\n    if n == 0:\n        return 0\n    return n + ____(n - 1)",
    answer: ["sum_to"],
    hint: "A recursive function calls itself.",
    explain: "sum_to calls itself with n - 1 until it reaches the base case n == 0."
  },
  {
    id: "py-t5-07", lang: "python", tier: 5, topic: "recursion", type: "output",
    prompt: "What does this print?",
    code: "def fact(n):\n    if n <= 1:\n        return 1\n    return n * fact(n - 1)\n\nprint(fact(5))",
    answer: ["120"],
    hint: "5 * 4 * 3 * 2 * 1",
    explain: "fact(5) multiplies 5 * 4 * 3 * 2 * 1 = 120."
  },
  {
    id: "py-t5-08", lang: "python", tier: 5, topic: "lambda", type: "mc",
    prompt: "What does sorted(['ore', 'logs', 'fish'], key=len) return?",
    choices: ["['fish', 'logs', 'ore']", "['ore', 'fish', 'logs']", "['ore', 'logs', 'fish']", "['logs', 'fish', 'ore']"],
    answer: 2,
    hint: "Sort by length; Python's sort is stable for ties.",
    explain: "'ore' has length 3 and goes first; 'logs' and 'fish' tie at 4 and keep their original order."
  },
  {
    id: "py-t5-09", lang: "python", tier: 5, topic: "enumerate", type: "fill",
    prompt: "Fill in the built-in that gives you both the index and the item. This prints 0 air, then 1 fire.",
    code: "for i, r in ____(['air', 'fire']):\n    print(i, r)",
    answer: ["enumerate"],
    hint: "It 'counts off' items as it loops.",
    explain: "enumerate() yields (index, item) pairs starting at 0."
  },
  {
    id: "py-t5-10", lang: "python", tier: 5, topic: "args", type: "fill",
    prompt: "Fill in the parameter name so the function collects any number of coin amounts.",
    code: "def total(*____):\n    return sum(coins)\n\nprint(total(5, 10, 20))",
    answer: ["coins"],
    hint: "Its name must match what the body uses.",
    explain: "*coins gathers all positional arguments into a tuple named coins, so sum(coins) is 35."
  },
  {
    id: "py-t5-11", lang: "python", tier: 5, topic: "zip", type: "output",
    prompt: "What does this print?",
    code: "names = ['a', 'b']\nlevels = [3, 7]\nprint(dict(zip(names, levels)))",
    answer: ["{'a': 3, 'b': 7}"],
    hint: "zip pairs items up by position.",
    explain: "zip makes ('a', 3) and ('b', 7), and dict() turns those pairs into key/value entries."
  },
  {
    id: "py-t5-12", lang: "python", tier: 5, topic: "sets", type: "mc",
    prompt: "What is a & b?",
    code: "a = {1, 2, 3}\nb = {2, 3, 4}",
    choices: ["{2, 3}", "{1, 2, 3, 4}", "{1, 4}", "{1}"],
    answer: 0,
    hint: "& is set intersection.",
    explain: "a & b keeps only the elements found in both sets: {2, 3}."
  }
]);

window.QUESTS.push(...[
  {
    id: "cook", name: "The Cook's Variables", lang: "python", npc: "cook", minLevel: 1, xp: 150,
    intro: "Oh dear, oh dear! It's the Duke's birthday and I haven't counted the ingredients for his cake. Could you help me keep track of everything with some Python variables?",
    outro: "Wonderful! Every egg and bucket of milk accounted for. The Duke will have the finest cake in all of Lumbridge!",
    steps: [
      {
        id: "q-cook-1", lang: "python", tier: 1, topic: "variables", type: "fill",
        prompt: "The cook has 3 eggs and 2 pots of flour. Fill in the operator so total is 5.",
        code: "eggs = 3\nflour = 2\ntotal = eggs ____ flour\nprint(total)",
        answer: ["+"],
        hint: "You're combining the two amounts.",
        explain: "eggs + flour is 3 + 2, which is 5."
      },
      {
        id: "q-cook-2", lang: "python", tier: 1, topic: "strings", type: "output",
        prompt: "What does the cook's shopping note print?",
        code: "milk = 'bucket of milk'\nprint('Need: ' + milk)",
        answer: ["Need: bucket of milk"],
        hint: "+ glues the two strings together exactly as written.",
        explain: "'Need: ' already ends with a space, so the result is 'Need: bucket of milk'."
      },
      {
        id: "q-cook-3", lang: "python", tier: 1, topic: "strings", type: "mc",
        prompt: "eggs = 4. Which line correctly prints Eggs: 4?",
        choices: ["print('Eggs: ' + eggs)", "print('Eggs: ' - eggs)", "print('Eggs: ' + str(eggs))", "print(Eggs: eggs)"],
        answer: 2,
        hint: "You can't add a string and a number directly.",
        explain: "str(eggs) converts 4 to '4' so it can be concatenated; 'Eggs: ' + 4 would raise a TypeError."
      }
    ]
  },
  {
    id: "sheep", name: "Sheep Shearer's Loops", lang: "python", npc: "farmer", minLevel: 3, xp: 350,
    intro: "Ahoy there! I'm Farmer Loopy, and I need 20 balls of wool before the frost sets in. Counting sheep one by one sends me to sleep - can you teach me to count them with loops?",
    outro: "Twenty balls of wool, counted and bundled! You've saved me a week of yawning. Here's your reward, friend.",
    steps: [
      {
        id: "q-sheep-1", lang: "python", tier: 2, topic: "lists", type: "mc",
        prompt: "Which sheep is flock[0]?",
        code: "flock = ['Dolly', 'Shaun', 'Fluffy']",
        choices: ["'Shaun'", "'Dolly'", "'Fluffy'", "IndexError"],
        answer: 1,
        hint: "Lists start counting at 0.",
        explain: "Index 0 is the first item in the list, 'Dolly'."
      },
      {
        id: "q-sheep-2", lang: "python", tier: 3, topic: "loops", type: "output",
        prompt: "Each sheep gives 5 balls of wool. What does this print?",
        code: "wool = 0\nfor sheep in ['Dolly', 'Shaun', 'Fluffy', 'Woolly']:\n    wool += 5\nprint(wool)",
        answer: ["20"],
        hint: "The loop body runs once per sheep.",
        explain: "There are 4 sheep, and 4 * 5 = 20."
      },
      {
        id: "q-sheep-3", lang: "python", tier: 3, topic: "range", type: "fill",
        prompt: "Fill in the blank so the loop runs exactly 20 times and prints 20.",
        code: "balls = 0\nfor i in ____(20):\n    balls += 1\nprint(balls)",
        answer: ["range"],
        hint: "This built-in produces a sequence of numbers.",
        explain: "range(20) yields 0 through 19 - that's 20 numbers, so the loop runs 20 times."
      },
      {
        id: "q-sheep-4", lang: "python", tier: 3, topic: "range", type: "output",
        prompt: "Farmer Loopy checks the wool pile every 5 balls. What does this print?",
        code: "print(list(range(0, 20, 5)))",
        answer: ["[0, 5, 10, 15]"],
        hint: "Start at 0, step by 5, stop before 20.",
        explain: "range(0, 20, 5) gives 0, 5, 10, 15 - 20 is excluded."
      }
    ]
  },
  {
    id: "goblin", name: "Goblin Diplomacy", lang: "python", npc: "goblin_general", minLevel: 8, xp: 900,
    intro: "Grubbah! Me General Bentnoze, and General Wartface say his armour colour best, but he WRONG! We keep colours in big Python dict. You help us sort it out, or there be WAR!",
    outro: "Hah! Dict all sorted, no more fighting... for today. You smart human. Take shiny reward!",
    steps: [
      {
        id: "q-goblin-1", lang: "python", tier: 3, topic: "dicts", type: "output",
        prompt: "What colour does General Wartface want?",
        code: "armour = {'Bentnoze': 'green', 'Wartface': 'red'}\nprint(armour['Wartface'])",
        answer: ["red"],
        hint: "Look up the value stored under the key 'Wartface'.",
        explain: "armour['Wartface'] returns the value paired with that key: 'red'."
      },
      {
        id: "q-goblin-2", lang: "python", tier: 3, topic: "dicts", type: "fill",
        prompt: "Bentnoze changes his mind. Fill in the blank to set his colour to 'blue'.",
        code: "armour = {'Bentnoze': 'green', 'Wartface': 'red'}\narmour['Bentnoze'] ____ 'blue'\nprint(armour)",
        answer: ["="],
        hint: "You're assigning, not comparing.",
        explain: "dict[key] = value replaces the value stored under an existing key."
      },
      {
        id: "q-goblin-3", lang: "python", tier: 4, topic: "dicts", type: "mc",
        prompt: "General Grubfoot isn't in the dict yet. What does this return?",
        code: "armour = {'Bentnoze': 'green', 'Wartface': 'red'}\narmour.get('Grubfoot', 'brown')",
        choices: ["None", "KeyError", "'green'", "'brown'"],
        answer: 3,
        hint: "The second argument to get() is a fallback.",
        explain: ".get() returns the default 'brown' because 'Grubfoot' isn't a key."
      },
      {
        id: "q-goblin-4", lang: "python", tier: 4, topic: "dicts", type: "output",
        prompt: "The generals read out the final list. What does this print?",
        code: "armour = {'Bentnoze': 'green', 'Wartface': 'red'}\nfor general, colour in armour.items():\n    print(f'{general} wants {colour}')",
        answer: ["Bentnoze wants green\nWartface wants red"],
        hint: "Dicts keep insertion order; items() gives key/value pairs.",
        explain: "items() yields each (key, value) pair in insertion order, and the f-string prints one line per general."
      }
    ]
  },
  {
    id: "dragon", name: "Recursion Slayer", lang: "python", npc: "guildmaster", minLevel: 12, xp: 2500,
    intro: "Elvarg-of-the-Stack has awoken, and only one who has mastered recursion can defeat her. Each of her heads calls another... prove your skill with functions, comprehensions and classes, and slay the beast!",
    outro: "You've done it! Elvarg-of-the-Stack has hit her base case at last. The Champions' Guild salutes you, slayer.",
    steps: [
      {
        id: "q-dragon-1", lang: "python", tier: 4, topic: "functions", type: "output",
        prompt: "Sharpen your blade. What does this print?",
        code: "def attack(power, bonus=2):\n    return power * bonus\n\nprint(attack(5) + attack(5, 3))",
        answer: ["25"],
        hint: "The first call uses the default bonus.",
        explain: "attack(5) is 5 * 2 = 10 and attack(5, 3) is 5 * 3 = 15, totalling 25."
      },
      {
        id: "q-dragon-2", lang: "python", tier: 5, topic: "recursion", type: "mc",
        prompt: "What must every recursive function have so it doesn't recurse forever?",
        choices: ["A global variable", "A base case", "A for loop", "A lambda"],
        answer: 1,
        hint: "It's the condition where the function stops calling itself.",
        explain: "A base case returns without recursing, so the chain of calls eventually ends."
      },
      {
        id: "q-dragon-3", lang: "python", tier: 5, topic: "recursion", type: "output",
        prompt: "Elvarg's stack grows. What does this print?",
        code: "def stack(n):\n    if n == 0:\n        return []\n    return stack(n - 1) + [n]\n\nprint(stack(3))",
        answer: ["[1, 2, 3]"],
        hint: "Work out stack(0), then stack(1), then stack(2)...",
        explain: "stack(0) is [], stack(1) is [1], stack(2) is [1, 2], and stack(3) is [1, 2, 3]."
      },
      {
        id: "q-dragon-4", lang: "python", tier: 5, topic: "comprehensions", type: "fill",
        prompt: "Halve each of Elvarg's scale strengths as whole numbers, so scales is [5, 10, 15].",
        code: "scales = [hp ____ 2 for hp in [10, 20, 30]]",
        answer: ["//"],
        hint: "Plain / would give floats like 5.0.",
        explain: "// is floor division, which keeps the results as ints: [5, 10, 15]."
      },
      {
        id: "q-dragon-5", lang: "python", tier: 5, topic: "classes", type: "output",
        prompt: "The final blow! What does this print?",
        code: "class Dragon:\n    def __init__(self, hp):\n        self.hp = hp\n\n    def is_slain(self):\n        return self.hp <= 0\n\nd = Dragon(30)\nd.hp -= 30\nprint(d.is_slain())",
        answer: ["True"],
        hint: "What is d.hp after the attack?",
        explain: "d.hp drops to 0, and 0 <= 0 is True, so is_slain() returns True."
      }
    ]
  }
]);
