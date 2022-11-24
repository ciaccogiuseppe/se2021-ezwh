const DAO = require('../DB/DAO.js')
//const db = new DAO('./DB/test/ezwh_test_UT.db');
let db;

const userDAO = require('../DB/userDAO.js');
let user_dao;
//const user_dao = new userDAO(db);

describe('userDAO', () => {

    beforeEach(async () => {
        db = new DAO('./DB/test/ezwh_test_UT.db');
        user_dao = new userDAO(db);
        await user_dao.clear();
    });

    afterEach(async ()=>{
        await user_dao.clear();
        db.dao.close();
    })


    test('[USER_0] Delete all Users', async () => {
        const res = await user_dao.clear();
        expect(res.length).toStrictEqual(0);
    });

    test('[USER_1] Create new Customer', async () => {
        await user_dao.createUser({
            username:"name@mail.com",
            name:"name",
            surname:"surname",
            password:"pw123456",
            type:"customer"
        });
        const res = await user_dao.getAllUsers();
        expect(res.length).toStrictEqual(1);
        expect(res[0].name).toStrictEqual("name");
    });

    test('[USER_2] Create new Manager', async () => {
        await user_dao.createUser({
            username:"name@mail.com",
            name:"name",
            surname:"surname",
            password:"pw123456",
            type:"manager"
        });
        const res = await user_dao.getAllUsers();
        expect(res.length).toStrictEqual(0);
    });

    test('[USER_3] Get suppliers', async () => {
        await user_dao.createUser({
            username:"name@mail.com",
            name:"name",
            surname:"surname",
            password:"pw123456",
            type:"supplier"
        });
        await user_dao.createUser({
            username:"aname@mail.com",
            name:"aname",
            surname:"asurname",
            password:"apw123456",
            type:"supplier"
        });
        const res = await user_dao.getSuppliers();
        expect(res.length).toStrictEqual(2);
    });

    test('[USER_4] Get user info', async () => {
        const id = await user_dao.createUser({
            username:"name@mail.com",
            name:"name",
            surname:"surname",
            password:"pw123456",
            type:"manager"
        });
        const res = await user_dao.getUserInfo(id);
        expect(res.length).toStrictEqual(1);
        expect(res[0].name).toStrictEqual("name");
        expect(res[0].surname).toStrictEqual("surname");
    });

    test('[USER_5] Get user by name and type', async () => {
        const id = await user_dao.createUser({
            username:"name@mail.com",
            name:"name",
            surname:"surname",
            password:"pw123456",
            type:"manager"
        });
        await user_dao.createUser({
            username:"aname@mail.com",
            name:"aname",
            surname:"asurname",
            password:"apw123456",
            type:"supplier"
        });
        const res = await user_dao.getUserByUsernameAndType("aname@mail.com","supplier");
        expect(res.length).toStrictEqual(1);
        expect(res[0].name).toStrictEqual("aname");
        expect(res[0].surname).toStrictEqual("asurname");
    });

    test('[USER_6] Modify user rights', async () => {
        const id = await user_dao.createUser({
            username:"name@mail.com",
            name:"name",
            surname:"surname",
            password:"pw123456",
            type:"manager"
        });
        await user_dao.createUser({
            username:"aname@mail.com",
            name:"aname",
            surname:"asurname",
            password:"apw123456",
            type:"supplier"
        });
        await user_dao.updateUserRights("aname@mail.com", "supplier", "clerk");
        const res = await user_dao.getUserByUsernameAndType("aname@mail.com","clerk");
        expect(res.length).toStrictEqual(1);
        expect(res[0].name).toStrictEqual("aname");
        expect(res[0].surname).toStrictEqual("asurname");
    });

    test('[USER_7] Login', async () => {
        const id = await user_dao.createUser({
            username:"name@mail.com",
            name:"name",
            surname:"surname",
            password:"pw123456",
            type:"manager"
        });
        await user_dao.createUser({
            username:"aname@mail.com",
            name:"aname",
            surname:"asurname",
            password:"apw123456",
            type:"supplier"
        });
        const res = await user_dao.login("supplier", "aname@mail.com", "apw123456");
        //expect(res.length).toStrictEqual(1);
        expect(res.name).toStrictEqual("aname");
    });

    test('[USER_8] Delete user', async () => {
        const id1 = await user_dao.createUser({
            username:"name@mail.com",
            name:"name",
            surname:"surname",
            password:"pw123456",
            type:"manager"
        });
        const id2 = await user_dao.createUser({
            username:"aname@mail.com",
            name:"aname",
            surname:"asurname",
            password:"apw123456",
            type:"supplier"
        });
        const res = await user_dao.getAllUsers();
        expect(res.length).toStrictEqual(1);

        await user_dao.deleteUser("name@mail.com", "manager");
        const res1 = await user_dao.getAllUsers();
        expect(res1.length).toStrictEqual(1);

        await user_dao.deleteUser("aname@mail.com", "supplier");
        const res2 = await user_dao.getAllUsers();
        expect(res2.length).toStrictEqual(0);
    });
});
