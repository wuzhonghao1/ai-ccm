// 查询客户选择关系信息
import React, {Component} from 'react';
import {fetchGet, fetchPost} from '../../http/asyncHttp';
import Url from '../../store/ajaxUrl';
import {Input, Modal, Select, Table, message} from "antd";
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";

const Option = Select.Option;
const Search = Input.Search;
const columns = [{
    title: '客户编码',
    dataIndex: 'customerId',
    render: (text, record) => (
        record.isOwner !== 0 ? <Link
            to={'/index/createCustomer/detail/' + record.customerId}>{record.customerId}</Link> : record.customerId
    )
}, {
    title: '最后更新人',
    dataIndex: 'lastUpdatedBy'
}, {
    title: '法人代表',
    dataIndex: 'legalPerson'
}, {
    title: '社会统一信用代码',
    dataIndex: 'unifiedSocialCode'
}, {
    title: '客户名称',
    dataIndex: 'customerName'
}];

class QueryCustomer extends Component {
    state = {
        queryCustomerModal: false,
        pagination: {defaultPageSize: 10},
        loading: false,
        selectedRowKeys: [],
        relationTypeDom: [],
        data: [],
        customerCode: '',
        relationType: null
    };

    handleTableChange = (pagination) => {
        this.setState({pagination: pagination});
        this.getCustmer({
            customerCode: this.state.customerCode,
            pageInfo: {
                pageNo: pagination.current,
                pageSize: pagination.pageSize
            }
        });
    };

    getCustmer = async (params) => {
        this.setState({loading: true});
        let response = await window.$ajax.post(Url.customerQuery, params);
        if (response.resultCode === 'CCS-12000') {
            this.setState({
                loading: false, data: [...response.customers.result], pagination: {
                    current: params.pageInfo.pageNo,
                    pageSize: params.pageInfo.pageSize,
                    total: response.customers.count
                }
            });
        } else {
            message.error('获取客户异常，请联系管理员');
            this.setState({
                loading: false
            });
        }

    };
    handleQueryChange = (value) => {
        this.setState({customerCode: value});
        this.getCustmer({
            customerCode: value,
            pageInfo: {
                pageNo: 1,
                pageSize: this.state.pagination.pageSize
            }
        });
    };

    async componentDidMount() {
        let response = await window.$ajax.get(Url.relationType, {});
        let dom = response.quickCodes.map(item => <Option value={item.optionCode}
                                                          key={item.optionCode}>{item.optionMeaning}</Option>);
        this.setState({relationTypeDom: dom});
        this.getCustmer({
            customerCode: '',
            pageInfo: {
                pageNo: 1,
                pageSize: 10
            }
        });
    };

    componentWillReceiveProps(nextProps) {
    }

    handleOk = () => {
        if (this.state.selectedRowKeys.length === 0) {
            message.error('请选择一个客户');
            return;
        }
        if (this.state.relationType === null) {
            message.error('请选择一个类型');
            return;
        }
        let data = this.state.data.filter(item => item.customerId === this.state.selectedRowKeys[0])[0];
        data.relationType = this.state.relationType;
        data.key = new Date().getTime();
        this.props.addCustomerRelations(data);
        // 设置外部状态
        this.props.showFalse();
        this.setState({queryCustomerModal: false});
    };

    onSelectChange = (selectedRowKeys) => {
        let data = this.state.data.filter(item => item.customerId === selectedRowKeys[0])[0];
        let len = this.props.customerRelations.filter(item => item.customerId === data.customerId && item.relationType.key === this.state.relationType.key);
        if (len.length > 0) {
            message.error('不能选择相同类型，相同客户');
            return;
        }
        this.setState({selectedRowKeys});
    };

    render() {
        return (
            <div>
                <Modal
                    title="选择客户"
                    visible={this.state.queryCustomerModal || this.props.show}
                    onOk={this.handleOk}
                    onCancel={() => {
                        this.setState({queryCustomerModal: false});
                        this.props.showFalse()
                    }}
                    destroyOnClose={true}
                    width={900}>
                    <div style={{margin: '10px auto', width: '100%'}}>
                        <Select labelInValue placeholder="请选择类型" style={{width: '100%'}}
                                onChange={(value) => this.setState({relationType: value})}>
                            {this.state.relationTypeDom}
                        </Select>
                    </div>
                    <Search
                        placeholder="请输入客户编码、客户名称、统一代码、法人代表，多关键字用空格隔开"
                        onSearch={value => {
                            this.handleQueryChange(value);
                        }}
                        enterButton
                        style={{marginBottom: '10px'}}
                    />
                    <Table
                        columns={columns}
                        rowKey={record => record.customerId}
                        dataSource={this.state.data}
                        rowSelection={{
                            type: 'radio',
                            onChange: this.onSelectChange,
                            selectedRowKeys: this.state.selectedRowKeys
                        }}
                        pagination={this.state.pagination}
                        loading={this.state.loading}
                        onChange={(pagination) => this.handleTableChange(pagination)}
                        size="middle"
                        rowClassName="query-table"
                        bordered={true}
                    />
                </Modal>
            </div>
        )
    }
}

QueryCustomer.propTypes = {
    showFalse: PropTypes.func,
    show: PropTypes.bool
};

export default QueryCustomer;
