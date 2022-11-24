
validateEmail = function (emailAddress)
{
    if(emailAddress == undefined) return false;
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return !!emailAddress.match(regexEmail);
}

module.exports = {validateEmail};