var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var index = path.join(__dirname, './app/scripts/main.js');

module.exports = {
  entry: [
    index
  ],

  devtool: 'source-map',
  output: {
    path: 'dist',
    filename: 'bundle.js',
    publicPath: '/dist'
  },
  plugins: [
    /*
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      mangle: true,
      compress: {
        unsafe: true
      }
    }),
    */
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'app/index.html',
      inject: true
    }),
    new ExtractTextPlugin('style.css')
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/,
        include: __dirname
      },
      {
        test: /\.(frag|vert)/,
        loaders: ['raw-loader'],
      },
      {
        test: /\.css?$/,
        loaders: ['null'],
        include: __dirname
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
      }
    ]
  }
};
