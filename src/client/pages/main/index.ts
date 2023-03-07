import "./index.css";
import { name } from "@/utils";

console.log("client side main page", name);
const nameInputEl = document.getElementById('nameInput') as HTMLInputElement
const roomSelect = document.getElementById('roomSelect') as HTMLSelectElement
const startBtn = document.getElementById('startBtn') as HTMLButtonElement

startBtn.addEventListener('click',()=>{
    const nameValue = nameInputEl.value
    const roomId = roomSelect.value
    console.log({nameValue , roomId})
    location.href = `/chatRoom/chatRoom.html?user_name=${nameValue}&room_id=${roomId}`
})