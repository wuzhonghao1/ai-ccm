// 权限申请页面
import React, {Component} from 'react';
import {
    Layout,
    Card,
    Button,
    Row,
    Col,
    Icon,
    Drawer,
    Menu,
    Divider,
    Spin,
    message,
    Radio,
    Select,
    Modal,
    Input
} from 'antd';
import Url from '../../store/ajaxUrl';

const {Content} = Layout;
const {TextArea} = Input;
const {SubMenu} = Menu;
const RadioGroup = Radio.Group;

const Option = Select.Option;

class ApplyPermission extends Component {
    state = {
        visible: false,
        roles: [],
        menus: [],
        applications: [],
        defaultValue: undefined,
        globalLoading: false,
        approverList: [],
        approverId: null,
        have: null
    };

    /**
     *  通过地址的判断：审批、详情
     **/
    async componentDidMount() {

        this.setState({globalLoading: true});
        let response = await window.$ajax.get(Url.roleGet);
        if (response.resultCode === 'CCS-12000') {
            this.setState({roles: response.roles});
            if (!this.props.match.params.roleId) {

                let haveRole = response.roles.filter(item => item.selected === 1).map(item2 => item2.roleId);
                this.setState({defaultValue: haveRole.length > 0 ? haveRole[0] : undefined});
                this.setState({have: haveRole.length > 0 ? haveRole[0] : undefined})
            } else {
                this.setState({defaultValue: parseInt(this.props.match.params.roleId, 10)});
                this.setState({have: parseInt(this.props.match.params.roleId, 10)});
            }
        } else {
            message.error('获取角色信息异常，请联系管理员');
        }
        if (!this.props.match.params.roleId && !this.props.match.params.requestId) {
            // 销售管理员
            let managerAll = await window.$ajax.get(Url.permissionApproveGet);
            if (managerAll.resultCode === 'CCS-12000') {
                this.setState({approverList: managerAll.users});
            } else {
                message.error('获取销售管理员异常，请联系管理员');
            }
        }
        this.setState({globalLoading: false});
    }

    showDrawer = (value, applications) => {
        this.setState({
            visible: true,
            menus: value,
            applications: applications
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    getMenuDom = (list, that) => {
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
                    if (list[i].params !== undefined) {
                        url = list[i].url + '/' + list[i].params;
                    } else {
                        url = list[i].url;
                    }
                    link = <span><Icon
                        type={list[i].icon}/>{list[i].name}</span>;
                    menuDom.push(<Menu.Item key={url}>{link}</Menu.Item>);
                } else {
                    link = <span><Icon type={list[i].icon}/>{list[i].name}</span>;
                    menuDom.push(<Menu.Item key={list[i].id}>{link}</Menu.Item>);
                }

            }
        }
        return menuDom;
    };

    closeWindow = () => {
        this.props.history.push('/');
    };
    onChange = (checkedValues) => {
        this.setState({defaultValue: checkedValues.target.value});
    };

    submit = async () => {
        if (this.state.defaultValue === this.state.have) {
            message.error('您已经拥有该角色，无需重复申请');
            return;
        }
        if (!this.state.approverId) {
            message.error('请选择审批人');
            return;
        }
        this.setState({globalLoading: true});
        let response = await window.$ajax.post(Url.roleApply, {
            approverId: this.state.approverId,
            roleId: this.state.defaultValue
        });
        if (response.resultCode === 'CCS-12000') {
            Modal.success({
                title: '提示',
                content: '提交成功',
                onOk: () => {
                    this.props.history.push('/index/myRequest');
                }
            });
        } else {
            Modal.error({
                title: '提示',
                content: response.resultMessage
            });
        }
        this.setState({globalLoading: false});
    };

