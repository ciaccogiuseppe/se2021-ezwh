const DAO = require('../DB/DAO.js')
//const db = new DAO('./DB/test/ezwh_test_UT.db');
let db;

const userDAO = require('../DB/userDAO.js');
let user_dao;
//const user_dao = new userDAO(db);

describe('userDAOError', () => {

    beforeEach(async () => {
        db = new DAO('./DB/test/ezwh_test_UT_EMPTY.db');
        user_dao = new userDAO(db);
    });

    afterEach(async ()=>{
        db.dao.close();
    })


    test('[ERR_USER_0] Delete all Users', async () => {
        try{
            await user_dao.clear();
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_USER_1] Create new Customer', async () => {
        try{
            await user_dao.createUser({
                username:"name@mail.com",
                name:"name",
                surname:"surname",
                password:"pw123456",
                type:"customer"
            });
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
        
    });

    test('[ERR_USER_3] Get suppliers', async () => {
        try{
            await user_dao.getSuppliers();
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_USER_4] Get user info', async () => {
        try{
            await user_dao.getUserInfo(id);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_USER_5] Get user by name and type', async () => {
        try{
            await user_dao.getUserByUsernameAndType("aname@mail.com","supplier");
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_USER_6] Modify user rights', async () => {
        try{
            await user_dao.updateUserRights("aname@mail.com", "supplier", "clerk");
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }

        try{
            await user_dao.getUserByUsernameAndType("aname@mail.com","clerk");
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }

    });

    test('[ERR_USER_7] Login', async () => {
        try{
            await user_dao.login("supplier", "aname@mail.com", "apw123456");
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_USER_8] Delete user', async () => {
        try{
            await user_dao.deleteUser("aname@mail.com", "supplier");
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });
});
