const DAO = require('../DB/DAO.js')
//const db = new DAO('./DB/test/ezwh_test_SKUI.db');
let db;

const skuitemDAO = require('../DB/skuItemDAO.js');
//const skuitem_dao = new skuitemDAO(db);
let skuitem_dao;

describe('testItemskuDAOError', () => {
    beforeEach(async () => {
        db = new DAO('./DB/test/ezwh_test_SKUI_EMPTY.db');
        skuitem_dao = new skuitemDAO(db);
    });

    afterEach(async ()=>{
        db.dao.close();
    })

    test('[SKUItem_0] Delete all SKUItems', async () => {
        try{
            await skuitem_dao.clear();
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
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
    test('[ERR_SKUIitem_1] Create a new SKU', async () => {
        try{
            const skuItem = {
                RFID:rfid,
                SKUId:skuid,
                DateOfStock:dateofstock
            }

            await skuitem_dao.createSKUItem(skuItem);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }


        try{
            await skuitem_dao.getAllSKUItems();
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }

        try{
            await skuitem_dao.getSKUItemByRFID(rfid);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });
}

function testUpdateSKUItem(rfid, skuid, dateofstock){
    test('[ERR_SKUIitem_2] Update a SKUIitem', async () => {
        try{
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
            await skuitem_dao.updateSKUItem(rfid, newSkuItem);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });
}

function testDeleteSKUItem(rfid, skuid, dateofstock){
    test('[ERR_SKUIitem_3] Delete a new SKU', async () => {
        try{
            await skuitem_dao.deleteSKUItem(rfid);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });
}