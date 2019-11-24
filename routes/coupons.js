const { Coupon, validate } = require('../models/coupon');

const express = require('express');
const router = express.Router();

// get all coupon
router.get('/', async(req, res, next) => {
  if (!req.session.passport) return res.status(400).send('not logged in');
  console.log( req.session.passport );
  // const coupons = await Coupon.find({"orderId": req.params.id});
  // res.send(coupons);
});

// get coupon by hash
router.get('/:id', (req, res, next) => {
  console.log( req.params.id );
  return next();
});

// create coupon
router.post('/', async (req, res) => {
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) {
    console.log( error.message );
    return res.status(400).send(error.message);
  }
  let coupon = new Coupon(req.body);
  coupon = await coupon.save();
  res.send(coupon);
});

module.exports = router;