import {GET_APPLICATION_MENU} from '../store/actionType';
import {
    httpApi
} from '../http/reduxRequestMiddleware';
import Url from '../store/ajaxUrl';

export const getApplicationMenu = () => {
    return {
        [httpApi]: {
            url: Url.getSystemMenu,
            options: {
                method: 'GET',
            },
            types: [GET_APPLICATION_MENU]
        },
    }
};