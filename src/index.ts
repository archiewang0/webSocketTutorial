import devServer from "./server/dev";
import prodServer from "./server/prod";
import express from "express";
import {Server as socketServer} from "socket.io"
import http from 'http' 

import UserService from "@/service/UserService"
const userService = new UserService()

const port = 3000;
const app = express();

const server = http.createServer(app)
// 這裡使用 socket.io的Server 並且將http建立的server 給帶入完成註冊
const io = new socketServer(server)

// 當網頁有A,B clinet 進入, A觸發 connection,產生自己的socket response
// B 進入 也產生自己的socket response
io.on('connection',(socket)=>{
  
  // 一開始送出 socket.id (userData的id也是取自於 socket.id) 當訊息跟userData一併送出時,可以用來判斷是否
  // client端的id 與 userData.id 一致,如果是的話就會知道"訊息是由該聊天室產生出來的"
  // 因為要給個字client端作使用, 所以使用 socket 則不用 io(io 會發送到全部client 這樣就沒有意義了)
  socket.emit('socket_id',socket.id)


  // io 以及 socket
  // io 是用可以與全部client 接獲或是發送訊息
  // socket 則是個別client 獨自接獲或是發送訊息

  
  // 這裡socket 會監聽從client傳來的事件, 這裡的socket 是由A,B client 連線後產生的
  // 所以A B 註冊的事件不會互相干擾
  socket.on('chat',(msg)=>{ 
    const userData = userService.getUser(socket.id)
    const time = new Date().toUTCString()
    // new Date().toUTCString() 會產出 國際標準時間 Sun, 12 Mar 2023 03:28:10 GMT (目前台灣時間是11:28 - 跟標準時間差 8小時)
    // 但之後帶入 new Date('Sun, 12 Mar 2023 03:28:10 GMT') 會產出 11:28 的正確時間
    // new Date 會依照地區來解析 UTC 的時間(台灣+8) (澳洲+10) ...
    
    // 送到全部client 的做法
    // io.emit('chatSendFront',userMsgData)

    if (userData){
      // 則io 的emit 則會讓所有連線的client接受到訊息 , 但如果希望是創立的空間來發送訊息
      // 就需要使用io.to 來限制某個發送訊息到某個獨立空見去

      // 將使用者的資料一併傳出去, 之後可以判別是誰在討論
      io.to(userData.roomName).emit('chat',{msg , userData , time})

      // 如果是使用 socket.to('...').emit() 的話會只有別人看得到,自己看不到
      // socket.to(userData.roomName).emit('chat',userMsgData)

    }
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

    // 建立獨立的空間 ,id即為roomName 
    // client端進入該空間, 會依據id來分配房間
    socket.join(userData.roomName)

    // 有了獨立空間,可以對獨立空間 emit 內容
    // 這裡發送給其他別人clinet, 自己看不到
    socket.to(userData.roomName).emit('join',`${userName} 加入了 ${roomId} 聊天室`)

    // io 則是對全部的有引用client的socket 做發送訊息的動作(emit)
    // io.emit('join',`${userName} 加入了 ${roomId} 聊天室`)
  })

  socket.on('disconnect',()=>{

    // 這裡都還是在 io.on('connection')的範圍內 所以都可以使用 “當client端連線產生屬於該 client的socket obj”
    const userData = userService.getUser(socket.id)
    const userName = userData?.userName
    if (userName){
      // io.emit('leave',`${userData.userName} 離開聊天室`)
      // io.emit 等於是對全域的範圍傳遞了訊息


      // broadcast 可能要再查一下 功用是如何 目前to可以達到一樣的狀態
      // socket.broadcast.to(userData.roomName).emit('leave',`${userData.userName} 離開 ${userData.roomName} 聊天室`)
      socket.to(userData.roomName).emit('leave',`${userData.userName} 離開 ${userData.roomName} 聊天室`)
    }
    userService.removeUser(socket.id)
  })


})

// 執行npm run dev本地開發 or 執行npm run start部署後啟動線上伺服器
if (process.env.NODE_ENV === "development") {
  devServer(app);
} else {
  prodServer(app);
}


// 這裡使用 https
server.listen(port, () => {
  console.log(`The application is running on port ${port}.`);
});
