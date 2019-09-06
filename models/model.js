const mongoose = require('mongoose');
const { Schema } = mongoose;
const Joi = require('@hapi/joi');

const modelSchema = new Schema({
  makerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  modelImage: {
    type: String,
    default: null
  },
  contents: {
    template: {
      type: Array,
    },
    // nonTemplate: {
    //   type: Array
    // }
  },
}, {
  timestramps: true
});

const Model = mongoose.model('Model', modelSchema);

function validateOrder(model) {
  const schema = {
    makerId: Joi.string().required(),
    modelImage: Joi.string(),
    contents: { 
      template: Joi.array().items(
        Joi.object().keys({
          "label": Joi.string(),
          "value": Joi.any()
        })),
      nonTemplate: Joi.array().items(
        Joi.object().keys({
          "label": Joi.string(),
          "value": Joi.any()
        })
      )
    },
  }
  return Joi.validate(model, schema);
}

exports.modelSchema = modelSchema;
exports.validate = validateOrder;
exports.Model = Model;
