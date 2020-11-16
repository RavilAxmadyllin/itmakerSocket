const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const formatMessage = require('./utils/message')
const {userJoin, getCurrent, removeUser, getRoomUsers} = require('./utils/user')
const botName = 'Admin bot'

app.get('/', (req, res) => {
    res.send('ws server')
})

io.on('connection', (socket) => {
    socket.on('joined-room', ({username, room}) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)

        // current user
        socket.to(user.room).emit('message', formatMessage(botName, `welcome to chat ${user.username}`))

        //user connect
        socket.to(user.room)
            .broadcast.emit('message', formatMessage(botName, `${user.username} join to chat`))

        // room info
        io.to(user.room).emit('room-users', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })
    socket.on('sent-message', (msg) => {
        const user = getCurrent(socket.id)
        io.to(user.room).emit('message', formatMessage(user.name, msg))
    })
    socket.on('disconnect', () => {
       const user = userLeave(socket.id)
        if(user) {
            io.to(user.room).emit(formatMessage(botName, 'message', `${user.username} has left chat`))

            // room info
            io.to(user.room).emit('room-users', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }


    })
})

const PORT = process.env.PORT || 3010
http.listen(PORT, () => console.log(`Server running on port ${PORT}`))
