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
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: true,
      compressor: {
        warnings: false,
        screw_ie8: true
      },
      output: {
        comments: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer()
        ]
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],

  devtool: 'source-map'
};

module.exports = config;
