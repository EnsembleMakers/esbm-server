module.exports = (socket) => {
  socket.on('join', function(room) {
    console.log('socket join', room)
    socket.join(room);
  });
  
  socket.on('add', (id, images) => {
    console.log( id )
    console.log( images );
  });

  socket.on('commit', () => {
    console.log( 'commit' );
  })
}