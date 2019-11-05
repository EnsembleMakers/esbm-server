const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewSchema = new Schema({
  orderNumber: {
    type: String,
    required: true,
    ref: "Order"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  modelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Model"
  },
  rating: {
    type: Number,
    required: true
  },
  content: {
    type: String,
  },
  tempContent: {
    type: String,
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
    orderNumber: Joi.string().required(),
    userId: Joi.string().required(),
    modelId: Joi.string(),
    rating: Joi.number().required(),
    content: Joi.any(),
    tempContent: Joi.any(),
    images: Joi.array(),
    isCommit: Joi.boolean().required(),
  }
  return Joi.validate(review, schema);
}

exports.reviewSchema = reviewSchema;
exports.validate = validateReview;
exports.Review = Review;
