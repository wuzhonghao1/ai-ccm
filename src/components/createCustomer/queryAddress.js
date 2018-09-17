// 地址信息
import React, {Component} from 'react';
import {Button, Col, Icon, Row, Table} from "antd";
import AddAddress from './addAddress';
import PropTypes from "prop-types";

class QueryAddress extends Component {

    state = {
        addModelShow: false
    };

    add = () => {

        this.setState({addModelShow: true});
    };
    deleteRow = (value) => {
        this.props.setDisableAddresses([...this.props.disableAddresses, value]);
        this.props.delAddress(value);
    };
    cancel = () => {
        // 将旧数据最后一个取出
        let values = this.props.disableAddresses[this.props.disableAddresses.length - 1];
        let dis = this.props.disableAddresses;
        dis.pop();
        this.props.setDisableAddresses([...dis]);
        this.props.addAddress(values);
    };
    // 行定义
    columns = [{
        title: '名称',
        dataIndex: 'addressName',
        width: '10%'
    }, {
        title: '描述',
        dataIndex: 'description',
        width: '10%'
    }, {
        title: '国家',
        dataIndex: 'territoryName',
        width: '6%'
    }, {
        title: '省',
        dataIndex: 'province',
        width: '5%',
        render: (text, record) => (<span>{record.city ? record.city[0].label : ''}</span>)
    }, {
        title: '市',
        dataIndex: 'city',
        width: '5%',
        render: (text, record) => (<span>{record.city ? record.city[1].label : ''}</span>)
    }, {
        title: '县',
        dataIndex: 'county',
        width: '5%',
        render: (text, record) => (<span>{record.city ? record.city[2].label : ''}</span>)
    }, {
        title: '详细地址',
        dataIndex: 'address1',
        width: '11%',
        render: (text, record) => {
            return record.address1 + record.address2 + record.address3 + record.address4
        }
    }, {
        title: '邮政编码',
        dataIndex: 'postCode',
        width: '6%'
    }, {
        title: '操作',
        dataIndex: 'del',
        width: '8%',
        render: (text, record) => ( this.props.isDetail ? undefined : <Icon type="delete" onClick={() => this.deleteRow(record)}/>)
    }];

    render() {
        return (
            <div>
                <Row>
                    <Col span={21}>
                        <Table
                            title={(
                                this.props.isDetail
                                    ? undefined :
                                    () =>
                                        <div>
                                            <Button type="primary" onClick={this.add}><Icon
                                                type="usergroup-add"/>新增</Button>
                                            <Button type="primary" onClick={this.cancel}
                                                    disabled={this.props.disableAddresses <= 0}
                                                    style={{marginLeft: 10}}><Icon type="rollback"/>撤销</Button>
                                        </div>)}
                            rowClassName={() => 'editable-row'}
                            bordered
                            dataSource={this.props.addresses}
                            size='middle'
                            columns={this.columns}
                            pagination={false}
                        />
                        <AddAddress showFalse={() => this.setState({addModelShow: false})}
                                    show={this.state.addModelShow} isAdmin={true} {...this.props}/>
                    </Col>
                </Row>
            </div>
        )
    }
}

QueryAddress.propTypes = {
    delAddress: PropTypes.func,
    addAddress: PropTypes.func,
    addresses: PropTypes.array
};
export default QueryAddress;
