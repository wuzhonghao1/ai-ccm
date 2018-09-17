import 'whatwg-fetch'
import set from 'lodash/set'

export async function fetchPost(url, params = {}) {
    let token = sessionStorage.getItem('Authorization') || 'bearer bd9207510ae5401da96e5a74caafe051';
    let i18n_language = sessionStorage.getItem('i18n_language') || 'zh_CN';
    let opt = {};
    set(opt, ['headers', 'Content-Type'], 'application/json');
    set(opt, ['headers', 'Authorization'], token);
    set(opt, ['headers', 'i18n_language'], i18n_language);
    if (params === '') {
        opt.body = ''
    } else {
        opt.body = JSON.stringify(params)
    }
    opt.mode = 'cors';
    opt.method = 'POST';
    // opt.credentials = 'include';
    let uri = url;
    try {
        const res = await fetch(uri, opt);
        if (res.ok) {
            return res.json();
        } else {
            console.log('HTTP-POST-ERROR:', res);
            return Promise.reject(res);
        }
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}

export async function fetchGet(url, params = {}) {
    let token = sessionStorage.getItem('Authorization') || 'bearer bd9207510ae5401da96e5a74caafe051';
    let i18n_language = sessionStorage.getItem('i18n_language') || 'zh_CN';
    let opt = {};
    set(opt, ['headers', 'Content-Type'], 'application/json');
    set(opt, ['headers', 'Authorization'], token);
    set(opt, ['headers', 'i18n_language'], i18n_language);
    opt.mode = 'cors';
    opt.method = 'GET';
    // opt.credentials = 'include';
    let uri = url;
    try {
        const res = await fetch(uri, opt);
        if (res.ok) {
            return res.json();
        } else {
            console.log('HTTP-POST-ERROR:', res);
            return Promise.reject(res);
        }
    } catch (error) {
        return Promise.reject(error);
    }
}


export function fetchPromise(url, params, method = 'GET') {
    let token = sessionStorage.getItem('Authorization') || 'bearer bd9207510ae5401da96e5a74caafe051';
    let i18n_language = sessionStorage.getItem('i18n_language') || 'zh_CN';

    let opt = {};
    set(opt, ['headers', 'Authorization'], token);
    set(opt, ['headers', 'i18n_language'], i18n_language);
    if (method === 'POST') {
        if (params === '') {
            opt.body = ''
        } else {
            opt.body = JSON.stringify(params)
        }
    }
    opt.mode = 'cors';
    opt.method = method;
    let uri = process.env.GATEWAY_URL + 'v1.0.0' + url;
    return fetch(uri, opt).then(response => response.json());
}

export async function fetchFilePost(url, params, callback) {
    let token = sessionStorage.getItem('Authorization') || 'bearer bd9207510ae5401da96e5a74caafe051';
    let i18n_language = sessionStorage.getItem('i18n_language') || 'zh_CN';
    let opt = {};
    set(opt, ['headers', 'Authorization'], token);
    set(opt, ['headers', 'i18n_language'], i18n_language);
    opt.body = params
    opt.mode = 'cors'
    opt.method = 'POST'
    let uri = process.env.GATEWAY_URL + 'v1.0.0' + url;
    await fetch(uri, opt).then(response => response.json())
        .then((response) => {
            callback(response);
        })
}

window.$ajax = {
    get: fetchGet,
    post: fetchPost
};
