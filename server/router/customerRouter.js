const Router = require("koa-router");
const shopify = require("../../services/shopify");

const router = new Router({
  prefix: "/api/customers",
});

function register(app) {
  router.post("/get", async (ctx) => {
    const purchaseUpdate = {
      7443809140977: 1,
      7516467396849: 5,
      7516467298545: 10,
      7519373263089: -1,
    };
    // const purchaseUpdate = {
    //   7342578499825: 1,
    //   7342578729201: 5,
    //   7342578827505: 10,
    //   7342578761969: -1,
    // };

    var orders;
    var params = { limit: 250, status: "any" };

    do {
      orders = await shopify.order.list(params);
      params = orders.nextPageParameters;
    } while (params !== undefined);
    console.log("ordercount", orders.length);

    var data = [],
      duplicate_check = {},
      index = 0;

    orders.forEach((order) => {
      if (!order.customer) return;
      order.line_items.forEach((item) => {
        if (!item.product_id) return;
        if (Object.keys(purchaseUpdate).includes(item.product_id.toString())) {
          const customer_id = order.customer.id;

          if (Object.keys(duplicate_check).includes(customer_id.toString())) {
            const i = duplicate_check[customer_id];
            data[i].track += purchaseUpdate[item.product_id];
            data[i].history = {
              ...data[i].history,
              [item.product_id]: [
                order.created_at,
                item.title,
                order.order_status_url,
                purchaseUpdate[item.product_id],
              ],
            };
          } else {
            duplicate_check = { ...duplicate_check, [customer_id]: index++ };
            const track = purchaseUpdate[item.product_id];
            const temp = {
              order_id: order.id,
              customer_id: customer_id,
              customer_name: `${order.customer.first_name} ${order.customer.last_name}`,
              customer_email: order.customer.email,
              item_title: item.title,
              track: track,
              history: {
                [item.product_id]: [
                  order.created_at,
                  item.title,
                  order.order_status_url,
                  purchaseUpdate[item.product_id],
                ],
              },
            };
            data.push(temp);
          }
        }
      });
    });

    ctx.body = { success: true, data: data };
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}

module.exports = register;
