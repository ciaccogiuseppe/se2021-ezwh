const DAO = require('../DB/DAO.js')
let db = new DAO('./DB/test/ezwh_test_IT_EMPTY.db');

const itemDAO = require('../DB/itemDAO.js');
let item_dao = new itemDAO(db);

describe('itemDAOError', () => {

    test('[ERR_ITEM_0] Delete all Items', async () => {
        try{
            await item_dao.clear();
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_ITEM_1] Create new item', async () => {
        try{
            await item_dao.createNewItem(
                {
                    description:"a new item",
                    price: 10.99,
                    SKUId:1,
                    supplierId:2
                }
            )
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_ITEM_2] Get Item by Id', async () => {
        try{
            await item_dao.getAllItems();
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
        try{
            await item_dao.getItemById(0);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_ITEM_3] Modify item', async () => {
        try{
            await item_dao.modifyItem(
                0,
                {
                    newDescription: "a new sku",
                    newPrice : 21.99
                }
            )
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_ITEM_4] Delete item', async () => {
        try{
            await item_dao.deleteItem(0);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });
});



