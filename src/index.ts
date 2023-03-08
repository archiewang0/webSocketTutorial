import devServer from "./server/dev";
import prodServer from "./server/prod";
import express from "express";
import {Server as socketServer} from "socket.io" /*1*/
import http from 'http' /*2*/

import { name } from "@/utils";
import UserService from "@/service/UserService"

const port = 3000;
const app = express();

const server = http.createServer(app)
// 這裡使用 socket.io的Server 並且將http建立的server 給帶入完成註冊
const io = new socketServer(server)

// 當連線時會發送訊息 
io.on('connection',(socket)=>{
  // 發出 join 的訊息 裡面也會有相關的內容
  socket.emit('join','當連線時會發出個訊息')

  // 這裡是接收“前端”發送的內容
  // 看到on 就是接收的意思
  socket.on('chatSendBack',(msg)=>{ 
    // 這裡是發送給"後端“的內容
    socket.emit('chatSendFront',msg)
  })
})

// 執行npm run dev本地開發 or 執行npm run start部署後啟動線上伺服器
if (process.env.NODE_ENV === "development") {
  devServer(app);
} else {
  prodServer(app);
}

console.log("server side", name);

// 這裡使用 https
server.listen(port, () => {
  console.log(`The application is running on port ${port}.`);
});
