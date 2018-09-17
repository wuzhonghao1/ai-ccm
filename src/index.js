import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/app';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
// 组件库样式
import 'antd/dist/antd.less';
import {LocaleProvider} from 'antd';
// 中文
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'normalize.css';
// redux
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';
// http请求中间件
import requestMiddleware from './http/reduxRequestMiddleware';
// 数据路由同步
import {ConnectedRouter, routerMiddleware} from 'react-router-redux';
import createHistory from 'history/createHashHistory'
// 引用reducers
import rootReducer from './reducers/index';

moment.locale('en');
let lang = window.sessionStorage.getItem('i18n_language') || 'zh_CN';
let localLang = zhCN;
if (lang === 'zh_CN') {
    localLang = zhCN;
    moment.locale('zh-cn');
} else {
    localLang = undefined;
    moment.locale('en');
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
const history = createHistory(); // 浏览器history对象
const middleware = [thunk, routerMiddleware(history), requestMiddleware]; // 中间件
const enhancer = composeEnhancers(applyMiddleware(...middleware));
const store = createStore(
    rootReducer,
    enhancer,
);

function DomRender() {
    ReactDOM.render(
        <LocaleProvider locale={localLang}>
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Router>
                        <Switch>
                            <Route path="/" component={App}/>
                            <Route component={App}/>
                        </Switch>
                    </Router>
                </ConnectedRouter>
            </Provider>
        </LocaleProvider>, document.getElementById('root'));
}

DomRender();
