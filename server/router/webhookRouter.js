const Router = require("koa-router");
const shopify = require("../../services/shopify");
const customerModel = require("../../models/customerModel");

const router = new Router({
  prefix: "/webhook",
});

function register(app) {
  router.post("/order-received", async (ctx) => {
    const order = ctx.request.body;
    // console.log("ctx", order.line_items);
    const data = new customerModel({
      id: order.customer.id,
      email: order.customer.email,
      phone: order.customer.phone,
      name: order.customer.first_name + order.customer.last_name,
    });

    shopify.metafield
      .create({
        key: "warehouse",
        value: 25,
        value_type: "integer",
        namespace: "inventory",
        owner_resource: "product",
        owner_id: 632910392,
      })
      .then(
        (metafield) => console.log(metafield),
        (err) => console.error(err)
      );
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}

module.exports = register;
