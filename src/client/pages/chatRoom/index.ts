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
const chatBord = document.getElementById('chatBord') as HTMLDivElement
const roomName = document.getElementById('roomName') as HTMLParagraphElement

roomName.innerHTML = roomId || " - "

submitBtn.addEventListener('click',()=>{
    if (textInput.value) {
        // 送給後端內容
        // 這裡發送給後端 後端也需要接住
        clientIo.emit('chatSendBack',textInput.value)
        console.log('前端',textInput.value)
    }

})

// ts-node 可以讓 ts直接執行出來
console.log("client side chatroom page", name);

// 給予發生的"事件",以及處裡的function
// ex: 發生join事件(由後段emit 了join的訊息, 也可能是別的事件)
clientIo.on('join',(msg)=>{console.log('msg: ',msg)})

// 這裡是接收後端發送的內容
clientIo.on('chatSendFront',(msg)=>{
    console.log('從後端送來',msg)
    msgHandler(msg)
})


function msgHandler(msg:string){
    const divBox = document.createElement('div')
    divBox.classList.add('flex','justify-end','mb-4','items-end')
    divBox.innerHTML = `
        <p class="text-xs text-gray-700 mr-4">00:00</p>

        <div>
            <p class="text-xs text-white mb-1 text-right">Bruce</p>
            <p
                class="mx-w-[50%] break-all bg-white px-4 py-2 rounded-bl-full rounded-br-full rounded-tl-full"
            >
               ${msg}
            </p>
        </div>
    `
    chatBord.appendChild(divBox)
    textInput.value = ""
    chatBord.scrollTop = chatBord.scrollHeight
}