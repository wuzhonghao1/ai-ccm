// 账户信息
import React, {Component} from 'react';
import {Button, Col, Icon, Row, Table} from "antd";
import AddAccount from './addAccount';
import PropTypes from "prop-types";

class QueryAccount extends Component {
    state = {
        addAccountShow: false
    };

    add = () => {
        this.setState({addAccountShow: true});
    };

    deleteRow = (value) => {
        this.props.setDisableAccounts([...this.props.disableAccounts, value]);
        this.props.delAccount(value);
    };

    cancel = () => {
        // 将旧数据最后一个取出
        let values = this.props.disableAccounts[this.props.disableAccounts.length - 1];
        let dis = this.props.disableAccounts;
        dis.pop();
        this.props.setDisableAccounts([...dis]);
        this.props.addAccount(values);
    };

    // 行定义
    columns = [{
        title: '账户类型',
        dataIndex: 'accountTypeCode',
        width: '10%',
        render: (text, record) => (<div>{record.accountTypeCode.optionMeaning}</div>)
    }, {
        title: '账户名',
        dataIndex: 'accountName',
        width: '15%'
    }, {
        title: '开户行',
        dataIndex: 'bankOfDeposit',
        width: '15%'
    }, {
        title: '支行',
        dataIndex: 'bankBranch',
        width: '15%'
    }, {
        title: '银行帐户',
        dataIndex: 'bankAccount',
        width: '15%'
    }, {
        title: '币种',
        dataIndex: 'currency',
        width: '5%'
    }, {
        title: '描述',
        dataIndex: 'description',
        width: '10%'
    }, {
        title: '地址',
        dataIndex: 'address',
        width: '10%',
        render: (text, record) => (record.address !== null ?
            record.address.city ? (record.address.city[0].label +
            record.address.city[1].label +
            record.address.city[2].label) : '' +
            (record.address.address1 === undefined ? '' : record.address.address1) +
            (record.address.address2 === undefined ? '' : record.address.address2) +
            (record.address.address3 === undefined ? '' : record.address.address3) +
            (record.address.address4 === undefined ? '' : record.address.address4) : null)
    }, {
        title: '操作',
        dataIndex: 'del',
        width: '5%',
        render: (text, record) => (this.props.isDetail ? undefined : <Icon type="delete" onClick={() => this.deleteRow(record)}/>)
    }];

    render() {
        return (
            <div>
                <Row>
                    <Col span={21}>
                        <Table
                            title={(
                                this.props.isDetail
                                    ? undefined
                                    : () =>
                                        <div>
                                            <Button type="primary" onClick={this.add}><Icon
                                                type="usergroup-add"/>新增</Button>
                                            <Button type="primary" onClick={this.cancel}
                                                    disabled={this.props.disableAccounts <= 0}
                                                    style={{marginLeft: 10}}><Icon
                                                type="rollback"/>撤销</Button>
                                        </div>)}
                            bordered
                            dataSource={this.props.accounts}
                            size='middle'
                            columns={this.columns}
                            pagination={false}/>
                        <AddAccount showFalse={() => this.setState({addAccountShow: false})}
                                    show={this.state.addAccountShow} {...this.props}/>
                    </Col>
                </Row>
            </div>
        )
    }
}

QueryAccount.propTypes = {
    delAccount: PropTypes.func,
    addAccount: PropTypes.func,
    accounts: PropTypes.array
};
export default QueryAccount;
