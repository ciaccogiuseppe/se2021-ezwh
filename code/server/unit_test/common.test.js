const common = require('../routers/common.js')
//const common = new Common();

testValidateEmail(undefined, false);
testValidateEmail("", false);
testValidateEmail("name", false);
testValidateEmail("namemail", false);
testValidateEmail("it", false);
testValidateEmail("nameit", false);
testValidateEmail("mailit", false);
testValidateEmail("namemailit", false);
testValidateEmail(".", false);
testValidateEmail("name.", false);
testValidateEmail("mail.", false);
testValidateEmail("namemail.", false);
testValidateEmail(".it", false);
testValidateEmail("name.it", false);
testValidateEmail("mail.it", false);
testValidateEmail("namemail.it", false);
testValidateEmail("@", false);
testValidateEmail("name@", false);
testValidateEmail("@mail", false);
testValidateEmail("name@mail", false);
testValidateEmail("@it", false);
testValidateEmail("name@it", false);
testValidateEmail("@mailit", false);
testValidateEmail("name@mailit", false);
testValidateEmail("@.", false);
testValidateEmail("name@.", false);
testValidateEmail("@mail.", false);
testValidateEmail("name@mail.abcd", false);
testValidateEmail("@.it", false);
testValidateEmail("name@.it", false);
testValidateEmail("@mail.it", false);
testValidateEmail("name@mail.it", true);

function testValidateEmail(emailAddress, expectedResult) {
    test('VALIDATE_EMAIL', () => {
      const res = common.validateEmail(emailAddress);
      expect(res).toStrictEqual(expectedResult);
    });
  }
  