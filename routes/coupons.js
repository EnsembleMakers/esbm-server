const { Coupon, validate } = require('../models/coupon');
const { User } = require('../models/user');

const express = require('express');
const router = express.Router();

// get all coupon
router.get('/', async(req, res, next) => {
  // TODO consider an error message
  if (!req.session.passport) return res.status(400).send('not logged in');
  console.log( req.session.passport );
  const user = await User.findOne({"email": req.session.passport.user});
  let coupons;
  if (user.kind === 'admin') {
    coupons = await Coupon.find({})
                          .populate({
                            path: 'reviewId',
                            select: 'coverImg title rating',
                            populate: {path: 'modelId', select: 'contents'}
                          })
                          .populate('userId', 'email username');
  } else {
    coupons = await Coupon.find({"userId": user._id});
  }
  res.send(coupons);
});

// get coupon by review id
router.get('/review/:id', async(req, res, next) => {
  // TODO consider an error message
  // console.log( req );
  if (!req.session.passport) return res.status(400).send('not logged in');
  console.log( req.session.passport.user );

  const user = await User.findOne({"email": req.session.passport.user});
  // console.log( user );
  const coupon = await Coupon.findOne({"userId": user._id, "reviewId": req.params.id})
  // const coupons = await Coupon.find({"orderId": req.params.id});
  // console.log( coupon );
  res.send(coupon);
});

// get coupon by hash
router.get('/:id', async (req, res, next) => {
  try {
    let coupon = await Coupon.findOne({"hash": req.params.id});
    console.log( coupon );
    res.send(coupon);
  } catch (error) {
    // TODO consider an error message
    return res.status(400).send(null);
  }
});

// create coupon
router.post('/', async (req, res) => {
  console.log(req.body);
  let isOrderForm = false;
  let orderFormCoupon = null;
  try {
    const userIdByOrderForm = JSON.parse(req.body.userId);
    req.body.userId = null;
    req.body = { orderForm: {...userIdByOrderForm}, ...req.body };
    isOrderForm = (typeof userIdByOrderForm === 'object');
    orderFormCoupon = await Coupon.findOne({"orderForm.name": userIdByOrderForm.name, "orderForm.phone": userIdByOrderForm.phone});
  } catch(err) {
    isOrderForm = false;
  } finally {
    if (orderFormCoupon) {
      return res.status(400).send(null);
    } 
    if (!isOrderForm) {
      const { error } = validate(req.body);
      if (error) {
        console.log( error.message );
        return res.status(400).send(error.message);
      }
    }
    let coupon = new Coupon(req.body);
    coupon = await coupon.save();
    res.send(coupon);
  }
});

// patch coupon by hash
router.patch('/:id', async (req, res) => {
  try {
    let coupon = await Coupon.findOne({"hash": req.params.id});
    coupon.isUsed = true;
    await coupon.save();
    res.send(coupon);
  }
  catch (error) {
    // TODO consider an error message
    return res.status(400).send(null);
  }
});

module.exports = router;
