const Shopify = require("shopify-api-node");
import dotenv from "dotenv";

dotenv.config();
const shopify = new Shopify({
  shopName: process.env.SHOP,
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_API_PWD,
});

module.exports = shopify;
