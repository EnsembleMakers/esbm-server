const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, '../uploads');

module.exports = {
  makeDir: function(reviewId) {
    // new directory for saving images
    const dir = path.join(uploadsDir, reviewId);
    
    try {
      fs.readdirSync(dir);
    } catch(err) {
      // An error occurred
      fs.mkdirSync(dir);
    }
  },
  editorImages: function ({ reviewId, prevImgPath, imgOption, nextImgPath }) {
    // pre-processing
    prevImgPath = path.join(uploadsDir, prevImgPath.replace('/img/',''));
    nextImgPath = path.join(uploadsDir, nextImgPath.replace('/img/',''));
    console.log( 'option ' + imgOption );
    if (imgOption == 'maintain') return 1;
    console.log( 'prev ' + prevImgPath );
    console.log( 'next ' + nextImgPath );
    
    try {
      fs.readFileSync(prevImgPath)
      // copy file
      if ( imgOption == 'copy' ) {
        fs.copyFileSync(prevImgPath, nextImgPath, (err) => {
          
        });
        fs.unlinkSync(prevImgPath)
        return 1;
      } 
      // remove file
      else if ( imgOption == 'del' ) {
        fs.unlink(prevImgPath, (err) => {
          
        })
        return null;
      }
    } catch(err) {
      return null;
    }
  },
  coverImage: async function(prevImgPath, imgPath, data) {
    if(prevImgPath){
      prevImgPath = path.join(uploadsDir, prevImgPath.replace('/img/',''));
      fs.unlink(prevImgPath, (err) => {
        console.log( `Delete cover image: ${prevImgPath}` );      
      })
    }

    if(data) {
      imgPath = path.join(uploadsDir, imgPath.replace('/img/',''));
      await fs.writeFile(`${imgPath}`, data, () => { console.log('Success to upload cover image') });
      console.log('success upload cover', imgPath)
    }
  }
}