import {
    httpApi
} from '../http/reduxRequestMiddleware';

export const setInputValue = (key) => {
    return {
        type: 'SET_INPUT_VALUE',
        key: key
    }
};

export const update = () => {
    return {
        [httpApi]: {
            url: '/ai-ccm/index/home',
            options: {
                method: 'POST',
            },
            types: ['SET_INPUT_VALUE']
        },
    }
};