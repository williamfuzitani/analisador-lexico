const readline = require("readline")
const fs = require("fs")

let stream = fs.createWriteStream("output.txt")
let lexemas = []
let line_no = 0;

// Read Line
let rl = readline.createInterface({
  input: fs.createReadStream("Factorial.java")
})

rl.on("line", function(line) {
  line_no++;
  // console.log(line)
  console.log(tokenizer(line))
})

rl.on('close', (line) => {
  console.log(line)
  console.log('done reading file')
})
//

// Tokenizer
function tokenizer(input) {
  let current = 0
  let tokens = []

  let IDENTIFICADOR = /[a-zA-Z_][a-zA-Z0-9_]*/
  let LITERAL = /[0-9]+/
  let WHITESPACE = /\s/

  let TiposDeDados = ['byte', 'short', 'int', 'long', 'float', 'double', 'char', 'boolean', 'String']
  let PalavraReservada = ['this', 'class', 'public', 'static', 'void', 'System.out.println', 'new', 'if', 'else', 'then', 'return', 'byte', 'short', 'int', 'long', 'float', 'double', 'char', 'boolean', 'String']
  let SimboloSimples = ['=', ';', '*', '+', '-', '>', '<', '(', ')', '[', ']', '{', '}']
  let SimboloComposto = ['>=', '<=', '==', '&&', '||', '!=']

  while (current < input.length) {
    let char = input[current]

    // Checa SIMBOLO SIMPLES
    if (SimboloSimples.includes(char)) {
      tokens.push({ type: 'SS', value: char })
      current++
      continue
    }

    // Checa LITERAL
    if (LITERAL.test(char)) {
      let value = ''
      while (LITERAL.test(char)) {
        value += char
        char = input[++current]
      }
      tokens.push({ type: 'LIT', value: value })
      continue
    }

    // Checa String
    if (char === '"') {
      let value = ''
      char = input[++current]

      while (char !== '"') {
        value += char
        char = input[++current]
      }
      char = input[++current]

      tokens.push({ type: 'STRING LIT', value: value })
      continue
    }

    // Ignora espaço em branco
    if (WHITESPACE.test(char)) {
      current++
      continue
    }

    // Checa IDENTIFICADOR
    if (IDENTIFICADOR.test(char)) {
      let value = ''
      while (IDENTIFICADOR.test(char)) {
        value += char
        char = input[++current]
      }

      // Checa se é uma PalavraReservada
      const PR_REG = new RegExp(PalavraReservada.join("|"))
      PR_REG.test(value) ? tokens.push({ type: 'PR', value: value }) : tokens.push({ type: 'ID', value: value })
      continue
    }
  }
  return tokens
  // stream.write(input)
  // console.log(input)
  // console.log(line)
}
