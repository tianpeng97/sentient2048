const prisma = require('../models/prisma')

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected')

    socket.on('disconnect', () => {
      console.log('A user disconnected')
    })

    // TODO only update for top 10 players
    socket.on('update', () => {
      //   const isTop = prisma.top_10({
      //     id: id,
      //   })
      //   if (isTop) {
      io.emit('update')
      //   }
    })
  })
}
