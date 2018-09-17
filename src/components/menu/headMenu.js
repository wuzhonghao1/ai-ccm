// 系统头部的menu
import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Menu} from 'antd';

// import PropTypes from 'prop-types';
class HeadMenu extends Component {
    goSys = (url) => {
        if (url) {
            if (url.startsWith('http') || url.startsWith('https')) {
                window.open(url);
            } else {
                this.props.history.push('/');
            }
        }
    };

    render() {

        // 菜单渲染
        const menuDom = this.props.list.map((item, index) =>
            <Menu.Item key={item.id} onClick={() => this.goSys(item.url)}>{item.name}</Menu.Item>
        );
        return <Menu mode="horizontal"
                     defaultSelectedKeys={[window.sessionStorage.getItem('applicationId')]}
                     style={{lineHeight: '63px', marginLeft: 200}}>
            {menuDom}
        </Menu>
    }
}

HeadMenu.propTypes = {
    list: PropTypes.array
};
export default HeadMenu;
