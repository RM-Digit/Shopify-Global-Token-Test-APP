const Router = require("koa-router");
const { Shopify } = require('@shopify/shopify-api');
const dotenv = require("dotenv");
dotenv.config();
const router = new Router({
    prefix: "/orders",
});

function register(app) {
    router.post("/all", async (ctx) => {
        const testCollectionSchema = new Schema({}, { strict: false })
        const TestCollection = mongoose.model('test_collection', testCollectionSchema);

        var query = { limit: 200, status: 'any', api_version: '2022-01' };
        var orders = [];
        do {
            const client = new Shopify.Clients.Rest(process.env.SHOP, process.env.SHOPIFY_API_TESTTOKEN);
            const data = await client.get({
                path: 'orders',
                query: query,

            });
            orders.push(data.body.orders);
            const page_info = data.pageInfo.nextPage.query.page_info;
            query = { page_info: page_info };

        } while (query.page_info !== undefined);

        const bulkWrite = await TestCollection.bulkWrite(
            orders.map(order => ({
                updateOne: {
                    filter: { order: order.id },
                    update: { $set: order },
                    upsert: true,
                },
            }))
        );

        ctx.body = { success: true, data: bulkWrite };
    });


    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;
