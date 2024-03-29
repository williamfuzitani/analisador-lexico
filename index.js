const fs = require("fs")

let arquivo = process.argv[2]
handleFile(arquivo)

function handleFile(input) {
  let file = input
  let stream = fs.createWriteStream("output.txt")
  let token
  
  // Read File
  fs.readFile(file, 'utf-8', (err, data) => {
    if (err) throw err
    token = tokenizer(data)

    // Write File
    token.forEach((item) => {
      stream.write(`<${item.type}, '${item.value}'>`)
    })
  })
}

function tokenizer(str) {
  const regex = /".*?"|System.out.println|[a-zA-Z_][a-zA-Z0-9_]*|[0-9]+|%=|\/=|\*=|\+=|-=|\++|--|>=|<=|>>|<<|&&|==|!=|\.|\,|\;|\+|\-|\=|\*|\/|\{|\}|\(|\)|\<|\>|\[|\]|\%|\||\!/gm;

  let m;
  let tokens = []
  
  let TiposDeDados = ['byte', 'short', 'int', 'long', 'float', 'double', 'char', 'boolean', 'String']
  let PalavraReservada = ['main', 'this', 'length', 'static', 'extends', 'class', 'public', 'true', 'false', 'static', 'void', 'System.out.println', 'new', 'if', 'else', 'then', 'return', 'byte', 'short', 'int', 'long', 'float', 'double', 'char', 'boolean', 'String', 'while']
  let SimboloSimples = ['=', ';', '*', '+', '-', '>', '<', '(', ')', '[', ']', '{', '}', '.', '!', '/', ',', '%', '|']
  let SimboloComposto = ['%=', '/=', '*=', '+=', '-=', '>=', '<=', '==', '&&', '||', '!=', '>>', '<<']
  let LITERAL = /[0-9]+/
  let LITERAL_STRING = /".*?"/
  var contador = 0
  // Remove os comentários e testa os matchs
  while ((m = regex.exec(str.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1'))) !== null) {
      if (m.index === regex.lastIndex) {
          regex.lastIndex++;
      }
      
      m.forEach((match) => {
       // Checa se é TipoDeDado
       if (TiposDeDados.includes(match)) {
		   contador++
           tokens.push({id: contador, type: 'PR', value: match })
       // Checa se é PalavraReservada 
       } else if (PalavraReservada.includes(match)) {
           contador++           
		   tokens.push({id: contador, type: 'PR', value: match })
       // Checa se é SimboloSimples     
       } else if (SimboloSimples.includes(match)) {
          contador++          
		  tokens.push({id: contador, type: 'SS', value: match })
       // Checa se é SimboloComposto     
       } else if (SimboloComposto.includes(match)) {
          contador++          
		  tokens.push({id: contador, type: 'SC', value: match})
       // Checa se é LITERAL     
       } else if (LITERAL.test(match)) {
		  contador++          
		  tokens.push({id: contador, type: 'LIT', value: match})
       // Checa se é STRING     
       } else if (LITERAL_STRING.test(match)) {
		  contador++          
		  tokens.push({id: contador, type: 'STRING', value: match })
       // Se não for nenhum dos outros então deve ser um Identificador     
       } else {
            tokens.push({id: contador, type: 'ID', value: match })
       }
      })
  }
  console.log(tokens)
  return tokens
}