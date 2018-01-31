module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-1']
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader'
      },
      {
        test: /\.css$/,
        loader: 'css-loader'
      },
      { 
        test: /\.less$/, 
        loader: "style-loader!css-loader!less-loader" 
      },
      { 
        test: /\\.scss$/, 
        use: ['style-loader', 'css-loader', 'scss-loader'] 
      },
      { 
        test: /\.gif$/, 
        loader: "url-loader?mimetype=image/png" 
      },
      { 
        test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, 
        loader: "url-loader?mimetype=application/font-woff" 
      },
      { 
        test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/,
        loader: "file-loader?name=[name].[ext]" 
      }
    ]
  },
  resolve: {
    extensions: [ '.js', '.jsx']
  },
  devServer: {
    inline: false,
    historyApiFallback: true,
    contentBase: './'
  },
  node : {
    fs : 'empty',
    child_process: 'empty'
  }
};
