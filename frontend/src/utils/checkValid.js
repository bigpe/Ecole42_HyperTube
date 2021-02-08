const isValidPassword = (value) => {
    if (value.match(/(?=.*[0-9])(?=.*[a-zA-z])(?=.*[!@#$%^&*])/) && value.length > 7 && value.length < 31)
        return true;
    return false; 
}

const isValidInput = (type, value) => {
    let regex;
    let minLen = 3;
    let maxLen = 30;

    switch (type) {
        case 'email':
            regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            minLen = 8;
            maxLen = 30;
            break;

        case 'login':
            minLen = 5;
            maxLen = 30;
            regex = /^[A-z0-9]+$/;
            break;

        case 'newPass':
            minLen = 8;
            maxLen = 30;
            return (value.length > 0);

        case 'rePass':
            minLen = 8;
            maxLen = 30;
            return (value.length > 0);

        case 'currentPass':
            minLen = 8;
            maxLen = 30;
            return (value.length > 0);

        default:
            regex = /^[A-zА-я]+$/;
    }

    if (value.match(regex) && value.length >= minLen && value.length <= maxLen)
        return true;
    return false;
}

exports.isValidPassword = isValidPassword;
exports.isValidInput = isValidInput;