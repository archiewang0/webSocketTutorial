import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import { Express } from "express";

export default function (app: Express) {
  const config = require("../../webpack.config.js");
  
  const compiler = webpack(config);

  console.log('跑 dev server')

  app.get("/main", function (req, res, next) {
    res.redirect("/main/index.html");
  });

  app.get("/chatRoom", function (req, res, next) {
    res.redirect("/chatRoom/index.html");
  });

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
    })
  );
}
