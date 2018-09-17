import React, {Component} from 'react';
import './slider.less';
import {Layout, Menu, Icon, Dropdown, Button, Spin} from 'antd';
import {Link} from 'react-router-dom';
import HeadMenu from './menu/headMenu';
import SiderMenu from './menu/siderMenu';
import SystemRoute from '../route/systemRoute';
import Url from '../store/ajaxUrl';
// const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {collapsed: false, loading: false, menuList:[]};
    }

    async componentDidMount () {
        // this.setState({loading: true});
        this.props.history.push('/');
        await this.props.getApplicationMenu();
        this.setState({loading: false});
        this.setState({menuList: this.props.menuList});
        // 默认推送首页查询
        if (this.props.menuList) {
            if (this.props.menuList.length !== 1 && this.props.menuList.length > 0) {
                this.props.history.push('/index/query');
            } else {
                this.props.history.push('/');
            }
        }
    }


    onCollapse = (collapsed) => {
        this.setState({collapsed});
    };
    /**
     * 切换语言
     */
    setLang = (lang) => {
        window.sessionStorage.setItem('i18n_language', lang);
        window.location.reload();
    };


    render() {

        function handleMenuClick(e) {
        }

        const menu = (
            <Menu onClick={handleMenuClick}>
                <Menu.Item key="1" onClick={() => window.open(Url.help)}><Icon type="appstore-o"/>操作手册</Menu.Item>
                {/*<Menu.Item key="1"><Icon type="appstore-o"/>首选项</Menu.Item>*/}
                {/*<SubMenu*/}
                    {/*key="2"*/}
                    {/*title={<span><Icon type="message" style={{marginRight: 7}}/>语言</span>}>*/}
                    {/*<Menu.Item key="3" onClick={() => this.setLang('zh_CN')}>中文</Menu.Item>*/}
                    {/*<Menu.Item key="4" onClick={() => this.setLang('en_US')}>English</Menu.Item>*/}
                {/*</SubMenu>*/}
            </Menu>
        );
        const logo = require('../assets/logo.png');
        return (
            <Spin spinning={this.state.loading} tip="拼命加载中...">
                <Layout>
                    <Header className="header" style={{position: 'fixed', zIndex: 2, width: '100%'}}>
                        <div className='logo'>
                            <Link to="/" className="home">
                                <img src={logo} alt="CCM"/>
                            </Link>
                        </div>
                        {/* 头部菜单 */}
                        <HeadMenu list={this.props.applicationList} history={this.props.history}/>
                        <Dropdown overlay={menu}>
                            <Button
                                style={{marginLeft: 8, width: 120, position: 'absolute', top: '15px', right: '30px'}}>
                                <Icon type="user"/>{window.sessionStorage.getItem('userName')}<Icon type="down-square-o"/>
                            </Button>
                        </Dropdown>
                    </Header>
                    <Layout style={{minHeight: '100vh'}}>
                        <Sider
                            style={{
                                background: '#fff',
                                height: '100vh',
                                position: 'fixed',
                                left: 0,
                                top: 66
                            }}
                            collapsible
                            collapsed={this.state.collapsed}
                            onCollapse={this.onCollapse}>
                            <div className="logo"/>
                            {/* 左侧菜单 */}
                            <SiderMenu list={this.state.menuList} match={this.props.match}/>
                        </Sider>
                        <Layout style={{padding: 6, marginLeft: this.state.collapsed ? 80 : 200}}>
                            <Content style={{background: '#fff', marginTop: 66, borderRadius: 5}}>
                                <SystemRoute {...this.props}/>
                            </Content>
                        </Layout>
                    </Layout>
                </Layout>
            </Spin>
        );
    }
}

export default App;
