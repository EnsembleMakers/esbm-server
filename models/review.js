const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewSchema = new Schema({
  orderId: {
    type: String,
    required: true,
    ref: "Order"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  rating: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  images: {
    type: [ String ]
  },
  isCommit: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);

function validateReview(review) {
  const schema = {
    orderId: Joi.string().required(),
    userId: Joi.string().required(),
    rating: Joi.number().required(),
    content: Joi.string().required(),
    images: Joi.array(),
    isCommit: Joi.boolean().required(),
  }
  return Joi.validate(review, schema);
}

exports.reviewSchema = reviewSchema;
exports.validate = validateReview;
exports.Review = Review;
