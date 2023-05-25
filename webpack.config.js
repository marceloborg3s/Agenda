const path = require('path'); // CommonJS

module.exports = {
  mode: 'production', // development -> arquivo grande || production -> arquivo encurtado
  entry: './frontend/main.js',
  output: {
    path: path.resolve(__dirname, 'public', 'assets', 'js'), // path.resolve(_dirname)
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      exclude: /node_modules/, // Faz com que o webpack não analise a pasta do node_module, pois tem bastante arquivo nela
      test: /\.js$/, // Para testar qual arquivo vai ser analisado e forme o bundle com estes arquivos
      // $ -> indica pra expressão regular que oarquivo termina com .js
      // \ -> para escapar o ".", pois ele tem uma função na expressão literal e queremos que esse ponto escape na função
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env']
        } 
      }
    }, {
      test:  /\.css$/,
      use: ['style-loader', 'css-loader']
    }] 
  },
  devtool: 'source-map' // Mapeamento pra saber de onde o erro esta vindo, mostrando o arquivo original
};