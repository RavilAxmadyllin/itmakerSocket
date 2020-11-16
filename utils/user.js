const users = []

const userJoin = (id, username, room) => {
    const user = {id, username, room}
    users.push(user)
    return user
}
const getCurrent = (id) => users.find(u => u.id === id)
const userLeave = (id) => {
    const index = users.findIndex(u => u.id !== id)
    if(index !== -1) return users.splice(index, 1)[0]
}
const getRoomUsers = (room) => users.filter(u => u.room === room)

module.export = {
    userJoin,
    getCurrent,
    userLeave,
    getRoomUsers
}
