import express, { Express } from "express";
import compression from "compression";
import path from "path";

export default function (app: Express) {
  console.log('跑 prod server')

  app.use(compression());
  app.use(express.static(path.resolve(__dirname, "../../dist")));

  app.get("/main", function (req, res, next) {
    res.sendFile("/main/index.html");
  });

  app.get("/chatroom", function (req, res, next) {
    res.sendFile("/chatroom/index.html");
  });
}
