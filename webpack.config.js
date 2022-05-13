
// webpack.config.js
const Dotenv = require('dotenv-webpack');
const path = require("path");
const { sources } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')

let mode = "development";
if (process.env.NODE_ENV === "production") {
  mode = "production"
};

module.exports = {
  entry: {
    
    main:"./src/scripts/index.js",
    help:"./src/scripts/help.js" 
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
     {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    {
      test: /\.m?js$/,
      exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new Dotenv( {systemvars: true}),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname,"./src/index.html"),
      chunks: ["main"],
      inject: false
    }),
    new HtmlWebpackPlugin({
      filename: "help.html", 
      template:  path.resolve(__dirname,"./src/help/index.html"),
      chunks: ["help"],
      inject: false
    })
  ],

  devServer: {
    static: "./dist",
  },

  mode: mode,
  devtool: false,

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  }

};