const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './frontend/src/index.js',
    output: {
        filename: 'bundle.[fullhash].js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin({
            template: './frontend/src/index.html',
        }),
    ],
    resolve: {
        modules: [__dirname, 'frontend', 'node_modules'],   // what directories webpack checks for modules
        extensions: ['*', '.js', '.jsx', '.tsx', '.ts']     // enables users to leave off listed extensions when importing
                                                            // i.e. import App from './App' -- instead of './App.js'
    },
    module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,    // exclude this module
            loader: require.resolve("babel-loader"),
          },
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader"],
          },
          {
            test: /\.(png|svg|jpg|gif)$/,
            use: ["file-loader"],
          },
          {
            test: /\.svg$/,
            use: [
              {
                loader: 'svg-url-loader',
                options: {
                  limit: 10000,
                },
              },
            ],
          },
        ],
      },
    };

/*

LOADERS - webpack can only understand JavaScript and JSON files by default.
Loaders allow webpack to process other types of files and convert them into
valid modules that can be used by your application.

test - identifies which file or files should be transformed
use - indicates which loader should be used to do the transforming

All loaders must be installed through npm

*/