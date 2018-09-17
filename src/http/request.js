import invokeApi from './index';

// eslint-disable-next-line import/prefer-default-export
export const requestJson = invokeApi({
    prefixG: '',
    version: '',
}, {
    getToken() {
        return {
            token: sessionStorage.getItem('Authorization') || 'bearer bd9207510ae5401da96e5a74caafe051',
            refreshToken: sessionStorage.getItem('refreshToken'),
        }
    },
    setToken(tokenInfo) {
        sessionStorage.setItem('token', `${tokenInfo.token_type} ${tokenInfo.access_token}`);
        sessionStorage.setItem('refreshToken', tokenInfo.refresh_token);
        sessionStorage.setItem('activeTime', Date.now());
        sessionStorage.setItem('expires_in', tokenInfo.expires_in);
    },
    removeToken() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('activeTime');
        sessionStorage.removeItem('expires_in');
    },
})
