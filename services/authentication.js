import request from '../lib/request';

function login(user) {
    return request({
        url: 'auth/login',
        method: 'POST',
        data: user
    });
}

function guest(user) {
    return request({
        url: 'auth/login/guest',
        method: 'POST',
        data: user
    });
}

function signup(user) {
    return request({
        url: 'auth/register',
        method: 'POST',
        data: user
    });
}

const AuthenticationService = {
    login, guest, signup
}

export default AuthenticationService;