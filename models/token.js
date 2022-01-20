const mongoose = require('../services/mongoose').mongoose;

const Schema = mongoose.Schema;

const TokenModel = new Schema(
  {
    shop: {
      type: String,
      unique: true,
    },
    token: {
      type: String,
    },
    scope:{
      type: Array
    }
    
  },
  { strict: true },
  {
    collection: 'shops',
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

module.exports = mongoose.model('TokenModel', TokenModel);
