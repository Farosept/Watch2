class Users {
    constructor(){
        this.users = [];
    }
    addUser(id, room , name, source, host){
        this.users.push({id,room,name, source, host});
    }
    removeUser (id) {
        var user = this.getUser(id);
    
        if (user) {
          this.users = this.users.filter((user) => user.id !== id); // возвращаем всех юзеров, кроме совпавшего по ид
        }
    
        return user;
      }
    getUser(id){
        this.users.find((user)=>{
           return user.id === id;
        });
    }
    getUserList (room) {
        var users = this.users.filter((user) => user.room === room); // ищем всех юзеров в определенной комнате
        var namesArray = users.map((user) => user.name); // получаем массив имен
    
        return namesArray;
      }
    getHostInRoom(room){
        var users = this.users.filter((user) => user.room === room); // ищем всех юзеров в определенной комнате
        var host = users.filter((user)=>user.host == true);
        return host[0];
    }
}

module.exports = {Users};