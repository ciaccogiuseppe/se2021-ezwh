const DAO = require('../DB/DAO.js')
const db = new DAO('./DB/test/ezwh_test_ROT_EMPTY.db');

const restockOrderDAO = require('../DB/restockOrderDAO.js');
const restockOrder_dao = new restockOrderDAO(db);

describe('restockOrderDAOError', () => {

    test('[ERR_RESTOCKORDER_0] Delete all Users', async () => {
        try{
            await restockOrder_dao.clear();
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_RESTOCKORDER_1] Create restockOrder', async () => {
        try{
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
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
        
        try{
            await restockOrder_dao.getAllRestockOrders();
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_RESTOCKORDER_2] Get products', async () => {
        try{
            await restockOrder_dao.getProducts(0);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_RESTOCKORDER_3] Add SKU items', async () => {
        try{
            await restockOrder_dao.modifyRestockOrderProducts(0,{
                skuItems:[{SKUId:12, rfid:"1234567890123456789016"}, {SKUId:12, rfid:"1231234890123456789016"}]
            })
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
        
        try{
            await restockOrder_dao.getSkuItems(2);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_RESTOCKORDER_4] Add transport note', async () => {
        try{
            await restockOrder_dao.modifyRestockOrderTransportNote(1, {
                transportNote:{deliveryDate:"2021/12/29 09:33"}
            })
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }

        try{
            await restockOrder_dao.getRestockOrder(2);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
        
        try{
            await restockOrder_dao.getTransportNote(1);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });


    test('[ERR_RESTOCKORDER_5] Modify state', async () => {
        try{
            await restockOrder_dao.modifyRestockOrderState(0, {state:"DELIVERED"});
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }

        try{
            await restockOrder_dao.getRestockOrdersState("DELIVERED");
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_RESTOCKORDER_6] Delete restock order', async () => {
        try{
            await restockOrder_dao.deleteRestockOrder(0);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });
});
