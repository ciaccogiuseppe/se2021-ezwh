const DAO = require('../DB/DAO.js')
//const db = new DAO('./DB/test/ezwh_test_SKU.db');
let db;

const skuDAO = require('../DB/skuDAO.js');
//const sku_dao = new skuDAO(db);
let sku_dao;

describe('testskuDAO', () => {
    beforeEach(async () => {
        db = new DAO('./DB/test/ezwh_test_SKU.db');
        sku_dao = new skuDAO(db);
        await sku_dao.clear();
    });

    afterEach(async ()=>{
        await sku_dao.clear();
        db.dao.close();
    })

    test('[SKU_0] Delete all SKUs', async () => {
        const res = await sku_dao.clear();
        expect(res.length).toStrictEqual(0);        
    });

    testNewSKU(
        "a new sku",
        100,
        50,
        "first SKU",
        10.99,
        50
    )

    testNewSKUError(
        "a new sku",
        undefined,
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
    test('[SKU_1] Create a new SKU', async () => {
        const sku = {
            description:description,
            weight:weight,
            volume:volume,
            notes:notes,
            price:price,
            availableQuantity:availableQuantity
        }
        //console.log(sku);
        const id = await sku_dao.createSKU(sku);
        const res1 = await sku_dao.getAllSKU();
        expect(res1.length).toStrictEqual(1);

        const res = await sku_dao.getSKU(id);
        expect(res.length).toStrictEqual(1);
        expect(res[0].description).toStrictEqual(description);
        expect(res[0].weight).toStrictEqual(weight);
        expect(res[0].volume).toStrictEqual(volume);
        expect(res[0].notes).toStrictEqual(notes);
        expect(res[0].price).toStrictEqual(price);
        expect(res[0].availableQuantity).toStrictEqual(availableQuantity);
    });
}

function testNewSKUError(description, weight, volume, notes, price, availableQuantity) {
    test('[SKU_2] Create SKU with missing parameter', async () => {
        const sku = {
            description:description,
            volume:volume,
            notes:notes,
            price:price,
            availableQuantity:availableQuantity
        }
        expect(sku_dao.createSKU(sku)).rejects.toThrow();
    });
}



function testDeleteSKU(description, weight, volume, notes, price, availableQuantity) {
    test('[SKU_3] Delete SKU', async () => {
        const sku = {
            description:description,
            weight:weight,
            volume:volume,
            notes:notes,
            price:price,
            availableQuantity:availableQuantity
        }
        const id = await sku_dao.createSKU(sku);
        await sku_dao.deleteSKU(id);

        const res = await sku_dao.getAllSKU();
        expect(res.length).toStrictEqual(0);
    });
}


function testUpdateSKU(description, weight, volume, notes, price, availableQuantity, newWeight) {
    test('[SKU_4] Update SKU', async () => {
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
        const id = await sku_dao.createSKU(sku);

        await sku_dao.deleteSKU(id);

        const res = await sku_dao.updateSKU(id, newSKU, undefined);
        expect(res).toStrictEqual(0);
    });
}

function testSetPosition(description, weight, volume, notes, price, availableQuantity, newWeight){
    test('[SKU_5] Test set position of SKU', async () => {
        const sku = {
            description:description,
            weight:weight,
            volume:volume,
            notes:notes,
            price:price,
            availableQuantity:availableQuantity
        }

        const id = await sku_dao.createSKU(sku);

        await sku_dao.setPosition(id, "000000000000", 10, 10);
        const res = await sku_dao.getSKU(id);
        expect(res.length).toStrictEqual(1);
        expect(res[0].position).toStrictEqual("000000000000");
    });
}

function testGetDescriptor(description, weight, volume, notes, price, availableQuantity, newWeight){
    test('[SKU_6] Get test descriptor SKU', async () => {
        const sku = {
            description:description,
            weight:weight,
            volume:volume,
            notes:notes,
            price:price,
            availableQuantity:availableQuantity
        }

        const id = await sku_dao.createSKU(sku);

        const res = await sku_dao.getTestDescriptors(id);
        expect(res.length).toStrictEqual(0);
    });
}