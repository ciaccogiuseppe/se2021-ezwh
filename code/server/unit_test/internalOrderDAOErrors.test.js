const DAO = require('../DB/DAO.js')
//const db = new DAO('./DB/test/ezwh_test_IO_EMPTY.db');
let db;


const internalOrderDAO = require('../DB/internalOrderDAO.js');
//const internalOrder_dao = new internalOrderDAO(db);
let internalOrder_dao;

describe('internalOrderDAOError', () => {
    beforeEach(async () => {
        db = new DAO('./DB/test/ezwh_test_IO_EMPTY.db');
        internalOrder_dao = new internalOrderDAO(db);
    });

    afterEach(async ()=>{
        db.dao.close();
    })


    test('[ERR_INTERNALORDER_0] Delete all InternalOrders', async () => {
        try{
            await internalOrder_dao.clear();
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_INTERNALORDER_1] Create InternalOrder', async () => {
        try{
            await internalOrder_dao.insertInternalOrder(
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
        }
        catch(err){
            expect(err).toEqual(expect.anything());
        };
    });

    test('[ERR_INTERNALORDER_2] Get InternalOrder by state', async () => {
        try{
            await internalOrder_dao.getInternalOrdersState("ISSUED");
        }
        catch(err){
            expect(err).toEqual(expect.anything());
        }

        try{
            await internalOrder_dao.getProductsRfid(0, 1);
        }
        catch(err){
            expect(err).toEqual(expect.anything());
        }
        
    });


    
    test('[ERR_INTERNALORDER_3] Get products', async () => {
        try{
            await internalOrder_dao.getAllInternalOrders();
        }
        catch(err){
            expect(err).toEqual(expect.anything());
        }

        try{
            await internalOrder_dao.getProducts(0);
        }
        catch(err){
            expect(err).toEqual(expect.anything());
        }
    });


    test('[ERR_INTERNALORDER_4] Modify state', async () => {
        try{
            await internalOrder_dao.modifyInternalOrder(0, {state:"ACCEPTED", products:[]});
        }
        catch(err){
            expect(err).toEqual(expect.anything());
        }
    });

    
    test('[ERR_INTERNALORDER_5] Modify products', async () => {
        try{
            await internalOrder_dao.modifyInternalOrder(0, {state:"COMPLETED", products:[
                {SkuID:1, RFID:"12345678901234567890123456789012"},
                {SkuID:1, RFID:"12345678911234567890123456789012"}
            ]});
        }
        catch(err){
            expect(err).toEqual(expect.anything());
        }

        try{
            await internalOrder_dao.getProductsRfid(0, 1);
        }
        catch(err){
            expect(err).toEqual(expect.anything());
        }
    });

    
    test('[ERR_INTERNALORDER_6] Delete InternalOrder', async () => {
        try{
            await internalOrder_dao.deleteInternalOrder(0);
        }
        catch(err){
            expect(err).toEqual(expect.anything());
        }
    });
});
