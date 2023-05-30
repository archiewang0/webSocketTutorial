// import webpack from "webpack";
// import webpackDevMiddleware from "webpack-dev-middleware";
// import { Express } from "express";
import express, { Express } from "express";
import compression from "compression";
import path from "path";


export default function (app: Express) {
  // const config = require("../../webpack.config.js");
  
  // const compiler = webpack(config);

  console.log('跑 dev server') 

  // app.get("/", function (req, res, next) {
  //   res.redirect("/main/index.html");
  // });

  // app.get("/chatRoom", function (req, res, next) {
  //   res.redirect("/chatRoom/index.html");
  // });

  app.use(compression());
  app.use(express.static(path.resolve(__dirname, "./dist")));

  app.get("/", function (req, res, next) {
    // res.sendFile("/main/index.html");
    res.sendFile(path.resolve(__dirname, "./dist/main/index.html"));
  });

  app.get("/chatroom", function (req, res, next) {
    // res.sendFile("/chatroom/index.html");
    res.sendFile(path.resolve(__dirname, "./dist/chatroom/index.html"));
  });

  // app.use(
  //   webpackDevMiddleware(compiler, {
  //     publicPath: config.output.publicPath,
  //   })
  // );
}
