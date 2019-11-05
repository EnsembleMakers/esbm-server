const fs = require('fs');
const path = require('path');

module.exports = ({ reviewId, prevImgPath, imgOption, nextImgPath }) => {
  // pre-processing
  const uploadsDir = path.join(__dirname, '../uploads');
  prevImgPath = path.join(uploadsDir, prevImgPath.replace('/img/',''));
  nextImgPath = path.join(uploadsDir, nextImgPath.replace('/img/',''));
  if (prevImgPath == nextImgPath) return 1;
  console.log( 'prev ' + prevImgPath );
  console.log( 'next ' + nextImgPath );
  // new directory for saving images
  const dir = path.join(uploadsDir, reviewId);
  
  try {
    fs.readdirSync(dir);
  } catch(err) {
    // An error occurred
    fs.mkdirSync(dir);
  }

  fs.readFile(prevImgPath, (err) => {
    if (err) {
      return null;
    } 
    else {
      // copy file
      if ( imgOption == 'copy' ) {
        fs.copyFileSync(prevImgPath, nextImgPath, (err) => {
          
        });
        fs.unlinkSync(prevImgPath)
      } 
      // remove file
      else if ( imgOption == 'del' ) {
        fs.unlink(prevImgPath, (err) => {
          
        })
      }
      return 1;
    }
  });
}