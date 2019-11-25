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
    model: String,
    template: {
      type: Array,
    },
    spec: {
      type: Object,
      required: true
    }
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
      model: Joi.string().required(),
      template: Joi.array().items(
        Joi.object().keys({
          "label": Joi.string(),
          "value": Joi.any()
        })),
      spec: Joi.object().required(),
    },
  }
  return Joi.validate(model, schema);
}

exports.modelSchema = modelSchema;
exports.validate = validateOrder;
exports.Model = Model;
