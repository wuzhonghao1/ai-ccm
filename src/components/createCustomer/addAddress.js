// 新增地址
import React, {Component} from 'react';
import {Form, Input, Modal, Cascader, Select, message} from "antd";
import PropTypes from "prop-types";
import {fetchGet} from "../../http/asyncHttp";
import Url from "../../store/ajaxUrl";

const Option = Select.Option;
const FormItem = Form.Item;
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

class AddAddress extends Component {
    state = {
        addAddressModal: false,
        showMore: false,
        option: [],
        city: null,
        territoryData: [],
        isShowCity: true
    };

    add = (dataChange, data, isLeaf = false) => {
        data.provinces.forEach(element => {
            dataChange.push({
                isLeaf,
                classCode: element.code,
                value: element.name,
                label: element.name
            })
        });
        return dataChange;
    };

    componentDidMount() {
        window.$ajax.get(Url.provinceAll, {}).then(response => {
            if (response.resultCode === 'CCS-12000') {
                let data = this.add([], response);
                this.setState({option: data});
            } else {
                message.error('获取所有省份异常，请联系管理员');
            }

        });
        window.$ajax.get(Url.territoryGet, {}).then((data) => {
            if (data.resultCode === 'CCS-12000') {
                // let dom = data.quickCodes.map(item => <Option value={item.codeId} key={item.codeId}>{item.optionMeaning}</Option>);
                this.setState({territoryData: data.territories});
            } else {
                message.error('获取国家异常，请联系管理员');
            }
        });
    }

    onChange = (value, selectedOptions) => {
        this.setState({city: selectedOptions});
    };

    loadData = (selectedOptions) => {
        // console.log(selectedOptions);
        let targetOption = selectedOptions[selectedOptions.length - 1];
        let selectedOptionsClassCode = targetOption.classCode;
        let dataChange = [];
        targetOption.loading = true;
        let url = selectedOptions.length <= 1 ? Url.provinceMunicipalities + selectedOptionsClassCode :
            Url.provinceRegions + selectedOptionsClassCode;
        window.$ajax.get(url).then((data) => {
            if (data.resultCode === 'CCS-12000') {
                dataChange = this.add(dataChange, data, selectedOptions.length >= 2)
            } else {
                dataChange = [];
                message.error('获取市区异常，请联系管理员')
            }

        }).then(() => {
            targetOption.loading = false;
            selectedOptions[selectedOptions.length - 1].children = dataChange;
            this.setState({
                option: this.state.option
            });
        });

    };
    setTerritoryName = (value) => {
        this.props.form.setFieldsValue({territoryName: this.state.territoryData.filter(item => item.code === value)[0].shortName});
        if (this.state.territoryData.filter(item => item.code === value)[0].shortName !== '中国') {
            this.setState({isShowCity: false});
        } else {
            this.setState({isShowCity: true});
        }
    };

    handleOk = () => {
        if (this.state.isShowCity && this.state.city.length !== 3) {
            message.error('请选择省/市/县到县');
            return;
        }
        this.props.form.validateFields(
            ['addressName', 'description', 'province', 'city', 'county', 'address1', 'address2', 'address3', 'address4', 'postCode', 'territoryName', 'territoryCode'],
            {},
            (error, values) => {
                if (!error) {
                    values.key = new Date().getTime();
                    if (this.state.isShowCity) {
                        values.city = this.state.city;
                    }
                    if (this.props.isAdmin) {
                        this.props.addAddress(values);
                    }
                    // 设置外部状态
                    this.props.showFalse(values);
                    this.setState({addAddressModal: false});
                }
            });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <Modal
                    title="新增地址"
                    visible={this.state.addAddressModal || this.props.show}
                    maskClosable={false}
                    onOk={this.handleOk}
                    onCancel={() => {
                        this.setState({addAddressModal: false});
                        this.props.showFalse()
                    }}
                    destroyOnClose={true}
                    width={800}>
                    <Form onSubmit={this.handleSubmit}>
                        {getFieldDecorator('territoryCode', {})(
                            <Input placeholder="请输入区域" size="small" type='hidden'/>
                        )}
                        <FormItem
                            {...formItemLayout}
                            label="名称"
                        >
                            {getFieldDecorator('addressName', {})(
                                <Input type="text" placeholder="请输入名称"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="描述"
                        >
                            {getFieldDecorator('description', {})(
                                <Input type="text" placeholder="请输入描述"/>
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
                            })(
                                <Input type="hidden"/>
                            )}
                        </FormItem>
                        {this.state.isShowCity ?
                            <FormItem
                                {...formItemLayout}
                                label="省/市/县"
                            >
                                {getFieldDecorator('province', {})(
                                    <Cascader
                                        placeholder="请选择省/市/县"
                                        options={this.state.option}
                                        loadData={this.loadData}
                                        onChange={this.onChange}
                                        changeOnSelect
                                    />
                                )}
                            </FormItem>
                            : undefined}
                        <FormItem
                            {...formItemLayout}
                            label="地址行1"
                        >
                            {getFieldDecorator('address1', {
                                rules: [{
                                    required: true, message: '地址行1不能为空'
                                }],
                            })(
                                <div>
                                    <Input type="text" style={{width: '90%'}} placeholder="请输入地址行1"/>
                                    {
                                        this.state.showMore ?
                                            <a onClick={() => this.setState({showMore: !this.state.showMore})}>收缩</a>
                                            : <a onClick={() => this.setState({showMore: !this.state.showMore})}>更多行</a>
                                    }
                                </div>
                            )}
                        </FormItem>
                        {this.state.showMore ?
                            <div>
                                <FormItem
                                    {...formItemLayout}
                                    label="地址行2"
                                >
                                    {getFieldDecorator('address2', {})(
                                        <Input type="text" placeholder="请输入地址行2"/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="地址行3"
                                >
                                    {getFieldDecorator('address3', {})(
                                        <Input type="text" placeholder="请输入地址行3"/>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="地址行4"
                                >
                                    {getFieldDecorator('address4', {})(
                                        <Input type="text" placeholder="请输入地址行4"/>
                                    )}
                                </FormItem>
                            </div>
                            : null
                        }

                        <FormItem
                            {...formItemLayout}
                            label="邮政编码"
                        >
                            {getFieldDecorator('postCode', {})(
                                <Input type="text" style={{width: '100%'}} placeholder="请输入邮政编码"/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

AddAddress.propTypes = {
    showFalse: PropTypes.func,
    show: PropTypes.bool,
    // 是否添加到组数据
    isAdmin: PropTypes.bool
};
const AddAddressForm = Form.create()(AddAddress);
export default AddAddressForm;
