type I_UserData = {
    id: string
    userName: string
    roomName: string
}

export default class UserService{
    private UserData: Map<string, I_UserData>
    constructor(){
        this.UserData = new Map()
    }

    addUser(data:I_UserData){
        this.UserData.set(data.id , data)
    }

    removeUser(id:string){
        if( this.UserData.has(id) ){
            this.UserData.delete(id)
        } else{
            console.error(`data 沒有 ${id} 的資料,無法移除`)
        }
    }

    getUser(id:string){
        const data =  this.UserData.get(id)
        if(data){
            return data
        } else {
            console.error(`data 沒有 ${id} 的資料,無法查看`)
        }
        return null
    }

    createUserData(id:string,userName:string,roomName:string):I_UserData{
        return {
            id,
            userName,
            roomName
        }
    }
}