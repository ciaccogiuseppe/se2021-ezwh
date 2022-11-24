const DAO = require('../DB/DAO.js')
//const db = new DAO('./DB/test/ezwh_test_RO.db');
let db;

const returnOrderDAO = require('../DB/returnOrderDAO.js');
//const returnOrder_dao = new returnOrderDAO(db);
let returnOrder_dao;

describe('returnOrderDAO', () => {

    beforeEach(async () => {
        db = new DAO('./DB/test/ezwh_test_RO.db');
        returnOrder_dao = new returnOrderDAO(db);
        await returnOrder_dao.clear();
    });

    afterEach(async ()=>{
        await returnOrder_dao.clear();
        db.dao.close();
    })

    test('[RETURNORDER_0] Delete all ReturnOrders', async () => {
        const res = await returnOrder_dao.clear();
        expect(res.length).toStrictEqual(0);
    });

    test('[RETURNORDER_1] Create ReturnOrder', async () => {
        const id = await returnOrder_dao.createReturnOrder(
            {
            returnDate:"2021/11/29 09:33",
            products:[
                {SKUId:12,
                description:"a product",
                price:10.99,
                rfid:"1234567890123456789099"},
                {SKUId:180,
                description:"another product",
                price:12.99,
                rfid:"1234167890123456789099"}],
            restockOrderId:13
            }
        )
        const res = await returnOrder_dao.getRO(id);
        expect(res.length).toStrictEqual(1);
        expect(res[0].returnDate).toStrictEqual("2021/11/29 09:33");
    });


    test('[RETURNORDER_2] Get products', async () => {
        const id = await returnOrder_dao.createReturnOrder(
            {
            returnDate:"2021/11/29 09:33",
            products:[
                {SKUId:12,
                description:"a product",
                price:10.99,
                rfid:"1234567890123456789099"},
                {SKUId:180,
                description:"another product",
                price:12.99,
                rfid:"1234167890123456789099"}],
            restockOrderId:13
            }
        )
        const res = await returnOrder_dao.getRO(id);
        expect(res.length).toStrictEqual(1);
        const prods = await returnOrder_dao.getProducts(id);
        expect(prods.length).toStrictEqual(2);
    });

    test('[RETURNORDER_3] Delete ReturnOrder', async () => {
        const id = await returnOrder_dao.createReturnOrder(
            {
            returnDate:"2021/11/29 09:33",
            products:[
                {SKUId:12,
                description:"a product",
                price:10.99,
                rfid:"1234567890123456789099"},
                {SKUId:180,
                description:"another product",
                price:12.99,
                rfid:"1234167890123456789099"}],
            restockOrderId:13
            }
        )
        const res = await returnOrder_dao.getRO(id);
        expect(res.length).toStrictEqual(1);
        await returnOrder_dao.deleteRO(id);
        const res2 = await returnOrder_dao.getAllRO();
        expect(res2.length).toStrictEqual(0);
    });


    test('[RETURNORDER_4] Create ReturnOrder 0-loop', async () => {
        const id = await returnOrder_dao.createReturnOrder(
            {
            returnDate:"2021/11/29 09:33",
            products:[],
            restockOrderId:13
            }
        )
        const res = await returnOrder_dao.getProducts(id);
        expect(res.length).toStrictEqual(0);
    });

    test('[RETURNORDER_5] Create ReturnOrder 1-loop', async () => {
        const id = await returnOrder_dao.createReturnOrder(
            {
            returnDate:"2021/11/29 09:33",
            products:[
                {SKUId:12,
                description:"a product",
                price:10.99,
                rfid:"1234567890123456789099"}],
            restockOrderId:13
            }
        )
        const res = await returnOrder_dao.getProducts(id);
        expect(res.length).toStrictEqual(1);
    });

    test('[RETURNORDER_6] Create ReturnOrder N-loop', async () => {
        const id = await returnOrder_dao.createReturnOrder(
            {
            returnDate:"2021/11/29 09:33",
            products:[
                {SKUId:12,
                description:"a product",
                price:10.99,
                rfid:"1234567890123456789099"},
                {SKUId:180,
                description:"another product",
                price:12.99,
                rfid:"1234167890123456789099"},
                {SKUId:181,
                description:"another product",
                price:12.99,
                rfid:"1234167810123456789099"}],
            restockOrderId:13
            }
        )
        const res = await returnOrder_dao.getProducts(id);
        expect(res.length).toStrictEqual(3);
    });
});