    render() {

        // const logo = require('../../assets/logo.png');
        return (
            <Spin tip="Loading..." spinning={this.state.globalLoading}>
                <Layout style={{background: '#ECECEC'}}>
                    {/*<Header className="header" style={{background: '#f4a034'}}>*/}
                    {/*<div className="logo">*/}
                    {/*<img src={logo} alt="CCM" style={{height: 50}}/>*/}
                    {/*</div>*/}
                    {/*<div style={{marginLeft: '43%'}}>*/}
                    {/*<h2 style={{color: '#fff'}}>客户管理系统权限申请</h2>*/}
                    {/*</div>*/}
                    {/*</Header>*/}
                    <Content style={{height: '100%', width: '100%'}}>
                        <Card title="选择权限" bordered={false} style={{width: '100%', minHeight: '80vh'}}>
                            <div>
                                <RadioGroup name="radiogroup" value={this.state.defaultValue}
                                            onChange={this.onChange} style={{width: '100%'}}
                                            disabled={this.props.match.params.roleId !== undefined || this.props.match.params.approverId !== undefined}>
                                    <Row>
                                        {this.state.roles.map(item =>
                                            <Col span={6} key={item.roleId}>
                                                <Radio value={item.roleId}>{item.roleName}</Radio>
                                                <Icon type="question-circle"
                                                      onClick={() => this.showDrawer(item.menus, item.applications)}/>
                                            </Col>
                                        )}
                                    </Row>
                                </RadioGroup>
                                {/*<Checkbox.Group style={{width: '100%'}} value={this.state.defaultValue}*/}
                                {/*onChange={this.onChange}>*/}
                                {/**/}
                                {/*</Checkbox.Group>*/}
                            </div>
                            {!this.props.match.params.roleId && !this.props.match.params.requestId ?
                                <div>
                                    <Divider/>
                                    <div style={{width: 400, margin: '0 auto'}}>
                                        审批人：
                                        <Select placeholder="请选择审批人" size="small" style={{width: '80%'}}
                                                onChange={value => this.setState({approverId: value})}>
                                            {this.state.approverList.map(item => <Option value={item.userId}
                                                                                         key={item.userId}>{item.userName}</Option>)}
                                        </Select>
                                    </div>
                                    <div style={{position: 'absolute', bottom: '30px', left: '42%'}}>
                                        <Button icon="check" type="primary" style={{marginRight: '60px'}}
                                                onClick={this.submit}>提交</Button>
                                        <Button icon="close" onClick={this.closeWindow}>取消</Button>
                                    </div>
                                </div>
                                : undefined}
                            {this.props.match.params.roleId && this.props.match.params.requestId ?
                                <div>
                                    <Divider/>
                                    <Row>
                                        <Col span={6} style={{textAlign: 'right'}}>
                                            审批意见：
                                        </Col>
                                        <Col span={18}>
                                            <TextArea placeholder="请输入审批意见" value={this.state.approveMessage}
                                                      onChange={(value) => this.setState({approveMessage: value.target.value})}
                                                      autosize style={{width: '70%'}}/>
                                        </Col>
                                    </Row>

                                    <div style={{position: 'absolute', bottom: '30px', left: '42%'}}>
                                        <Button icon="check" type="primary" style={{marginRight: '60px'}}
                                                onClick={() => this.approve('')}>同意</Button>
                                        <Button icon="close" onClick={() => this.approve('')}>拒绝</Button>
                                    </div>
                                </div>
                                : undefined
                            }

                        </Card>
                    </Content>
                    <Drawer
                        title="角色权限"
                        placement="right"
                        closable={false}
                        onClose={this.onClose}
                        visible={this.state.visible}>
                        <Divider>菜单权限</Divider>
                        <Menu defaultSelectedKeys={['0']} mode="inline">
                            {this.getMenuDom(this.state.menus)}
                        </Menu>


                        <Divider>应用权限</Divider>
                        {this.state.applications.map(item => <Button block key={item.id}
                                                                     style={{marginTop: 5}}>{item.name}</Button>)}
                    </Drawer>
                    {/*<Footer style={{textAlign: 'center'}}>*/}
                    {/*亚信科技(中国)有限公司版权所有 2018*/}
                    {/*</Footer>*/}
                </Layout>
            </Spin>
        )
    }
}

export default ApplyPermission;
