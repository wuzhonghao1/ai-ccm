import invokeApi from './index'

function requestJson(prefixG) {
    return invokeApi({
        prefixG,
        version: '',
    }, {
        getToken() {
            return {
                token: sessionStorage.getItem('token') || 'bearer 0997f86c4abd4d08bd4ed30ddba6c50b',
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
}

export default requestJson
