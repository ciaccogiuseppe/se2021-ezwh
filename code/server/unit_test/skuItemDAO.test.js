const DAO = require('../DB/DAO.js')
//const db = new DAO('./DB/test/ezwh_test_SKUI.db');
let db;

const skuitemDAO = require('../DB/skuItemDAO.js');
//const skuitem_dao = new skuitemDAO(db);
let skuitem_dao;

describe('testItemskuDAO', () => {
    beforeEach(async () => {
        db = new DAO('./DB/test/ezwh_test_SKUI.db');
        skuitem_dao = new skuitemDAO(db);
        await skuitem_dao.clear();
    });

    afterEach(async ()=>{
        await skuitem_dao.clear();
        db.dao.close();
    })

    test('[SKUItem_0] Delete all SKUItems', async () => {
        const res = await skuitem_dao.clear();
        expect(res.length).toStrictEqual(0);        
    });

    testNewSKUItem(
        "12345678901234567890123456789014",
        1,
        "2021/11/29 12:30"
    )

    testUpdateSKUItem(
        "12345678901234567890123456789014",
        1,
        "2021/11/29 12:30"
    )

    testDeleteSKUItem(
        "12345678901234567890123456789014",
        1,
        "2021/11/29 12:30"
    )

    
});


function testNewSKUItem(rfid, skuid, dateofstock) {
    test('[SKUIitem_1] Create a new SKU', async () => {
        const skuItem = {
            RFID:rfid,
            SKUId:skuid,
            DateOfStock:dateofstock
        }

        await skuitem_dao.createSKUItem(skuItem);
        const res1 = await skuitem_dao.getAllSKUItems();
        expect(res1.length).toStrictEqual(1);

        const ress = await skuitem_dao.getSKUItemByRFID(rfid);
        const res = ress[0];
        expect(res.SKUId).toStrictEqual(skuid);
        expect(res.Available).toStrictEqual(0);
        expect(res.DateOfStock).toStrictEqual(dateofstock);
    });
}

function testUpdateSKUItem(rfid, skuid, dateofstock){
    test('[SKUIitem_2] Update a SKUIitem', async () => {
        const skuItem = {
            RFID:rfid,
            SKUId:skuid,
            DateOfStock:dateofstock
        }

        const newSkuItem = {
            newRFID:rfid,
            newDateOfStock:dateofstock,
            newAvailable:1
        }

        await skuitem_dao.createSKUItem(skuItem);
        await skuitem_dao.updateSKUItem(rfid, newSkuItem);

        const ress = await skuitem_dao.getSKUItemsById(skuid);
        const res = ress[0];
        expect(res.SKUId).toStrictEqual(skuid);
        expect(res.DateOfStock).toStrictEqual(dateofstock);
    });
}

function testDeleteSKUItem(rfid, skuid, dateofstock){
    test('[SKUIitem_3] Delete a new SKU', async () => {
        const skuItem = {
            RFID:rfid,
            SKUId:skuid,
            DateOfStock:dateofstock
        }
        await skuitem_dao.createSKUItem(skuItem);
        await skuitem_dao.deleteSKUItem(rfid);

        const ress = await skuitem_dao.getAllSKUItems();
        expect(ress.length).toStrictEqual(0);
    });
}