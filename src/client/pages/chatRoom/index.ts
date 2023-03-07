import "./index.css";
import { name } from "@/utils";
import {io} from 'socket.io-client';

const url = new URL(location.href)
const userName = url.searchParams.get('user_name')
const roomId = url.searchParams.get('room_id')

if( !userName || !roomId){
    location.href = '/main/main.html'
}

// 將io 的聆聽事件給取出來
const clientIo = io()


const textInput = document.getElementById('textInput') as HTMLInputElement
const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement

submitBtn.addEventListener('click',()=>{
    if (textInput.value) {
        // 送給後端內容
        clientIo.emit('chat',textInput.value)
        console.log(textInput.value)
    }

})

// ts-node 可以讓 ts直接執行出來
console.log("client side chatroom page", name);



// 給予發生的"事件",以及處裡的function
// ex: 發生join事件(由後段emit 了join的訊息, 也可能是別的事件)
clientIo.on('join',(msg)=>{
    console.log('msg: ',msg)
})