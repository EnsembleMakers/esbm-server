const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const { Schema } = mongoose;
const Joi = require('@hapi/joi');

const orderSchema = new Schema({
  customerInfo: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String
    }
  },
  orderNumber: {
    type: Number,
    required: true,
  },
  makerId: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
  },
  modelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Model',
  },
  contents: {
    template: {
      type: Array,
    },
    model: {
      type: String,
      default: ''
    },
    detail: {
      type: String,
      default: ''
    }
  },
  images: {
    type: [ String ]
  },
  modelImage: {
    type: String,
    default: null,
  },
  // 공정완료시각
  // 라스트
  lastComplete: {
    type: Date
  },
  // 재단
  cutComplete: {
    type: Date,
  },
  // 갑피
  upperComplete: {
    type: Date,
  },
  // 저부
  soleComplete: {
    type: Date,
  },
  // 진행상태
  processingState: {
    // 0 = 라스트, 1 = 재단, 2 = 갑피, 3 = 저부, 4 = 완료
    type: Number,
    default: 0,
  },
  deadline: {
    type: Number,
    default: 0,
  },
  review: {
    type: String,
  },
  // 주문상태
  state: {
    type: String,
    default: 'ordered'
  }
}, {
  timestamps: true
});

// 주문번호 생성
// autoIncrement 초기화
autoIncrement.initialize(mongoose.connection);
orderSchema.plugin(autoIncrement.plugin, {
  model: 'Order', 
  field: 'orderNumber',
  startAt: 1000,
  incrementBy: 1
})

const Order = mongoose.model('Order', orderSchema);

function validateOrder(order) {
  const schema = {
    customerInfo: {
      name: Joi.string().required(),
      phone: Joi.string().required(),
      address: Joi.any()
    },
    // makerId: Joi.string().required(),
    makerId: Joi.any(),
    modelId: Joi.string(),
    contents: { 
      template: Joi.array().items(
        Joi.object().keys({
          "label": Joi.string(),
          "value": Joi.any()
        })),
      model: Joi.string(),
      detail: Joi.any()
    },
    // string or null
    modelImage: Joi.any(),
  }
  return Joi.validate(order, schema);
}

exports.orderSchema = orderSchema;
exports.validate = validateOrder;
exports.Order = Order;
