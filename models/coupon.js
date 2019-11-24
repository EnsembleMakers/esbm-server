const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const couponSchema = new Schema({
  reviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  hash: {
    type: String,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Coupon = mongoose.model('Coupon', couponSchema);

function validateCoupon(coupon) {
  const schema = {
    reviewId: Joi.string().required(),
    userId: Joi.string().required(),
    hash: Joi.any().required(),
    isUsed: Joi.boolean()
  }
  return Joi.validate(coupon, schema);
}

exports.couponSchema = couponSchema;
exports.validate = validateCoupon;
exports.Coupon = Coupon;
