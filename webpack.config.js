const webpack = require('webpack');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootDir = path.resolve(__dirname);
const srcDir = path.resolve(__dirname, 'app/src');
const demoDir = path.resolve(__dirname, 'demo');
const nodeModDir = path.resolve(__dirname, 'node_modules');

const config = (env) => {
  const prod = env.prod === 'true';

  return {
    entry: {
      bundle: ['@babel/polyfill', path.resolve(srcDir, 'index.jsx')],
    },
    output: {
      path: demoDir,
      // cannot use contenthash with runtime
      filename: chunkData => `[name].[${chunkData.chunk.name === 'runtime' ? 'hash' : 'contenthash'}]${prod
          && '.min'}.js`,
      chunkFilename: `[name].[contenthash]${prod && '.min'}.js`,
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
          use: [prod ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
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
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 1,
          },
        },
      },
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
        }),
        new OptimizeCssAssetsPlugin(),
      ],
    },
    plugins: [
      new CleanWebpackPlugin([demoDir]),
      new webpack.optimize.OccurrenceOrderPlugin(),
      prod ? new webpack.HashedModuleIdsPlugin() : new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin({
        path: demoDir,
        filename: `[name].styles.[contenthash]${prod && '.min'}.css`,
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(srcDir, 'index.html'),
      }),
    ],
  };
};

module.exports = config;
