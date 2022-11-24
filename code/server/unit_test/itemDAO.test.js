const DAO = require('../DB/DAO.js')
//let db = new DAO('./DB/test/ezwh_test_IT.db');
let db;

const itemDAO = require('../DB/itemDAO.js');
let item_dao;

describe('itemDAO', () => {
    beforeEach(async () => {
        db = new DAO('./DB/test/ezwh_test_IT.db');
        item_dao = new itemDAO(db);
        await item_dao.clear();
    });

    afterEach(async ()=>{
        await item_dao.clear();
        db.dao.close();
    })

    test('[ITEM_0] Delete all Items', async () => {
        const res = await item_dao.clear();
        expect(res.length).toStrictEqual(0);
    });

    test('[ITEM_1] Create new item', async () => {
        const id = await item_dao.createNewItem(
            {
                description:"a new item",
                price: 10.99,
                SKUId:1,
                supplierId:2
            }
        )
        const res = await item_dao.getAllItems();
        expect(res.length).toStrictEqual(1);
    });

    test('[ITEM_2] Get Item by Id', async () => {
        const id = await item_dao.createNewItem(
            {
                description:"a new item",
                price: 10.99,
                SKUId:1,
                supplierId:2
            }
        )
        const res = await item_dao.getItemById(id);
        expect(res.length).toStrictEqual(1);
    });

    test('[ITEM_3] Modify item', async () => {
        const id = await item_dao.createNewItem(
            {
                description:"a new item",
                price: 10.99,
                SKUId:1,
                supplierId:2
            }
        )
        
        await item_dao.modifyItem(
            id,
            {
                newDescription: "a new sku",
                newPrice : 21.99
            }
        )

        const res = await item_dao.getItemById(id);
        expect(res.length).toStrictEqual(1);
        expect(res[0].price).toStrictEqual(21.99);
    });

    test('[ITEM_4] Delete item', async () => {
        const id = await item_dao.createNewItem(
            {
                description:"a new item",
                price: 10.99,
                SKUId:1,
                supplierId:2
            }
        )
        
        const res = await item_dao.getItemById(id);
        expect(res.length).toStrictEqual(1);
        await item_dao.deleteItem(id);
        const ress = await item_dao.getAllItems();
        expect(ress.length).toStrictEqual(0);
    });
});



