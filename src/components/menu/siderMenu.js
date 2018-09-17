// 系统左侧的menu
import React, {Component} from 'react';
import {Menu, Icon} from 'antd';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types'

const {SubMenu} = Menu;

/**
 * 获取菜单
 * @param {array} list
 */


class SiderMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {selectMenu: [window.location.hash.substr(1, window.location.hash.length)]};
    }

    componentWillReceiveProps(nextProps) {
        // 菜单选中状态切回
        this.setState({selectMenu: [window.location.hash.substr(1, window.location.hash.length)]})
    }

    setSelectKey = (select) => {
        this.setState({selectMenu: select});
    };

    getMenuDom = (list, that) => {
        if (!list) {
            return [];
        }
        let menuDom = [];
        for (let i = 0; i < list.length; i++) {

            if (list[i].childMenu.length > 0) {
                let children = this.getMenuDom(list[i].childMenu);
                menuDom.push(<SubMenu
                    key={list[i].id}
                    title={<span><Icon type={list[i].icon}/><span>{list[i].name}</span></span>}>
                    {children}
                </SubMenu>);
            } else {
                let link = '';
                let url = '';
                if (list[i].url !== undefined) {
                    // 若有参数则拼接在指定的URL后面
                    if (list[i].params !== undefined && list[i].params !== null) {
                        url = list[i].url + '/' + list[i].params;
                    } else {
                        url = list[i].url;
                    }
                    link = <Link to={url} onClick={() => this.setState({selectMenu: [url]})}><Icon
                        type={list[i].icon}/>{list[i].name}</Link>;
                    menuDom.push(<Menu.Item key={url}>{link}</Menu.Item>);
                } else {
                    link = <span><Icon type={list[i].icon}/>{list[i].name}</span>;
                    menuDom.push(<Menu.Item key={list[i].id}>{link}</Menu.Item>);
                }

            }
        }
        return menuDom;
    };

    render() {
        const menuDom = this.getMenuDom(this.props.list, this);
        return <Menu defaultSelectedKeys={['0']} mode="inline" selectedKeys={this.state.selectMenu}>
            {menuDom}
        </Menu>
    }
}

SiderMenu.propTypes = {
    list: PropTypes.array
};

export default SiderMenu;
