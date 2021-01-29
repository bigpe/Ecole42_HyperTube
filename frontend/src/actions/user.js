import { USER_LOG_IN, USER_LOG_OUT, USER_FORM_FIRSTNAME_ADD, USER_FORM_LOGIN_ADD, USER_FORM_LASTNAME_ADD, USER_FORM_EMAIL_ADD, 
        USER_FORM_PASSWORD_ADD } from "../constants/actions/user"


export const userLogIn = () =>({ type: USER_LOG_IN });
export const userLogOut = () =>({ type: USER_LOG_OUT });

export const formFirstName = (firstName) => ({
    type: USER_FORM_FIRSTNAME_ADD,
    firstName: firstName
});

export const formLogin = (login) => ({
    type: USER_FORM_LOGIN_ADD,
    nickName: login
});

export const formLastName = (lastName) => ({
    type: USER_FORM_LASTNAME_ADD,
    lastName: lastName
});

export const formEmail = (email) => ({
    type: USER_FORM_EMAIL_ADD,
    email: email
});

export const formPassword = (pass) => ({
    type: USER_FORM_PASSWORD_ADD,
    password: pass
});

export const formRepassword = (pass) => ({
    type: USER_FORM_PASSWORD_ADD,
    repassword: pass
});



export const setLogin = (login) => (dispatch) => {
    dispatch(formLogin(login));
};
export const setFirstName = (firstName) => (dispatch) => {
    dispatch(formFirstName(firstName));
};

export const setLastName = (lastName) => (dispatch) => {
    dispatch(formLastName(lastName));
};

export const setEmail = (email) => (dispatch) => {
    dispatch(formEmail(email));
};

export const setPassword = (pass) => (dispatch) => {
    dispatch(formPassword(pass));
};

export const setRepassword = (pass) => (dispatch) => {
    dispatch(formRepassword(pass));
};
