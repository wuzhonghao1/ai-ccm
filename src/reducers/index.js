import {routerReducer} from 'react-router-redux';
import {combineReducers} from 'redux';
import foot from './foot';
import app from './app/app';
import createCustomer from './createCustomer/createCustomer';

export default combineReducers({
    foot,
    app,
    createCustomer,
    routing: routerReducer, // 整合路由
});