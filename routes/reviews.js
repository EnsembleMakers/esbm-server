const { Review, validate } = require('../models/review');

const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');

// get review by id
router.get('/:id', async(req, res, next) => {
  console.log(req.params.id)
  let review = await Review.findOne({"_id": req.params.id})
  res.send(review);
})

// get review by orderNumber
router.get('/order/:id', async(req, res, next) => {
  let review = await Review.findOne({"orderNumber": req.params.id, "userId": req.user._id});
  // Error::Cannot set headers after they are sent to the client 뜸 (false 뱉을때)
  // if(!review) res.send(false);
  res.send(review);
});

// get review by scolling down (infinte scroll)
router.get(`/series/next`, async(req, res, next) => {
  // if scroll be on top, lastSeen is initialized (offset=0)
  if (req.query.offset == 0) {
    lastSeen = new Date();
    selectedReview = [];
    // selectedReview = 맨첫번째 선택된 reviewSeries를 맨앞으로
    if (req.query.review){
      Review.find({ "_id": req.query.review })
            .exec((err, docs) => {
              selectedReview = docs
            })
    }
  }
  // if model query is exist, find review with model id.
  // (if)reviewSeries/모델 에서 사용, (else)reviewSeries에서 사용
  if (req.query.model) {
    // reviewSeries/모델&리뷰 에서 선택한모델제외하고 검색
    if (req.query.review){
      findReview = () => Review.find({ "modelId": req.query.model, "createdAt": { "$lt": lastSeen }, "_id": { "$ne": req.query.review} })
    }else {
      findReview = () => Review.find({ "modelId": req.query.model, "createdAt": { "$lt": lastSeen} })
    }
  }else {
    findReview = () => Review.find({ "createdAt": { "$lt": lastSeen} })
  }

  // if scroll be on bottom, offset != 0
  // await Review.find({ "createdAt": { "$lt": lastSeen} })
  await findReview()
              .sort({ "createdAt": -1})
              // 세로모니터일 경우 (브라우저 길이에 따라 다르게 표시할 것) offset 이용
              .limit(13)
              .exec((err, docs) => {
                const newDocs = selectedReview.concat(docs)
                if(newDocs == 0){
                  // botton of posts
                  res.send(null)
                }else {
                  lastSeen = newDocs.slice(-1)[0]['createdAt'];
                  res.send(newDocs)
                }
              });
})

// create review
router.post('/', async (req, res) => {
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
  // console.log(req);
  if (!req.session.passport) return res.status(400).send('not loggedin');
  console.log( req.files.upload );

  const orifilepath = req.files.upload.path;
  const orifilename = req.files.upload.name;
  const orifileext  = orifilename.split('.')[orifilename.split('.').length-1]
  const srvfilename = [ uuidv4(), orifileext ].join('.');

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