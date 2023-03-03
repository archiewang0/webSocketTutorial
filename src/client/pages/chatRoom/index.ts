import "./index.css";
import { name } from "@/utils";
import {io} from 'socket.io-client';


// ts-node 可以讓 ts直接執行出來
console.log("client side chatroom page", name);

// 將io 的聆聽事件給取出來
const clientIo = io()
// 給予發生的"事件",以及處裡的function
// ex: 發生join事件(事件是由後端來定的, 前端需要符合該後端)
clientIo.on('join',(msg)=>{
    console.log('msg: ',msg)
})