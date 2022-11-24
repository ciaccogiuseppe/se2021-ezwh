const DAO = require('../DB/DAO.js')
//const db = new DAO('./DB/test/ezwh_test_IO.db');
let db;


const internalOrderDAO = require('../DB/internalOrderDAO.js');
//const internalOrder_dao = new internalOrderDAO(db);
let internalOrder_dao;

describe('internalOrderDAO', () => {
    beforeEach(async () => {
        db = new DAO('./DB/test/ezwh_test_IO.db');
        internalOrder_dao = new internalOrderDAO(db);
        await internalOrder_dao.clear();
    });

    afterEach(async ()=>{
        await internalOrder_dao.clear();
        db.dao.close();
    })

    test('[INTERNALORDER_0] Delete all InternalOrders', async () => {
        const res = await internalOrder_dao.clear();
        expect(res.length).toStrictEqual(0);
    });

    test('[INTERNALORDER_1] Create InternalOrder', async () => {
        const id = await internalOrder_dao.insertInternalOrder(
            {
                issueDate:"2021/11/29 09:33",
                customerId:1
            },
            [
                    {SKUId:12,
                    description:"a product",
                    price:10.99,
                    qty:30},
                    {SKUId:180,
                    description:"another product",
                    price:12.99,
                    qty:31}
            ]
        )

        const res = await internalOrder_dao.getAllInternalOrders();
        expect(res.length).toStrictEqual(1);
    });

    test('[INTERNALORDER_2] Get InternalOrder by state', async () => {
        const id = await internalOrder_dao.insertInternalOrder(
            {
                issueDate:"2021/11/29 09:33",
                customerId:1
            },
            [
                    {SKUId:12,
                    description:"a product",
                    price:10.99,
                    qty:30},
                    {SKUId:180,
                    description:"another product",
                    price:12.99,
                    qty:31}
            ]
        )

        const res = await internalOrder_dao.getInternalOrdersState("ISSUED");
        expect(res.length).toStrictEqual(1);
        const res2 = await internalOrder_dao.getInternalOrdersState("ACCEPTED");
        expect(res2.length).toStrictEqual(0);
    });

    test('[INTERNALORDER_3] Get products', async () => {
        const id = await internalOrder_dao.insertInternalOrder(
            {
                issueDate:"2021/11/29 09:33",
                customerId:1
            },
            [
                    {SKUId:12,
                    description:"a product",
                    price:10.99,
                    qty:30},
                    {SKUId:180,
                    description:"another product",
                    price:12.99,
                    qty:31}
            ]
        )
        const res = await internalOrder_dao.getProducts(id);
        expect(res.length).toStrictEqual(2);
    });

    test('[INTERNALORDER_4] Modify state', async () => {
        const id = await internalOrder_dao.insertInternalOrder(
            {
                issueDate:"2021/11/29 09:33",
                customerId:1
            },
            [
                    {SKUId:12,
                    description:"a product",
                    price:10.99,
                    qty:30},
                    {SKUId:180,
                    description:"another product",
                    price:12.99,
                    qty:31}
            ]
        )
        const res = await internalOrder_dao.getInternalOrdersState("ISSUED");
        expect(res.length).toStrictEqual(1);

        await internalOrder_dao.modifyInternalOrder(id, {state:"ACCEPTED", products:[]});

        const res2 = await internalOrder_dao.getInternalOrdersState("ACCEPTED");
        expect(res2.length).toStrictEqual(1);
    });


    test('[INTERNALORDER_5] Modify products', async () => {
        const id = await internalOrder_dao.insertInternalOrder(
            {
                issueDate:"2021/11/29 09:33",
                customerId:1
            },
            [
                    {SKUId:1,
                    description:"a product",
                    price:10.99,
                    qty:2},
                    {SKUId:1,
                    description:"another product",
                    price:12.99,
                    qty:31}
            ]
        )
        const res = await internalOrder_dao.getInternalOrdersState("ISSUED");
        expect(res.length).toStrictEqual(1);

        await internalOrder_dao.modifyInternalOrder(id, {state:"COMPLETED", products:[
            {SkuID:1, RFID:"12345678901234567890123456789012"},
            {SkuID:1, RFID:"12345678911234567890123456789012"}
        ]});
        const res3 = await internalOrder_dao.getInternalOrdersState("COMPLETED");
        expect(res3.length).toStrictEqual(1);
        const res2 = await internalOrder_dao.getProductsRfid(res3[0].id, 1);
        expect(res2.length).toStrictEqual(2);
    });


    test('[INTERNALORDER_6] Delete InternalOrder', async () => {
        const id = await internalOrder_dao.insertInternalOrder(
            {
                issueDate:"2021/11/29 09:33",
                customerId:1
            },
            [
                    {SKUId:12,
                    description:"a product",
                    price:10.99,
                    qty:30},
                    {SKUId:180,
                    description:"another product",
                    price:12.99,
                    qty:31}
            ]
        )

        const res = await internalOrder_dao.getAllInternalOrders();
        expect(res.length).toStrictEqual(1);
        await internalOrder_dao.deleteInternalOrder(id);
        const res2 = await internalOrder_dao.getAllInternalOrders();
        expect(res2.length).toStrictEqual(0);
    });

    test('[INTERNALORDER_7] Insert order 0-loop', async () => {
        const id = await internalOrder_dao.insertInternalOrder(
            {
                issueDate:"2021/11/29 09:33",
                customerId:1
            },
            [
                
            ]
        )

        const res = await internalOrder_dao.getProducts(id);
        expect(res.length).toStrictEqual(0);
    });

    test('[INTERNALORDER_8] Insert order 1-loop', async () => {
        const id = await internalOrder_dao.insertInternalOrder(
            {
                issueDate:"2021/11/29 09:33",
                customerId:1
            },
            [
                {SKUId:12,
                description:"a product",
                price:10.99,
                qty:30}
            ]
        )
        const res = await internalOrder_dao.getProducts(id);
        expect(res.length).toStrictEqual(1);
    });

    test('[INTERNALORDER_9] Insert order N-loop', async () => {
        const id = await internalOrder_dao.insertInternalOrder(
            {
                issueDate:"2021/11/29 09:33",
                customerId:1
            },
            [
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
                qty:30}
            ]
        )

        const res = await internalOrder_dao.getProducts(id);
        expect(res.length).toStrictEqual(3);
    });


    
    test('[INTERNALORDER_10] Modify order 0-loop', async () => {
        const id = await internalOrder_dao.insertInternalOrder(
            {
                issueDate:"2021/11/29 09:33",
                customerId:1
            },
            [
                {SKUId:1,
                description:"a product",
                price:10.99,
                qty:0}
            ]
        )
        //console.log(id);

        await internalOrder_dao.modifyInternalOrder(id, {state:"COMPLETED", products:[
        ]});

        const res3 = await internalOrder_dao.getInternalOrdersState("COMPLETED");
        expect(res3.length).toStrictEqual(1);
        const res2 = await internalOrder_dao.getProductsRfid(res3[0].id, 1);
        expect(res2.length).toStrictEqual(0);
    });
    
    test('[INTERNALORDER_11] Modify order 1-loop', async () => {
        const id = await internalOrder_dao.insertInternalOrder(
            {
                issueDate:"2021/11/29 09:33",
                customerId:1
            },
            [
                {SKUId:1,
                description:"a product",
                price:10.99,
                qty:1}
            ]
        )
        const res = await internalOrder_dao.getProducts(id);
        await internalOrder_dao.modifyInternalOrder(id, {state:"COMPLETED", products:[
            {SkuID:1, RFID:"12345678901234567890123456789012"},
        ]});

        const res3 = await internalOrder_dao.getInternalOrdersState("COMPLETED");
        expect(res3.length).toStrictEqual(1);
        const res2 = await internalOrder_dao.getProductsRfid(res3[0].id, 1);
        expect(res2.length).toStrictEqual(1);
    });

    test('[INTERNALORDER_12] Modify order N-loop', async () => {
        const id = await internalOrder_dao.insertInternalOrder(
            {
                issueDate:"2021/11/29 09:33",
                customerId:1
            },
            [
                {SKUId:1,
                description:"a product",
                price:10.99,
                qty:3}
            ]
        )

        await internalOrder_dao.modifyInternalOrder(id, {state:"COMPLETED", products:[
            {SkuID:1, RFID:"12345678901234567890123456789012"},
            {SkuID:1, RFID:"12345678911234567890123456789012"},
            {SkuID:1, RFID:"12345672911234567890123456789012"}
        ]});

        const res3 = await internalOrder_dao.getInternalOrdersState("COMPLETED");
        expect(res3.length).toStrictEqual(1);
        const res2 = await internalOrder_dao.getProductsRfid(res3[0].id, 1);
        expect(res2.length).toStrictEqual(3);
    });
});
