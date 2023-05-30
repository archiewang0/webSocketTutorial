import express, { Express } from "express";
import compression from "compression";
import path from "path";

export default function (app: Express) {
  console.log('跑 prod server')

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
}
