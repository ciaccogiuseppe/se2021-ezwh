const DAO = require('../DB/DAO.js')
const db = new DAO('./DB/test/ezwh_test_RO_EMPTY.db');

const returnOrderDAO = require('../DB/returnOrderDAO.js');
const returnOrder_dao = new returnOrderDAO(db);

describe('returnOrderDAOError', () => {

    test('[ERR_RETURNORDER_0] Delete all ReturnOrders', async () => {
        try{
            await returnOrder_dao.clear();
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_RETURNORDER_1] Create ReturnOrder', async () => {
        try{
            await returnOrder_dao.createReturnOrder(
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
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }

        try{
            await returnOrder_dao.getRO(0);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });


    test('[ERR_RETURNORDER_2] Get products', async () => {
        try{
            await returnOrder_dao.getProducts(0);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_RETURNORDER_3] Delete ReturnOrder', async () => {
        try{
            await returnOrder_dao.deleteRO(0);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }

        try{
            await returnOrder_dao.getAllRO();
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });
});
