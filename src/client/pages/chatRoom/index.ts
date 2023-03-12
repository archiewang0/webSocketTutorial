import "./index.css";
import { name } from "@/utils";
import {io} from 'socket.io-client';
import { I_UserData } from "@/service/UserService"

const url = new URL(location.href)
const userName = url.searchParams.get('user_name')
const roomId = url.searchParams.get('room_id')
if( !userName || !roomId){
    location.href = '/main/main.html'
}

// 將io 的聆聽事件給取出來
// 這裡也是跟backend 做連線 
const clientIo = io()

// 在前端的部分 溝通都使用使用 io() 來進行接收資料以及傳遞資料
// clientIo.emit('join',`${userName} 加入聊天室`)
clientIo.emit('join', {userName , roomId})
// 當離開該頁面時 client io 就會自動斷線 自動emit('disconnect')的


const textInput = document.getElementById('textInput') as HTMLInputElement
const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement
const chatBord = document.getElementById('chatBord') as HTMLDivElement
const roomName = document.getElementById('roomName') as HTMLParagraphElement

roomName.innerHTML = roomId || " - "

type I_userSocketID = string|null
let userSocketID:I_userSocketID = null


submitBtn.addEventListener('click',()=>{
    if (textInput.value) {
        // 送給後端內容
        // 這裡發送給後端 後端也需要接住
        clientIo.emit('chat',textInput.value)
    }
})

// ts-node 可以讓 ts直接執行出來
// console.log("client side chatroom page", name);



// 給予發生的"事件",以及處裡的function
// ex: 發生join事件(由後段emit 了join的訊息, 也可能是別的事件)
clientIo.on('join',(msg)=>{
    joinMsgHandler(msg)
})

// 這裡是接收後端發送的內容
clientIo.on('chat',(data: {msg:string, userData: I_UserData , time: string })=>{
    const {msg, userData , time} = data
    msgHandler(msg, userData, userSocketID , time)
})

clientIo.on('leave',(msg)=>{
    leaveHandler(msg)
})

clientIo.on('socket_id',(id:string)=>{
    userSocketID = id
})


// io join
function msgHandler(msg:string, userData:I_UserData , socketID:I_userSocketID ,time:string){
    const {userName,id} = userData
    const divBox = document.createElement('div')
    const localTime = new Date(time)

    if(socketID === id){
        divBox.classList.add('flex','justify-end','mb-4','items-end')
        divBox.innerHTML = `
            <p class="text-xs text-gray-700 mr-4">${localTime.getMinutes()}:${localTime.getSeconds()}</p>
    
            <div>
                <p class="text-xs text-white mb-1 text-right">${userName}</p>
                <p
                    class="mx-w-[50%] break-all bg-white px-4 py-2 rounded-bl-full rounded-br-full rounded-tl-full"
                >
                   ${msg}
                </p>
            </div>
        `
    } else {
        divBox.classList.add('flex','justify-start','mb-4','items-end')
        divBox.innerHTML = `
            <div>
                <p class="text-xs text-gray-700 mb-1">${userName}</p>
                <p
                    class="mx-w-[50%] break-all bg-gray-800 px-4 py-2 rounded-tr-full rounded-br-full rounded-bl-full text-white"
                >
                    ${msg}
                </p>
            </div>
            <p class="px-2 text-xs text-gray-700 mr-4">${localTime.getMinutes()}:${localTime.getSeconds()}</p>
        `
    }

   
    chatBord.appendChild(divBox)
    textInput.value = ""
    chatBord.scrollTop = chatBord.scrollHeight
}

function joinMsgHandler(msg:string){
    const divBox = document.createElement('div')
    divBox.classList.add('flex','justify-center','mb-4','items-center')
    divBox.innerHTML = `
        <p class="text-gray-700 text-sm">${msg}</p>
    `
    chatBord.appendChild(divBox)
    chatBord.scrollTop = chatBord.scrollHeight
}

function leaveHandler(msg:string){
    const divBox = document.createElement('div')
    divBox.classList.add('flex','justify-center','mb-4','items-center')
    divBox.innerHTML = `
        <p class="text-gray-700 text-sm">${msg}</p>
    `
    chatBord.appendChild(divBox)
    chatBord.scrollTop = chatBord.scrollHeight
}