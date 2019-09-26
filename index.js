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
  const regex = /".*?"|this.|System.out.println|[a-zA-Z_][a-zA-Z0-9_]*|[0-9]+|\{|\}|\(|\)|\<|\=|\-|\*|\;|\[|\]|\.|\+/gm;

  let m;
  let tokens = []
  
  let TiposDeDados = ['byte', 'short', 'int', 'long', 'float', 'double', 'char', 'boolean', 'String']
  let PalavraReservada = ['main', 'this.', 'class', 'public', 'static', 'void', 'System.out.println', 'new', 'if', 'else', 'then', 'return', 'byte', 'short', 'int', 'long', 'float', 'double', 'char', 'boolean', 'String']
  let SimboloSimples = ['=', ';', '*', '+', '-', '>', '<', '(', ')', '[', ']', '{', '}']
  let SimboloComposto = ['>=', '<=', '==', '&&', '||', '!=']
  let LITERAL = /[0-9]+/
  let LITERAL_STRING = /".*?"/
  
  // Remove os comentários e testa os matchs
  while ((m = regex.exec(str.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1'))) !== null) {
      if (m.index === regex.lastIndex) {
          regex.lastIndex++;
      }
      
      m.forEach((match) => {
       // Checa se é TipoDeDado
       if (TiposDeDados.includes(match)) {
            tokens.push({ type: 'PR', value: match })
       // Checa se é PalavraReservada 
       } else if (PalavraReservada.includes(match)) {
            tokens.push({ type: 'PR', value: match })
       // Checa se é SimboloSimples     
       } else if (SimboloSimples.includes(match)) {
            tokens.push({ type: 'SS', value: match })
       // Checa se é SimboloComposto     
       } else if (SimboloComposto.includes(match)) {
            tokens.push({ type: 'SC', value: match})
       // Checa se é LITERAL     
       } else if (LITERAL.test(match)) {
            tokens.push({ type: 'LIT', value: match})
       // Checa se é STRING     
       } else if (LITERAL_STRING.test(match)) {
            tokens.push({ type: 'STRING', value: match })
       // Se não for nenhum dos outros então deve ser um Identificador     
       } else {
            tokens.push({ type: 'ID', value: match })
       }
      })
  }
  return tokens
}