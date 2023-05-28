const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const { HotModuleReplacementPlugin } = require("webpack");
const path = require("path");

const entries = {
  main: ["./src/client/pages/main/index.ts"],
  chatRoom: ["./src/client/pages/chatRoom/index.ts"],
};
const templatesNames = Object.keys(entries);
const bundleTemplateConfig = () => {
  return templatesNames.map((name) => {
    return new HtmlWebpackPlugin({
      filename: `${name}/index.html`,
      chunks: [name],
      template: `./src/client/pages/${name}/index.html`,
    });
  });
};

module.exports = {
  entry: entries,
  mode: process.env.NODE_ENV,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]/index.[hash].js",
    clean: true,
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
          },
        ],
      },
      {
        test: /\.gif/,
        type: "asset/resource",
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfigClient.json",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    ...bundleTemplateConfig(),
    // new HtmlWebpackPlugin({
    //   filename: "main/index.html",
    //   chunks: ["main"],
    //   template: "./src/client/pages/main/index.html",
    // }),
    // new HtmlWebpackPlugin({
    //   filename: "chatRoom/index.html",
    //   chunks: ["chatRoom"],
    //   template: "./src/client/pages/chatRoom/index.html",
    // }),
    new MiniCssExtractPlugin({
      filename: "[name]/index.[hash].css",
    }),
    new CompressionPlugin(),
    new HotModuleReplacementPlugin(),
  ],
  // devtool: "inline-source-map",
  devServer: {
    static: "./dist",
  },
};
