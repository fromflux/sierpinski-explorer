const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const config = {
  entry: path.resolve(__dirname, 'src', 'index.jsx'),

  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: path.resolve(__dirname, 'node_modules')
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]--[hash:base64:8]'
            }
          },
          'postcss-loader'
        ]
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer()
        ]
      }
    })
  ],

  devtool: 'eval',

  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, 'public')
  }
};

module.exports = config;
