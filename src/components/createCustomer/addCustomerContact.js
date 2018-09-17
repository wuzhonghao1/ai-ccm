// 新增联系人
import React, {Component} from 'react';
import {Modal, Form, Input, message, Select} from 'antd';
import PropTypes from 'prop-types';
import AiMailingAddress from "../common/aiMailingAddress";
import Url from "../../store/ajaxUrl";
import './addCustomerContact.less';
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

class AddCustomerContact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            addCustomerContactModal: false,
            showAddCustomer: false,
            address: null,
            territoryData: [],
            isShowCity: true,
            city: undefined,
            isCity: false,
            ownerList: []
        };
    }

    setTerritoryName = (value) => {
        this.props.form.setFieldsValue({territoryName: this.state.territoryData.filter(item => item.code === value)[0].shortName});
        if (this.state.territoryData.filter(item => item.code === value)[0].shortName !== '中国') {
            this.setState({isShowCity: false});
        } else {
            this.setState({isShowCity: true});
        }
    };
    handleOk = () => {
        this.props.form.validateFields(
            ['fullName', 'department', 'job', 'tel', 'mobile', 'emailAddress', 'address', 'province', 'territoryCode', 'territoryName'],
            {}, (err, values) => {
                if (!err) {
                    if (!this.state.city) {
                        if (values.territoryCode === 'CN') {
                            this.setState({isCity: true});
                            return;
                        }
                    } else {
                        if (values.territoryCode === 'CN' && this.state.city.length !== 3) {
                            message.error('请选择将省市县完整');
                            return;
                        }
                    }
                    values.owner = [];
                    values.key = new Date().getTime();
                    if (values.territoryCode === 'CN') {
                        values.city = this.state.city;
                    }
                    if (this.props.isAdmin && this.props.action === 'add') {
                        this.props.addCustomerContact(values);
                    }
                    if (this.props.action === 'edit') {
                        values.owner = this.state.ownerList;
                        let temp = {...this.props.editObj, ...values};
                        this.props.updateCustomerContacts({index: this.props.index, value: temp});
                    }

                    // 设置外部状态
                    this.props.showFalse(values);
                    this.setState({addCustomerContactModal: false, city: undefined, isCity: false});
                }
            });

    };
    onMailingAddressChange = (value, selectedOptions) => {
        this.setState({city: selectedOptions, isCity: false});
        this.props.form.setFieldsValue({province: selectedOptions.map(item => item.label).join('/')});
    };

    componentDidMount() {
        window.$ajax.get(Url.territoryGet, {}).then((data) => {
            if (data.resultCode === 'CCS-12000') {
                this.setState({territoryData: data.territories});
            } else {
                message.error('获取国家异常，请联系管理员');
            }
        });
        if (this.props.action === 'edit') {
            this.setDetail(this.props.editObj);
        }
    }

    componentWillReceiveProps() {

    }

    /**
     * 表单编辑
     * @param editObj   将要编辑的对象
     */
    setDetail = (editObj) => {

        if (editObj.territoryCode === 'CN') {
            console.log(editObj);
            this.setState({isShowCity: true}, () => {
                this.props.form.setFieldsValue({
                    province: `${editObj.city[0].label}/${editObj.city[1].label}/${editObj.city[2].label}`
                });
            });
        } else {
            this.setState({isShowCity: false});
        }
        this.setState({city: editObj.city, ownerList: editObj.owner});
        this.props.form.setFieldsValue({
            fullName: editObj.fullName,
            department: editObj.department,
            job: editObj.job,
            tel: editObj.tel,
            mobile: editObj.mobile,
            emailAddress: editObj.emailAddress,
            territoryCode: editObj.territoryCode,
            territoryName: editObj.territoryName,
            address: editObj.address
        });

    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <Modal
                    title="新增联系人"
                    visible={this.state.addCustomerContactModal || this.props.show}
                    maskClosable={false}
                    onOk={this.handleOk}
                    onCancel={() => {
                        this.setState({
                            addCustomerContactModal: false,
                            isShowCity: true,
                            city: undefined,
                            isCity: false
                        });
                        this.props.showFalse()
                    }}
                    destroyOnClose={true}
                    width={800}>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            {...formItemLayout}
                            label="姓名"
                        >
                            {getFieldDecorator('fullName', {
                                rules: [{
                                    required: true, message: '姓名不能为空'
                                }, {
                                    max: 30, message: '长度超出限制'
                                }],
                            })(
                                <Input type="text" placeholder="请输入姓名"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="部门"
                        >
                            {getFieldDecorator('department', {
                                rules: [{
                                    required: true, message: '部门不能为空'
                                }, {
                                    max: 80, message: '长度超出限制'
                                }],
                            })(
                                <Input type="text" placeholder="请输入部门"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="职位"
                        >
                            {getFieldDecorator('job', {
                                rules: [{
                                    required: true, message: '职位不能为空'
                                }, {
                                    max: 80, message: '长度超出限制'
                                }],
                            })(
                                <Input type="text" placeholder="请输入职位"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="电话"
                        >
                            {getFieldDecorator('tel', {
                                rules: [{
                                    max: 20, message: '长度超出限制'
                                }],
                            })(
                                <Input type="text" placeholder="请输入电话"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="手机"
                        >
                            {getFieldDecorator('mobile', {
                                rules: [{
                                    required: true, message: '手机不能为空'
                                }, {
                                    max: 80, message: '长度超出限制'
                                }],
                            })(
                                <Input type='text' placeholder="请输入手机"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="邮箱">
                            {getFieldDecorator('emailAddress', {
                                rules: [{type: 'email', message: '格式不正确'}, {
                                    max: 80, message: '长度超出限制'
                                },{
                                    required: true, message: '邮箱不能为空'
                                }],
                            })(
                                <Input type="text" placeholder="请输入邮箱"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="国家"
                        >
                            {getFieldDecorator('territoryCode', {
                                rules: [{
                                    required: true, message: '国家不能为空'
                                }],
                                initialValue: 'CN'
                            })(
                                <Select onSelect={this.setTerritoryName} placeholder="请选择国家">
                                    {this.state.territoryData.map(item => <Option value={item.code}
                                                                                  key={item.code}>{item.shortName}</Option>)}
                                </Select>
                            )}
                            {getFieldDecorator('territoryName', {
                                rules: [{
                                    required: true
                                }],
                                initialValue: '中国'
                            })(
                                <Input type="hidden"/>
                            )}
                        </FormItem>
                        {this.state.isShowCity ?
                            <FormItem
                                {...formItemLayout}
                                label="省/市/县"
                                help={this.state.isCity ? '请选择省/市/县' : ''}
                                required={true}
                                validateStatus={this.state.isCity ? 'error' : ''}
                            >

                                <AiMailingAddress
                                    param={{
                                        rules: [{
                                            required: true, message: '国家不能为空'
                                        }],
                                    }}
                                    size='default'
                                    getFieldDecorator={getFieldDecorator} fieldName='province'
                                    onSelect={this.onMailingAddressChange}/>

                            </FormItem>
                            : undefined}
                        <FormItem
                            {...formItemLayout}
                            label="详细地址"
                        >
                            {getFieldDecorator('address', {
                                rules: [{
                                    required: true, message: '详细地址不能为空'
                                }, {
                                    max: 80, message: '长度超出限制'
                                }],
                            })(
                                <Input type="text" placeholder="请输入详细地址"/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}

// 默认值
AddCustomerContact.propTypes = {
    showFalse: PropTypes.func,
    show: PropTypes.bool,
    action: PropTypes.string
};
AddCustomerContact.defaultProps = {
    action: 'add'
};

const AddCustomerContactForm = Form.create()(AddCustomerContact);
export default AddCustomerContactForm;
