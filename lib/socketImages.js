const { Review, validate } = require('../models/review');
const commitImages = require('./commitImages');

module.exports = (socket) => {
  socket.on('join', function(roomId) {
    console.log('socket join', roomId);
    socket.join(roomId);
  });

  socket.on('leave', function(roomId) {
    console.log('socket leave', roomId);
    socket.leave(roomId);
  });
  
  socket.on('add', async ({roomId, data}) => {
    // console.log( roomId );
    // console.log( data );
    const regex = /<img src\s*=\s*\\*"(.+?)\\*">/g
    let images = [];
    if (regex) {
      const matching = data.match(regex);
      if (matching) {
        images = matching.map(el => {
          return el.match(/\"(.+?)\"/g)[0].replace(/"/g,"");
        });
      }
    }
    let review = await Review.findOne({'_id':roomId});
    // review["rating"] = req.body.rating;
    review['tempContent'] = data;
    review['images'].addToSet(...images);
    review.save();
  });
  
  socket.on('commit', async (roomId) => {
    console.log( 'commit' );
    let review = await Review.findOne({'_id':roomId});

    if (review['images']) {
      review['images'] = review['images'].reduce( ( filtered, el ) => {
        let imgOption = 'del';
        let newEl = el.split('/');
        if (newEl[2] != roomId) {
          newEl.splice(2,1,roomId)
        } 
        newEl = newEl.join('/');
        if ( review['tempContent'] !== review['tempContent'].replace(el, newEl) ){
          imgOption = 'copy';
          review['tempContent'] = review['tempContent'].replace(el, newEl);
        } 
        try {
          if ( review['tempContent'].match(/<img src\s*=\s*\\*"(.+?)\\*">/g).some( (el) => el.match(newEl) )) {
            if (newEl == el) imgOption = 'maintain';
          }
        } catch(err) {
          console.error(err);
          imgOption = 'del';
        }
        const isExist = commitImages({ reviewId: roomId, prevImgPath: el, imgOption, nextImgPath: newEl });
        console.log( isExist );
        if (isExist) {
          filtered.push(newEl);
        }
        return filtered;
      }, []);
    }

    console.log( review['images'] );
    review['content'] = review['tempContent'];
    review['isCommit'] = true;
    review.save();
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
}