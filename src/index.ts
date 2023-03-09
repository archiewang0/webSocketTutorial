import devServer from "./server/dev";
import prodServer from "./server/prod";
import express from "express";
import {Server as socketServer} from "socket.io" /*1*/
import http from 'http' /*2*/

import { name } from "@/utils";
import UserService from "@/service/UserService"
const userService = new UserService()

const port = 3000;
const app = express();

const server = http.createServer(app)
// 這裡使用 socket.io的Server 並且將http建立的server 給帶入完成註冊
const io = new socketServer(server)

// 當連線時會發送訊息 
io.on('connection',(socket)=>{
  // socket的話則是負責接收資料

  // 這裡是接收“前端”發送的內容
  // 看到on 就是接收的意思
  socket.on('chatSendBack',(msg)=>{ 
    // 這裡是發送給"後端“的內容
    io.emit('chatSendFront',msg)
    // io 比較像是共通的橋樑? 這樣io 發出去的 所有user都可以接到

    // 由client端送過來的資料 只需要小橋樑, 只要client本身過來, 其他client也不用知道
  })

  // 發出 join 的訊息 裡面也會有相關的內容
  socket.on('join',({userName , roomId})=>{
    // 使用calss 的架構來產生資料
    const userData = userService.createUserData(
      socket.id, // 當io. connection 連線時產生的 socket 會給予 user連線的id
      userName,
      roomId
    )
    userService.addUser(userData)
    io.emit('join',`${userName} 加入了 ${roomId} 聊天室`)
  })

  socket.on('disconnect',()=>{

    // 這裡都還是在 io.on('connection')的範圍內 所以都可以使用 “當client端連線產生屬於該 client的socket obj”
    const userData = userService.getUser(socket.id)
    const userName = userData?.userName
    if (userName){
      io.emit('leave',`${userData.userName} 離開聊天室`)
    }
  })
})

// 執行npm run dev本地開發 or 執行npm run start部署後啟動線上伺服器
if (process.env.NODE_ENV === "development") {
  devServer(app);
} else {
  prodServer(app);
}

// console.log("server side", name);

// 這裡使用 https
server.listen(port, () => {
  console.log(`The application is running on port ${port}.`);
});
