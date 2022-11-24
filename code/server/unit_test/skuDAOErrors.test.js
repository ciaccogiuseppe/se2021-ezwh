const DAO = require('../DB/DAO.js')
//const db = new DAO('./DB/test/ezwh_test_SKU.db');
let db;

const skuDAO = require('../DB/skuDAO.js');
//const sku_dao = new skuDAO(db);
let sku_dao;

describe('testskuDAOError', () => {
    beforeEach(async () => {
        db = new DAO('./DB/test/ezwh_test_SKU_EMPTY.db');
        sku_dao = new skuDAO(db);
    });

    afterEach(async ()=>{
        db.dao.close();
    })

    test('[ERR_SKU_0] Delete all SKUs', async () => {
        try{
            await sku_dao.clear();
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    testNewSKU(
        "a new sku",
        100,
        50,
        "first SKU",
        10.99,
        50
    )

    testDeleteSKU(
        "a new sku",
        100,
        50,
        "first SKU",
        10.99,
        50
    )

    testUpdateSKU(
        "a new sku",
        100,
        50,
        "first SKU",
        10.99,
        50,
        200
    )


    testGetDescriptor(
        "a new sku",
        100,
        50,
        "first SKU",
        10.99,
        50
    )

    testSetPosition(
        "a new sku",
        100,
        50,
        "first SKU",
        10.99,
        50
    )

});


function testNewSKU(description, weight, volume, notes, price, availableQuantity) {
    test('[ERR_SKU_1] Create a new SKU', async () => {
        try{
            const sku = {
                description:description,
                weight:weight,
                volume:volume,
                notes:notes,
                price:price,
                availableQuantity:availableQuantity
            }
            const id = await sku_dao.createSKU(sku);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }


        try{
            await sku_dao.getAllSKU();
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }

        try{
            await sku_dao.getSKU(0);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });
}



function testDeleteSKU(description, weight, volume, notes, price, availableQuantity) {
    test('[ERR_SKU_3] Delete SKU', async () => {
        try{
            await sku_dao.deleteSKU(0);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });
}


function testUpdateSKU(description, weight, volume, notes, price, availableQuantity, newWeight) {
    test('ERR_[SKU_4] Update SKU', async () => {
        try{
            const sku = {
                description:description,
                weight:weight,
                volume:volume,
                notes:notes,
                price:price,
                availableQuantity:availableQuantity
            }
    
            const newSKU = {
                description:description,
                weight:newWeight,
                volume:volume,
                notes:notes,
                price:price,
                availableQuantity:availableQuantity
            }
            await sku_dao.updateSKU(0, newSKU, undefined);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });
}

function testSetPosition(description, weight, volume, notes, price, availableQuantity, newWeight){
    test('[ERR_SKU_5] Test set position of SKU', async () => {
        try{
            await sku_dao.setPosition(0, "000000000000", 10, 10);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });
}

function testGetDescriptor(description, weight, volume, notes, price, availableQuantity, newWeight){
    test('[ERR_SKU_6] Get test descriptor SKU', async () => {
        try{
            const res = await sku_dao.getTestDescriptors(0);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });
}