const { Review, validate } = require('../models/review');
const uuidv4 = require('uuid/v4');
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
  
  socket.on('add', async ({roomId, name, data}) => {
    const regex = /<img src\s*=\s*\\*"(.+?)\\*">/g
    let images = [];
    // editor
    if (regex && name=='tempContent') {
      const matching = data.match(regex);
      if(matching) {
        images = matching.map(el => {
          return el.match(/\"(.+?)\"/g)[0].replace(/"/g,"");
        });
      }
    }
    
    let review = await Review.findOne({'_id':roomId});
    if (name == 'tempCoverImg') {
      review[name] = new Buffer.from(data.base64, 'base64');
      review['coverImgType'] = data.type;
    } else {
      review[name] = data;
    }
    review['images'].addToSet(...images);
    review.save();
  });
  
  socket.on('commit', async (roomId) => {
    console.log( 'commit' );
    let review = await Review.findOne({'_id':roomId});
    commitImages.makeDir(roomId);
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
        const isExist = commitImages.editorImages({
            reviewId: roomId,
            prevImgPath: el,
            imgOption,
            nextImgPath: newEl 
        });
        console.log( isExist );
        if (isExist) {
          filtered.push(newEl);
        }
        return filtered;
      }, []);
    }

    console.log( review['images'] );
    const prevCoverImg = review['coverImg'];

    const coverImgType = review['coverImgType'].split('/').pop();
    review['coverImg'] = `/img/${roomId}/cover-${uuidv4()}.${coverImgType}`;
    commitImages.coverImage(prevCoverImg, review['coverImg'], review['tempCoverImg']);   
    review['content'] = review['tempContent'];
    review['isCommit'] = true;
    review.save();
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
}