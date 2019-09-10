const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose;

const socialAccountSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  provider: {
    type: String,
    required: true,
    default: 'local'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true 
  },
  lastLoginDate: {
    type: Date,
    default: Date.now
  },
  loggedInCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

socialAccountSchema.plugin(uniqueValidator);
const SocialAccount = mongoose.model('SocialAccount', socialAccountSchema);

function validateSocialAccount(socialAccount) {
  const schema = {
    provider: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    lastLoginDate: Joi.Date(),
    loggedInCount: Joi.Number()
  }
  return Joi.validate(socialAccount, schema);
}

exports.socialAccountSchema = socialAccountSchema;
exports.validate = validateSocialAccount;
exports.SocialAccount = SocialAccount;