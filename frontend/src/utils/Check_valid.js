const isValidPassword = (value) => {
    return (value.length > 7);
}

const isValidInput = (type, value) => {
    let regex;

    switch (type) {
        case 'email':
            regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            break;

        case 'login':
            regex = /^[A-zА-я0-9]+$/;
            break;

        case 'newPass':
            return (value.length > 0);

        case 'rePass':
            return (value.length > 0);

        case 'currentPass':
            return (value.length > 0);

        default:
            regex = /^[A-zА-я]+$/;
    }

    if (value.match(regex))
        return true;
    return false;
}

exports.isValidPassword = isValidPassword;
exports.isValidInput = isValidInput;