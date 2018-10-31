const webpack = require('webpack');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootDir = path.resolve(__dirname);
const srcDir = path.resolve(__dirname, 'app/src');
const demoDir = path.resolve(__dirname, 'demo');
const nodeModDir = path.resolve(__dirname, 'node_modules');

const config = {
  entry: {
    bundle: ['@babel/polyfill', path.resolve(srcDir, 'index.jsx')],
  },
  output: {
    path: demoDir,
    filename: '[name].[hash].min.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    hotOnly: true,
  },
  resolve: {
    modules: [rootDir, nodeModDir],
    extensions: ['.js', '.jsx'],
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.(jsx?)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(css)$/,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 50000,
              name: 'Images/[name].[ext]',
              publicPath: '/',
            },
          },
          'image-webpack-loader',
        ],
      },
      {
        test: /\.ico$/,
        use: 'file-loader',
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
    ],
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
        },
      },
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: true,
        },
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin([demoDir]),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      path: demoDir,
      filename: 'styles.[hash].css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(srcDir, 'index.html'),
    }),
  ],
};

module.exports = config;
