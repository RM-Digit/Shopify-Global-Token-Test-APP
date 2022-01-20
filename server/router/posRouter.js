const Router = require("koa-router");
const shopify = require("../../services/shopify");
const customerModel = require("../../models/customerModel");

const router = new Router({
  prefix: "/pos",
});

function register(app) {
  router.post("/promotions", async (ctx) => {
    const body = ctx.request.body;
    console.log("promotions", body);
    ctx.status = 200;
    ctx.body = {
      type: "simple_action_list",
      points_label: "Total Number",
      points_balance: "35",
      actions: [
        {
          type: "flat_discount",
          title: "prepaid services",
          description: "-1000 points",
          action_id: "123ABC",
          value: "0.01",
        },
      ],
    };
  });

  router.post("/perform_action", async (ctx) => {});

  router.post("/revert_action", async (ctx) => {});
  app.use(router.routes());
  app.use(router.allowedMethods());
}

module.exports = register;
