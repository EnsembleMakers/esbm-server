const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const uniqueValidator = require('mongoose-unique-validator');
const shortid = require('shortid');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true 
  },
  userNumber: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  kind: {
    type: String,
    enum: ['makers', 'general', 'admin'],
    // required: true,
  },
  role: {
    type: String,
    // middleManager
    enum: ['manager', 'maker']
  },
  // 사장님(kind=='makers', role=='manager'일 때 회사정보 입력)
  company: {
    companyName: { type: String },
    companyAddress: { type: String },
    companyPhone: { type: String }
  },
  // 제화공(kind=='makers' role='maker'일 때 소속된 사장님 Id 입력)
  group: {
    grouped: { type: Boolean },
    groupId: { type: mongoose.Schema.Types.ObjectId },
  },
  provider: {
    type: String,
    required: true,
    default: 'local'
  },
  coupons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon"
  }],
  oauth2: String,
  posts_host: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }],
  // posts_join: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Post"
  // }]
}, {
  timestamps: true
});

userSchema.plugin(uniqueValidator);
// autoIncrement 초기화
autoIncrement.initialize(mongoose.connection);
userSchema.plugin(autoIncrement.plugin, {
  model: 'User', 
  field: 'userNumber',
  startAt: 1,
  incrementBy: 1
})

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required(),
    username: Joi.string().min(1).required(),
    kind: Joi.string().required(),
    role: Joi.string(),
    company: { companyName: Joi.string(), companyAddress: Joi.string(), companyPhone: Joi.string()},
    group: { grouped: Joi.boolean(), groupId: Joi.string() },
    coupon: Joi.array(),
    provider: Joi.string(),
    oauth2: Joi.string()
  }
  return Joi.validate(user, schema);
}

exports.userSchema = userSchema;
exports.validate = validateUser;
exports.User = User;
