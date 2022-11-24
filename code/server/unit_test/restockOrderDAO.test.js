const DAO = require('../DB/DAO.js')
//const db = new DAO('./DB/test/ezwh_test_ROT.db');
let db;
const restockOrderDAO = require('../DB/restockOrderDAO.js');
let restockOrder_dao;

describe('restockOrderDAO', () => {
    beforeEach(async () => {
        db = new DAO('./DB/test/ezwh_test_ROT.db');
        restockOrder_dao = new restockOrderDAO(db);
        await restockOrder_dao.clear();
    });

    afterEach(async ()=>{
        await restockOrder_dao.clear();
        db.dao.close();
    })

    test('[RESTOCKORDER_0] Delete all Users', async () => {
        const res = await restockOrder_dao.clear();
        expect(res.length).toStrictEqual(0);
    });

    test('[RESTOCKORDER_1] Create restockOrder', async () => {
        await restockOrder_dao.insertRestockOrder({
            issueDate:"2021/11/29 09:33",
            products:[
                {SKUId:12,
                description:"a product",
                price:10.99,
                qty:30},
                {SKUId:180,
                description:"another product",
                price:12.99,
                qty:31}
            ],
            supplierId:1
        })
        const res = await restockOrder_dao.getAllRestockOrders();
        expect(res.length).toStrictEqual(1);
        expect(res[0].issueDate).toStrictEqual("2021/11/29 09:33");
    });

    test('[RESTOCKORDER_2] Get products', async () => {
        await restockOrder_dao.insertRestockOrder({
            issueDate:"2021/11/29 09:33",
            products:[
                {SKUId:12,
                description:"a product",
                price:10.99,
                qty:30},
                {SKUId:180,
                description:"another product",
                price:12.99,
                qty:31}
            ],
            supplierId:1
        })
        const res = await restockOrder_dao.getAllRestockOrders();
        expect(res.length).toStrictEqual(1);
        const prods = await restockOrder_dao.getProducts(res[0].id);
        expect(prods.length).toStrictEqual(2);
    });

    test('[RESTOCKORDER_3] Add SKU items', async () => {
        await restockOrder_dao.insertRestockOrder({
            issueDate:"2021/11/29 09:33",
            products:[
                {SKUId:12,
                description:"a product",
                price:10.99,
                qty:30},
                {SKUId:180,
                description:"another product",
                price:12.99,
                qty:31}
            ],
            supplierId:1
        })
        const res = await restockOrder_dao.getAllRestockOrders();
        expect(res.length).toStrictEqual(1);
        await restockOrder_dao.modifyRestockOrderProducts(res[0].id,{
            skuItems:[{SKUId:12, rfid:"1234567890123456789016"}, {SKUId:12, rfid:"1231234890123456789016"}]
        })

        const ress = await restockOrder_dao.getSkuItems(res[0].id);
        expect(ress.length).toStrictEqual(2);
    });

    test('[RESTOCKORDER_4] Add transport note', async () => {
        const id = await restockOrder_dao.insertRestockOrder({
            issueDate:"2021/11/29 09:33",
            products:[
                {SKUId:12,
                description:"a product",
                price:10.99,
                qty:30},
                {SKUId:180,
                description:"another product",
                price:12.99,
                qty:31}
            ],
            supplierId:1
        })
        const res = await restockOrder_dao.getAllRestockOrders();
        expect(res.length).toStrictEqual(1);
        await restockOrder_dao.modifyRestockOrderTransportNote(res[0].id, {
            transportNote:{deliveryDate:"2021/12/29 09:33"}
        })
        const res2 = await restockOrder_dao.getRestockOrder(res[0].id);
        const delDate = await restockOrder_dao.getTransportNote(res2[0].id);
        //expect(tNote.length).toStrictEqual(1);
        expect(delDate.deliveryDate).toStrictEqual("2021/12/29 09:33");
    });


    test('[RESTOCKORDER_5] Modify state', async () => {
        const id = await restockOrder_dao.insertRestockOrder({
            issueDate:"2021/11/29 09:33",
            products:[
                {SKUId:12,
                description:"a product",
                price:10.99,
                qty:30},
                {SKUId:180,
                description:"another product",
                price:12.99,
                qty:31}
            ],
            supplierId:1
        })
        const res = await restockOrder_dao.getAllRestockOrders();
        expect(res.length).toStrictEqual(1);
        await restockOrder_dao.modifyRestockOrderState(res[0].id, {state:"DELIVERED"});
        const ress = await restockOrder_dao.getRestockOrdersState("DELIVERED");
        expect(ress.length).toStrictEqual(1);
    });

    test('[RESTOCKORDER_6] Delete restock order', async () => {
        const id = await restockOrder_dao.insertRestockOrder({
            issueDate:"2021/11/29 09:33",
            products:[
                {SKUId:12,
                description:"a product",
                price:10.99,
                qty:30},
                {SKUId:180,
                description:"another product",
                price:12.99,
                qty:31}
            ],
            supplierId:1
        })
        const res = await restockOrder_dao.getAllRestockOrders();
        expect(res.length).toStrictEqual(1);
        await restockOrder_dao.deleteRestockOrder(id);
        const res2 = await restockOrder_dao.getAllRestockOrders();
        expect(res2.length).toStrictEqual(0);
    });

    test('[RESTOCKORDER_7] Create restockOrder 0-loop', async () => {
        await restockOrder_dao.insertRestockOrder({
            issueDate:"2021/11/29 09:33",
            products:[
            ],
            supplierId:1
        })
        const res = await restockOrder_dao.getAllRestockOrders();
        expect(res.length).toStrictEqual(1);
        const r = await restockOrder_dao.getProducts(res[0].id);
        expect(r.length).toStrictEqual(0);
    });

    test('[RESTOCKORDER_8] Create restockOrder 1-loop', async () => {
        await restockOrder_dao.insertRestockOrder({
            issueDate:"2021/11/29 09:33",
            products:[
                {SKUId:12,
                description:"a product",
                price:10.99,
                qty:30},
            ],
            supplierId:1
        })
        const res = await restockOrder_dao.getAllRestockOrders();
        expect(res.length).toStrictEqual(1);
        const r = await restockOrder_dao.getProducts(res[0].id);
        expect(r.length).toStrictEqual(1);
    });

    test('[RESTOCKORDER_9] Create restockOrder N-loop', async () => {
        await restockOrder_dao.insertRestockOrder({
            issueDate:"2021/11/29 09:33",
            products:[
                {SKUId:12,
                description:"a product",
                price:10.99,
                qty:30},
                {SKUId:13,
                description:"a product",
                price:10.99,
                qty:30},
                {SKUId:14,
                description:"a product",
                price:10.99,
                qty:30},
            ],
            supplierId:1
        })
        const res = await restockOrder_dao.getAllRestockOrders();
        expect(res.length).toStrictEqual(1);
        const r = await restockOrder_dao.getProducts(res[0].id);
        expect(r.length).toStrictEqual(3);
    });


    test('[RESTOCKORDER_10] Add SKU items 0-loop', async () => {
        await restockOrder_dao.insertRestockOrder({
            issueDate:"2021/11/29 09:33",
            products:[
                {SKUId:12,
                description:"a product",
                price:10.99,
                qty:3}
            ],
            supplierId:1
        })
        const res = await restockOrder_dao.getAllRestockOrders();
        expect(res.length).toStrictEqual(1);
        await restockOrder_dao.modifyRestockOrderProducts(res[0].id,{
            skuItems:[]
        })

        const ress = await restockOrder_dao.getSkuItems(res[0].id);
        expect(ress.length).toStrictEqual(0);
    });


    test('[RESTOCKORDER_11] Add SKU items 1-loop', async () => {
        await restockOrder_dao.insertRestockOrder({
            issueDate:"2021/11/29 09:33",
            products:[
                {SKUId:12,
                description:"a product",
                price:10.99,
                qty:3}
            ],
            supplierId:1
        })
        const res = await restockOrder_dao.getAllRestockOrders();
        expect(res.length).toStrictEqual(1);
        await restockOrder_dao.modifyRestockOrderProducts(res[0].id,{
            skuItems:[{SKUId:12, rfid:"1234567890123456789016"}]
        })

        const ress = await restockOrder_dao.getSkuItems(res[0].id);
        expect(ress.length).toStrictEqual(1);
    });

    test('[RESTOCKORDER_12] Add SKU items N-loop', async () => {
        await restockOrder_dao.insertRestockOrder({
            issueDate:"2021/11/29 09:33",
            products:[
                {SKUId:12,
                description:"a product",
                price:10.99,
                qty:3}
            ],
            supplierId:1
        })
        const res = await restockOrder_dao.getAllRestockOrders();
        expect(res.length).toStrictEqual(1);
        await restockOrder_dao.modifyRestockOrderProducts(res[0].id,{
            skuItems:[
                {SKUId:12, rfid:"1234567890123456789016"},
                {SKUId:12, rfid:"1231234890123456789016"},
                {SKUId:12, rfid:"1231234890113456789016"}]
        })

        const ress = await restockOrder_dao.getSkuItems(res[0].id);
        expect(ress.length).toStrictEqual(3);
    });
});
