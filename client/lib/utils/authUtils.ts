import { UserParams } from '@/lib/types';
import cookie from 'js-cookie';
import Router from 'next/router';

// set in cookie
export const setCookie = (key: string, value: string) => {
    cookie.set(key, value, {
        expires: 1
    });
};

// remove from cookie
export const removeCookie = (key: string) => {
    cookie.remove(key);
};


export const getCookie = (key: string) => {
    return cookie.get(key);
};

// set in localstoarge
export const setLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
};

// remove from localstorage
export const removeLocalStorage = (key: string) => {
    localStorage.removeItem(key);
};

// authenticate user by passing data to cookie and localstorage during signin
export const authenticate = (data: { token: any; user: UserParams; }, next: (() => void) | null = null) => {
    console.log('AUTHENTICATE HELPER ON SIGNIN RESPONSE', data);

    setCookie('access_token', data.token);
    setLocalStorage('user', data.user);

    if (next) {
        next();
    }
};

export const getToken = () => {
    return getCookie('access_token');
}

// access user info from localstorage
export const isAuth = () => {
    const cookieChecked = getCookie('access_token');
    if (cookieChecked) {
        if (localStorage.getItem('user')) {
            return JSON.parse(localStorage.getItem('user') ?? '');
        } else {
            return false;
        }
    }
};

export const clearUserData= () => {
    removeCookie('access_token');
    removeLocalStorage('user');
}

export const logOutUser = () => {
    
    clearUserData();

    //Router.push('/');
};

export const updateUser = (user: UserParams, next: (() => void) | null = null) => {
    if (localStorage.getItem('user')) {
        let auth = JSON.parse(localStorage.getItem('user') ?? '');
        auth = user;
        localStorage.setItem('user', JSON.stringify(auth));
        if(next) {
            next();
        }
    }
};

export const getUserData = () => {
    if (localStorage.getItem('user')) {
        return JSON.parse(localStorage.getItem('user') ?? '');
    }
}