// 客户关系组件
import React, {Component} from 'react';
import {Table, Row, Col, Icon, Button} from 'antd';
import QueryCustomer from './queryCustomer';
import PropTypes from 'prop-types';

class CustomerRelations extends Component {
    state = {
        showAddCustomer: false
    };

    // 行定义
    columns = [{
        title: '关系类型',
        dataIndex: 'name',
        width: '30%',
        render: (text, record) => record.relationType.label
    }, {
        title: '关联方编号',
        dataIndex: 'customerId',
        width: '20%'
    }, {
        title: '名称',
        dataIndex: 'customerName',
        width: '30%'
    }, {
        title: '操作',
        dataIndex: 'action',
        width: '20%',
        render: (text, record) => (this.props.isDetail ? undefined : <Icon type="delete" onClick={() => this.deleteRow(record)}/>)
    }];
    /**
     * 删除行
     */
    deleteRow = (value) => {
        this.props.setDisableCustomerRelations([...this.props.disableCustomerRelations, value]);
        this.props.deleteCustomerRelations(value);
    };

    add = () => {
        this.setState({showAddCustomer: true});
    };

    cancel = () => {
        // 将旧数据最后一个取出
        let values = this.props.disableCustomerRelations[this.props.disableCustomerRelations.length - 1];
        let dis = this.props.disableCustomerRelations;
        dis.pop();
        this.props.deleteCustomerRelations([...dis]);
        this.props.addCustomerRelations(values);
    };

    render() {
        return (
            <Row>
                <Col span={21}>
                    <Table
                        title={
                            this.props.isDetail
                                ? undefined
                                : () =>
                                    <div>
                                        <Button type="primary" onClick={this.add}><Icon type="usergroup-add"/>新增</Button>
                                        <Button type="primary" onClick={this.cancel}
                                                disabled={this.props.disableCustomerRelations <= 0}
                                                style={{marginLeft: 10}}><Icon
                                            type="rollback"/>撤销</Button>
                                    </div>}
                        rowClassName={() => 'editable-row'}
                        bordered
                        dataSource={this.props.customerRelations}
                        size='middle'
                        columns={this.columns}
                        pagination={false}
                    />
                    <QueryCustomer showFalse={() => this.setState({showAddCustomer: false})}
                                   show={this.state.showAddCustomer} {...this.props}/>
                </Col>
            </Row>
        )
    }
}

CustomerRelations.propTypes = {
    deleteCustomerRelations: PropTypes.func,
    addCustomerRelations: PropTypes.func,
    customerRelations: PropTypes.array
};
export default CustomerRelations;
