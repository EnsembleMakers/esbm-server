const { Review, validate } = require('../models/review');

const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

// get all review

// get review by id
router.get('/:id', async(req, res, next) => {
  let review = await Review.findOne({"orderId": req.params.id})

  // Error::Cannot set headers after they are sent to the client 뜸 (false 뱉을때)
  // if(!review) res.send(false);
  res.send(review);
});

// create review
router.post('/', async (req, res) => {
  console.log( req.body );
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);
  let review = new Review(req.body);
  review = await review.save();
  res.send(review);
});

// patch review
router.patch('/:id', async(req, res, next) => {
  let review = await Review.findOne({"orderId": req.params.id});
  review["rating"] = req.body.rating;
  review["content"] = req.body.content;
  review.save();
  res.send(review);
})

// CKEditor
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const FileReader = require('filereader')

router.post('/imageUpload', multipartMiddleware, async(req, res, next) => {
  console.log(req.body)
  console.log(req.files)
  const orifilepath = req.files.upload.path;
  const orifilename = req.files.upload.name;
  const srvfilename = orifilename;

  fs.readdir(path.join(__dirname, `../uploads/temp`), (error) => {
    // console.log( error );
    if(error) {
      fs.mkdirSync(path.join(__dirname, '../uploads/temp'));
    }
  })

  fs.readFile(orifilepath, (err, data) => {
    const newPath = path.join(__dirname, '../uploads/temp/', srvfilename)
    fs.writeFile(newPath, data, function (err) {
      if (err) console.log({ err: err });
      else {
        html = "{\"filename\" : \"" + orifilename + "\", \"uploaded\" : 1, \"url\": \"/img/temp/" +srvfilename + "\"}"
        res.send(html);
      }
    });

    // // files를 req로 받아서 사진을 직접 저장하지 않고 DataURL 미리보기만 임시로 생성해서 src path로 넣어준다.
    // let reader = new FileReader();
    // reader.readAsDataURL(req.files.upload)
    // reader.onload = () => {
    //   html = "{\"filename\" : \"" + orifilename + "\", \"uploaded\" : 1, \"url\": \"" + reader.result + "\"}"
    //   res.send(html)
    // }
  });
})

module.exports = router;