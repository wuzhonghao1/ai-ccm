// 增加账户
import React, {Component} from 'react';
import {Col, Form, Input, Modal, Row, Select, message} from "antd";
import PropTypes from "prop-types";
import Url from '../../store/ajaxUrl';
import {fetchGet} from '../../http/asyncHttp';
import AddAddress from "./addAddress";
import AddCustomerContact from "./addCustomerContact";

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 5},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
    },
};

class AddAccount extends Component {
    state = {
        addAccountModal: false,
        partyAccountTypeDom: [],
        partyAccountType: [],
        addModelShow: false,
        address: null,
        addCustomerContactShow: false,
        customerContact: null
    };

    componentDidMount() {
        window.$ajax.get(Url.partyAccountType, {}).then(response => {
            if (response.resultCode === 'CCS-12000') {
                this.setState({partyAccountType: response.quickCodes});
                let dom = response.quickCodes.map(item => <Option value={item.codeId}
                                                                  key={item.codeId}>{item.optionMeaning}</Option>);
                this.setState({partyAccountTypeDom: dom});
            } else {
                message.error('获取账户类型异常，请联系管理员');
            }

        });
    }

    setAddress = (value) => {
        this.setState({addModelShow: false, address: value});
    };

    setCustomerContact = (value) => {
        this.setState({addCustomerContactShow: false, customerContact: value});
    };

    handleOk = () => {
        if (!this.state.address) {
            message.error('请添加地址信息');
            return;
        }
        if (!this.state.customerContact) {
            message.error('请添加联系人信息');
            return;
        }

        this.props.form.validateFields(
            ['accountTypeCode', 'accountName', 'bankOfDeposit', 'bankBranch', 'bankAccount', 'currency', 'description'],
            {},
            (error, values) => {
                if (!error) {
                    values.key = new Date().getTime();
                    values.accountTypeCode = this.state.partyAccountType.filter(item => item.codeId === values.accountTypeCode)[0];
                    values.address = this.state.address;
                    values.customerContact = this.state.customerContact;
                    this.props.addAccount(values);
                    // 设置外部状态
                    this.props.showFalse();
                    this.setState({addAccountModal: false});
                }
            });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <Modal
                    title="新增账户信息"
                    visible={this.state.addAccountModal || this.props.show}
                    onOk={this.handleOk}
                    maskClosable={false}
                    onCancel={() => {
                        this.setState({addAccountModal: false});
                        this.props.showFalse()
                    }}
                    destroyOnClose={true}
                    width={800}>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            {...formItemLayout}
                            label="账户类型"
                        >
                            {getFieldDecorator('accountTypeCode', {
                                rules: [{
                                    required: true, message: '账户类型不能为空'
                                }],
                            })(
                                <Select placeholder="请选择账户类型">
                                    {this.state.partyAccountTypeDom}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="账户名"
                        >
                            {getFieldDecorator('accountName', {
                                rules: [{
                                    required: true, message: '账户名不能为空'
                                }],
                            })(
                                <Input type="text" placeholder="请输入账户名"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="开户行"
                        >
                            {getFieldDecorator('bankOfDeposit', {
                                rules: [{
                                    required: true, message: '开户行不能为空'
                                }],
                            })(
                                <Input type="text" placeholder="请输入开户行"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="支行"
                        >
                            {getFieldDecorator('bankBranch', {
                                rules: [{
                                    required: true, message: '支行不能为空'
                                }],
                            })(
                                <Input type="text" placeholder="请输入支行"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="银行帐户"
                        >
                            {getFieldDecorator('bankAccount', {
                                rules: [{
                                    required: true,message: '银行帐户不能为空'
                                }],
                            })(
                                <Input type="text" placeholder="请输入银行帐户"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="币种"
                        >
                            {getFieldDecorator('currency', {
                                rules: [{
                                    required: true, message: '币种不能为空'
                                }],
                            })(
                                <Input type="text" placeholder="请输入币种"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="描述"
                        >
                            {getFieldDecorator('description', {
                                rules: [{
                                    required: true, message: '描述不能为空'
                                }],
                            })(
                                <Input type="text" placeholder="请输入描述"/>
                            )}
                        </FormItem>
                        <Row>
                            <Col span={4}>
                                <a type="primary" onClick={() => this.setState({addModelShow: true})}>添加地址</a>
                            </Col>
                            <Col span={3}>
                                地址信息：
                            </Col>
                            <Col span={16}>
                                {this.state.address ?
                                    this.state.address.city ? (this.state.address.city[0].label +
                                        this.state.address.city[1].label +
                                        this.state.address.city[2].label) : '' +
                                        this.state.address.address1 +
                                        (this.state.address.address2 === undefined ? '' : this.state.address.address2) +
                                        (this.state.address.address3 === undefined ? '' : this.state.address.address3) +
                                        (this.state.address.address4 === undefined ? '' : this.state.address.address4) : null}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4}>
                                <a type="primary"
                                   onClick={() => this.setState({addCustomerContactShow: true})}>添加联系人信息</a>
                            </Col>
                            <Col span={3}>
                                联系人信息：
                            </Col>
                            <Col span={16}>
                                {this.state.customerContact ? this.state.customerContact.fullName + '/' + this.state.customerContact.mobile : ''}
                                {this.state.customerContact && this.state.customerContact.address ?
                                    this.state.customerContact.address.city ? (this.state.customerContact.address.city[0].label +
                                        this.state.customerContact.address.city[1].label +
                                        this.state.customerContact.address.city[2].label) : '' +
                                        this.state.customerContact.address.address1 +
                                        (this.state.customerContact.address.address2 === undefined ? '' : this.state.customerContact.address.address2) +
                                        (this.state.customerContact.address.address3 === undefined ? '' : this.state.customerContact.address.address3) +
                                        (this.state.customerContact.address.address4 === undefined ? '' : this.state.customerContact.address.address4) : null}
                            </Col>
                        </Row>
                    </Form>
                    <AddAddress showFalse={(value) => this.setAddress(value)}
                                show={this.state.addModelShow} isAdmin={false}/>
                    <AddCustomerContact showFalse={(value) => this.setCustomerContact(value)}
                                        show={this.state.addCustomerContactShow}
                                        addCustomerContact={this.props.addCustomerContact}
                                        isAdmin={false}/>
                </Modal>
            </div>
        )
    }
}

AddAccount.propTypes = {
    showFalse: PropTypes.func,
    show: PropTypes.bool
};
const AddAccountForm = Form.create()(AddAccount);
export default AddAccountForm;
